import { useCallback, useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import type { DataConnection } from "peerjs";
import { QRCodeSVG } from "qrcode.react";
import SiteButton from "./SiteButton";

/**
 * Private peer-to-peer file transfer (WebRTC).
 * - Files travel directly between the two devices, encrypted by WebRTC (DTLS).
 * - A free public PeerJS signaling service only introduces the two devices. It never sees the files.
 * - The sender approves the receiver, each code works for one device and expires after 10 minutes.
 *
 * Styling: glassmorphism (frosted translucent card). Only class names were changed, the logic is untouched.
 */

const PEER_PREFIX = "paramshots-xfer-";
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 characters, no 0/O/1/I
const CODE_LENGTH = 8;
const CODE_TTL_MS = 10 * 60 * 1000;
const CONNECT_TIMEOUT_MS = 20000;
const READ_SIZE = 256 * 1024;
const CHUNK_SIZE = 16 * 1024;
const MAX_BUFFERED = 4 * 1024 * 1024; // pause sending when this much is queued
const BIG_TRANSFER_BYTES = 1024 * 1024 * 1024; // 1 GB

type SendStatus = "idle" | "waiting" | "pending" | "sending" | "done" | "error";
type RecvStatus = "idle" | "connecting" | "waiting" | "receiving" | "done" | "error";
type FileMeta = { name: string; size: number; type: string };
type ReceivedFile = FileMeta & { url: string };
type Progress = { index: number; count: number; bytes: number; totalBytes: number; name: string };

function makeCode(): string {
  const bytes = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

function normalizeCode(value: string): string {
  return value
    .toUpperCase()
    .split("")
    .filter((c) => CODE_ALPHABET.includes(c))
    .join("")
    .slice(0, CODE_LENGTH);
}

function formatCode(code: string): string {
  return code.length > 4 ? `${code.slice(0, 4)}-${code.slice(4)}` : code;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/50">
      <div
        className="h-full rounded-full bg-[#7A0000] transition-all duration-150"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}


export default function FileTransfer() {
  const [mode, setMode] = useState<"send" | "receive">("send");

  // ---- sender state ----
  const [files, setFiles] = useState<File[]>([]);
  const [sendStatus, setSendStatusState] = useState<SendStatus>("idle");
  const sendStatusRef = useRef<SendStatus>("idle");
  const setSendStatus = (s: SendStatus) => {
    sendStatusRef.current = s;
    setSendStatusState(s);
  };
  const [code, setCode] = useState("");
  const [sendError, setSendError] = useState("");
  const [sendProgress, setSendProgress] = useState<Progress | null>(null);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState("");

  // ---- receiver state ----
  const [codeInput, setCodeInput] = useState("");
  const [recvStatus, setRecvStatusState] = useState<RecvStatus>("idle");
  const recvStatusRef = useRef<RecvStatus>("idle");
  const setRecvStatus = (s: RecvStatus) => {
    recvStatusRef.current = s;
    setRecvStatusState(s);
  };
  const [recvError, setRecvError] = useState("");
  const [received, setReceived] = useState<ReceivedFile[]>([]);
  const [recvMetas, setRecvMetas] = useState<FileMeta[]>([]);
  const [recvProgress, setRecvProgress] = useState<Progress | null>(null);

  // ---- shared refs ----
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const expiryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wakeRef = useRef<{ release?: () => Promise<void> } | null>(null);
  const filesRef = useRef<File[]>([]);
  const receivedRef = useRef<ReceivedFile[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const rx = useRef({
    metas: [] as FileMeta[],
    index: 0,
    chunks: [] as ArrayBuffer[],
    bytes: 0,
    totalBytes: 0,
    lastUi: 0,
  });

  filesRef.current = files;
  receivedRef.current = received;

  const cleanup = useCallback(() => {
    if (expiryRef.current) clearTimeout(expiryRef.current);
    if (connectTimerRef.current) clearTimeout(connectTimerRef.current);
    expiryRef.current = null;
    connectTimerRef.current = null;

    const conn = connRef.current;
    connRef.current = null; // set first so close handlers ignore this event
    try {
      conn?.close();
    } catch {
      /* already closed */
    }

    const peer = peerRef.current;
    peerRef.current = null;
    try {
      peer?.destroy();
    } catch {
      /* already destroyed */
    }

    try {
      wakeRef.current?.release?.();
    } catch {
      /* ignore */
    }
    wakeRef.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  // Keep the screen awake while transferring (not supported everywhere)
  const keepAwake = async () => {
    try {
      if (!wakeRef.current) {
        const nav = navigator as unknown as { wakeLock?: { request: (t: string) => Promise<{ release?: () => Promise<void> }> } };
        wakeRef.current = (await nav.wakeLock?.request("screen")) ?? null;
      }
    } catch {
      /* ignore */
    }
  };

  const busy =
    sendStatus === "waiting" ||
    sendStatus === "pending" ||
    sendStatus === "sending" ||
    recvStatus === "connecting" ||
    recvStatus === "waiting" ||
    recvStatus === "receiving";

  // Warn before leaving the page in the middle of a transfer
  useEffect(() => {
    if (!busy) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [busy]);

  // A share link looks like /transfer#code=ABCD-EFGH. Prefill the code and open the Receive tab.
  useEffect(() => {
    const match = window.location.hash.match(/code=([A-Za-z0-9-]+)/);
    if (match) {
      setMode("receive");
      setCodeInput(formatCode(normalizeCode(match[1])));
    }
  }, []);

  // =========================== SEND ===========================

  const addFiles = (list: FileList | File[] | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    if (!incoming.length) return;
    setFiles((prev) => [...prev, ...incoming]);
  };

  const failSend = (message: string) => {
    cleanup();
    setSendError(message);
    setSendStatus("error");
  };

  const resetSend = () => {
    cleanup();
    setFiles([]);
    setCode("");
    setSendError("");
    setSendProgress(null);
    setSendStatus("idle");
  };

  const startSending = () => {
    if (!filesRef.current.length) return;
    cleanup();
    setSendError("");
    setSendProgress(null);

    const attempt = (n: number) => {
      const newCode = makeCode();
      const peer = new Peer(PEER_PREFIX + newCode);
      peerRef.current = peer;

      peer.on("open", () => {
        if (peerRef.current !== peer) return;
        setCode(newCode);
        setSendStatus("waiting");
        expiryRef.current = setTimeout(() => {
          if (sendStatusRef.current === "waiting") failSend("This code expired. Start again to get a new one.");
        }, CODE_TTL_MS);
      });

      peer.on("error", (err: { type?: string }) => {
        if (peerRef.current !== peer) return;
        if (err.type === "unavailable-id" && n < 4) {
          peerRef.current = null;
          peer.destroy();
          attempt(n + 1);
          return;
        }
        failSend("Could not reach the transfer service. Check your internet connection and try again.");
      });

      peer.on("connection", (conn) => {
        if (peerRef.current !== peer) return;
        if (connRef.current) {
          // Only one receiver per code
          conn.on("open", () => conn.close());
          return;
        }
        connRef.current = conn;

        conn.on("open", () => {
          if (connRef.current === conn) setSendStatus("pending");
        });

        conn.on("data", (data: unknown) => {
          if (connRef.current !== conn || typeof data !== "string") return;
          try {
            if (JSON.parse(data).t === "ack") {
              setSendStatus("done");
              cleanup();
            }
          } catch {
            /* ignore */
          }
        });

        const lost = () => {
          if (connRef.current !== conn) return;
          connRef.current = null;
          if (sendStatusRef.current === "sending") {
            failSend("The connection was lost before the transfer finished. Please try again.");
          } else if (sendStatusRef.current === "pending") {
            setSendStatus("waiting");
          }
        };
        conn.on("close", lost);
        conn.on("error", lost);
      });
    };

    attempt(0);
  };

  const streamFiles = async (conn: DataConnection) => {
    const list = filesRef.current;
    const channel = conn.dataChannel;
    const totalBytes = list.reduce((sum, f) => sum + f.size, 0);
    const closed = () => connRef.current !== conn;

    conn.send(
      JSON.stringify({
        t: "meta",
        files: list.map((f) => ({ name: f.name, size: f.size, type: f.type })),
      })
    );

    let sent = 0;
    let lastUi = 0;

    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      conn.send(JSON.stringify({ t: "start", index: i }));

      for (let offset = 0; offset < file.size; offset += READ_SIZE) {
        const block = await file.slice(offset, offset + READ_SIZE).arrayBuffer();

        for (let o = 0; o < block.byteLength; o += CHUNK_SIZE) {
          if (closed()) throw new Error("closed");
          while (channel.bufferedAmount > MAX_BUFFERED) {
            await sleep(20);
            if (closed()) throw new Error("closed");
          }
          const piece = block.slice(o, o + CHUNK_SIZE);
          conn.send(piece);
          sent += piece.byteLength;
        }

        const now = performance.now();
        if (now - lastUi > 120) {
          lastUi = now;
          setSendProgress({ index: i, count: list.length, bytes: sent, totalBytes, name: file.name });
        }
      }

      conn.send(JSON.stringify({ t: "end", index: i }));
    }

    conn.send(JSON.stringify({ t: "done" }));
    setSendProgress({ index: list.length - 1, count: list.length, bytes: totalBytes, totalBytes, name: "" });
  };

  const allow = async () => {
    const conn = connRef.current;
    if (!conn) return;
    setSendStatus("sending");
    keepAwake();
    try {
      await streamFiles(conn);
    } catch {
      if (sendStatusRef.current === "sending") failSend("The transfer was interrupted. Please try again.");
    }
  };

  const decline = () => {
    const conn = connRef.current;
    connRef.current = null;
    try {
      conn?.send(JSON.stringify({ t: "declined" }));
      setTimeout(() => conn?.close(), 300);
    } catch {
      /* ignore */
    }
    setSendStatus("waiting");
  };

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* clipboard not available */
    }
  };

  // ========================== RECEIVE ==========================

  const failRecv = (message: string) => {
    cleanup();
    setRecvError(message);
    setRecvStatus("error");
  };

  const resetRecv = () => {
    cleanup();
    receivedRef.current.forEach((f) => URL.revokeObjectURL(f.url));
    setReceived([]);
    setRecvMetas([]);
    setRecvProgress(null);
    setRecvError("");
    setRecvStatus("idle");
  };

  const handleRecvMessage = (conn: DataConnection, data: unknown) => {
    if (connRef.current !== conn) return;

    if (typeof data === "string") {
      let msg: { t?: string; files?: FileMeta[]; index?: number };
      try {
        msg = JSON.parse(data);
      } catch {
        return;
      }

      if (msg.t === "meta" && Array.isArray(msg.files)) {
        const metas = msg.files;
        const totalBytes = metas.reduce((sum, f) => sum + (Number(f.size) || 0), 0);
        rx.current = { metas, index: 0, chunks: [], bytes: 0, totalBytes, lastUi: 0 };
        setRecvMetas(metas);
        setReceived([]);
        setRecvProgress({ index: 0, count: metas.length, bytes: 0, totalBytes, name: metas[0]?.name ?? "" });
        setRecvStatus("receiving");
        keepAwake();
      } else if (msg.t === "start") {
        rx.current.index = Number(msg.index) || 0;
        rx.current.chunks = [];
      } else if (msg.t === "end") {
        const meta = rx.current.metas[rx.current.index];
        if (!meta) return;
        const blob = new Blob(rx.current.chunks, { type: meta.type || "application/octet-stream" });
        rx.current.chunks = [];
        const url = URL.createObjectURL(blob);
        setReceived((prev) => [...prev, { ...meta, url }]);
      } else if (msg.t === "done") {
        try {
          conn.send(JSON.stringify({ t: "ack" }));
        } catch {
          /* ignore */
        }
        setRecvProgress((p) => (p ? { ...p, bytes: p.totalBytes } : p));
        setRecvStatus("done");
        setTimeout(() => {
          if (connRef.current === conn) cleanup();
        }, 1500);
      } else if (msg.t === "declined") {
        failRecv("The sender declined the transfer.");
      }
      return;
    }

    // Binary chunk
    let buf: ArrayBuffer | null = null;
    if (data instanceof ArrayBuffer) {
      buf = data;
    } else if (ArrayBuffer.isView(data)) {
      buf = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
    }
    if (!buf) return;

    rx.current.chunks.push(buf);
    rx.current.bytes += buf.byteLength;
    const now = performance.now();
    if (now - rx.current.lastUi > 120) {
      rx.current.lastUi = now;
      const { index, metas, bytes, totalBytes } = rx.current;
      setRecvProgress({ index, count: metas.length, bytes, totalBytes, name: metas[index]?.name ?? "" });
    }
  };

  const connect = () => {
    const cleanCode = normalizeCode(codeInput);
    if (cleanCode.length !== CODE_LENGTH) {
      setRecvError("Enter the 8-character code shown on the sending device.");
      setRecvStatus("error");
      return;
    }

    cleanup();
    setRecvError("");
    setReceived([]);
    setRecvMetas([]);
    setRecvProgress(null);
    setRecvStatus("connecting");

    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", () => {
      if (peerRef.current !== peer) return;
      const conn = peer.connect(PEER_PREFIX + cleanCode, { reliable: true, serialization: "raw" });
      connRef.current = conn;

      connectTimerRef.current = setTimeout(() => {
        if (recvStatusRef.current === "connecting") {
          failRecv("Could not connect. Check the code, and make sure both devices are online.");
        }
      }, CONNECT_TIMEOUT_MS);

      conn.on("open", () => {
        if (connRef.current !== conn) return;
        if (connectTimerRef.current) clearTimeout(connectTimerRef.current);
        setRecvStatus("waiting"); // waiting for the sender to approve
      });
      conn.on("data", (data: unknown) => handleRecvMessage(conn, data));

      const lost = () => {
        if (connRef.current !== conn) return;
        connRef.current = null;
        const s = recvStatusRef.current;
        if (s === "receiving" || s === "waiting" || s === "connecting") {
          failRecv("The connection was lost before the transfer finished. Please try again.");
        }
      };
      conn.on("close", lost);
      conn.on("error", lost);
    });

    peer.on("error", (err: { type?: string }) => {
      if (peerRef.current !== peer) return;
      if (err.type === "peer-unavailable") {
        failRecv("Code not found or expired. Check the code, or ask the sender for a new one.");
      } else {
        failRecv("Could not reach the transfer service. Check your internet connection and try again.");
      }
    });
  };

  const saveAll = async () => {
    for (const f of receivedRef.current) {
      const a = document.createElement("a");
      a.href = f.url;
      a.download = f.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      await sleep(400);
    }
  };

  // ============================ UI ============================

  const totalSelected = files.reduce((sum, f) => sum + f.size, 0);
  const shareLink = code ? `${window.location.origin}/transfer#code=${code}` : "";

  const sendUI = () => {
    if (sendStatus === "waiting") {
      return (
        <div className="text-center">
          <p className="text-sm text-[#4b5563]">
            On your own device, open this page, tap <strong>Receive</strong>, and enter this code, or scan the QR code.
          </p>
          <div
            className="mt-4 select-all text-4xl font-extrabold tracking-[0.18em] text-[#7A0000]"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {formatCode(code)}
          </div>
          {/* The QR code keeps a solid white background so phones can scan it reliably */}
          <div className="mx-auto mt-4 w-fit rounded-xl border border-white/70 bg-white p-3 shadow-md">
            <QRCodeSVG value={shareLink} size={148} fgColor="#1c1c1e" />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <SiteButton variant="outline" onClick={() => copy("code", formatCode(code))}>
              {copied === "code" ? "Copied!" : "Copy code"}
            </SiteButton>
            <SiteButton variant="outline" onClick={() => copy("link", shareLink)}>
              {copied === "link" ? "Copied!" : "Copy link"}
            </SiteButton>
          </div>
          <p className="mt-4 text-xs text-[#4b5563]">
            Waiting for your device to connect… Keep this page open. The code expires in 10 minutes and works for one
            device.
          </p>
          <button type="button" onClick={resetSend} className="mt-3 text-xs font-semibold text-[#7A0000] hover:underline">
            Cancel
          </button>
        </div>
      );
    }

    if (sendStatus === "pending") {
      return (
        <div className="text-center">
          <div className="text-base font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>
            A device wants to receive {files.length} {files.length === 1 ? "file" : "files"}
          </div>
          <p className="mt-2 text-sm text-[#4b5563]">
            Only allow this if it is your own device. If you do not recognize it, decline.
          </p>
          <div className="mt-5 flex gap-3">
            <SiteButton variant="outline" onClick={decline} style={{ flex: 1 }}>
              Decline
            </SiteButton>
            <SiteButton variant="primary" onClick={allow} style={{ flex: 1 }}>
              Allow &amp; send
            </SiteButton>
          </div>
        </div>
      );
    }

    if (sendStatus === "sending") {
      const pct = sendProgress && sendProgress.totalBytes ? (sendProgress.bytes / sendProgress.totalBytes) * 100 : 0;
      const finishing = sendProgress && sendProgress.bytes >= sendProgress.totalBytes;
      return (
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">{finishing ? "Finishing up…" : "Sending…"}</span>
            <span className="text-[#4b5563]">{Math.round(pct)}%</span>
          </div>
          <div className="mt-2">
            <ProgressBar percent={pct} />
          </div>
          <p className="mt-3 truncate text-xs text-[#4b5563]">
            {sendProgress
              ? `File ${Math.min(sendProgress.index + 1, sendProgress.count)} of ${sendProgress.count}${sendProgress.name ? ` · ${sendProgress.name}` : ""} · ${formatBytes(sendProgress.bytes)} of ${formatBytes(sendProgress.totalBytes)}`
              : "Starting…"}
          </p>
          <p className="mt-3 text-xs text-[#4b5563]">Keep this screen on and this page open until it says Done.</p>
        </div>
      );
    }

    if (sendStatus === "done") {
      return (
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100/80 text-emerald-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="mt-3 text-base font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>
            Transfer complete
          </div>
          <p className="mt-1 text-sm text-[#4b5563]">
            Check that the files opened on your device before deleting anything from this phone.
          </p>
          <SiteButton variant="primary" full onClick={resetSend} style={{ marginTop: 20 }}>
            Send more files
          </SiteButton>
        </div>
      );
    }

    // idle or error: choose files
    return (
      <div>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/*,video/*,.zip,application/zip,application/x-zip-compressed"
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div
          onClick={() => fileInput.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-solid border-[#7A0000] px-4 py-10 text-center backdrop-blur-sm transition-colors ${
            dragging ? "bg-white/60" : "bg-white/25 hover:bg-white/40"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/60 text-[#7A0000] shadow-sm">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
          </div>
          <div className="mt-3 text-sm font-semibold">Tap to choose photos, videos, or ZIP files</div>
          <div className="mt-1 text-xs text-[#4b5563]">or drop files here</div>
        </div>

        {files.length > 0 && (
          <ul className="mt-4 max-h-44 space-y-2 overflow-y-auto">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 rounded-lg border border-white/50 bg-white/40 px-3 py-2 text-sm">
                <span className="truncate">{f.name}</span>
                <span className="flex flex-shrink-0 items-center gap-3 text-xs text-[#4b5563]">
                  {formatBytes(f.size)}
                  <button
                    type="button"
                    aria-label={`Remove ${f.name}`}
                    onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-[#7A0000] hover:underline"
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}

        {totalSelected > BIG_TRANSFER_BYTES && (
          <p className="mt-3 rounded-lg bg-amber-50/80 px-3 py-2 text-xs text-amber-800">
            This is a big transfer ({formatBytes(totalSelected)}). The receiving device holds the files in memory while
            they arrive, so a computer works best, or send them in smaller batches.
          </p>
        )}

        {sendStatus === "error" && sendError && (
          <p className="mt-3 rounded-lg bg-red-50/80 px-3 py-2 text-xs text-red-700">{sendError}</p>
        )}

        <SiteButton variant="primary" full onClick={startSending} disabled={!files.length} style={{ marginTop: 16 }}>
          Create transfer code
        </SiteButton>
      </div>
    );
  };

  const receiveUI = () => {
    if (recvStatus === "connecting" || recvStatus === "waiting") {
      return (
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#7A0000]/20 border-t-[#7A0000]" />
          <div className="mt-3 text-sm font-semibold">
            {recvStatus === "connecting" ? "Connecting…" : "Waiting for the sender to approve…"}
          </div>
          <p className="mt-1 text-xs text-[#4b5563]">
            {recvStatus === "waiting" ? "Tap “Allow & send” on the other device." : "This can take a few seconds."}
          </p>
          <button type="button" onClick={resetRecv} className="mt-4 text-xs font-semibold text-[#7A0000] hover:underline">
            Cancel
          </button>
        </div>
      );
    }

    if (recvStatus === "receiving" || recvStatus === "done") {
      const pct = recvProgress && recvProgress.totalBytes ? (recvProgress.bytes / recvProgress.totalBytes) * 100 : 0;
      return (
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">{recvStatus === "done" ? "Transfer complete" : "Receiving…"}</span>
            <span className="text-[#4b5563]">{Math.round(recvStatus === "done" ? 100 : pct)}%</span>
          </div>
          <div className="mt-2">
            <ProgressBar percent={recvStatus === "done" ? 100 : pct} />
          </div>
          {recvStatus === "receiving" && recvProgress && (
            <p className="mt-3 truncate text-xs text-[#4b5563]">
              File {Math.min(recvProgress.index + 1, recvProgress.count)} of {recvProgress.count}
              {recvProgress.name ? ` · ${recvProgress.name}` : ""} · {formatBytes(recvProgress.bytes)} of{" "}
              {formatBytes(recvProgress.totalBytes)}
            </p>
          )}

          {received.length > 0 && (
            <ul className="mt-4 max-h-52 space-y-2 overflow-y-auto">
              {received.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 rounded-lg border border-white/50 bg-white/40 px-3 py-2 text-sm">
                  <span className="truncate">
                    {f.name} <span className="text-xs text-[#4b5563]">· {formatBytes(f.size)}</span>
                  </span>
                  <a
                    href={f.url}
                    download={f.name}
                    className="flex-shrink-0 rounded-lg bg-[#7A0000] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#5a0000]"
                  >
                    Save
                  </a>
                </li>
              ))}
            </ul>
          )}

          {recvStatus === "receiving" && (
            <p className="mt-3 text-xs text-[#4b5563]">Keep this screen on and this page open until it says complete.</p>
          )}

          {recvStatus === "done" && (
            <div className="mt-4 flex gap-3">
              {received.length > 1 && (
                <SiteButton variant="primary" onClick={saveAll} style={{ flex: 1 }}>
                  Save all
                </SiteButton>
              )}
              <SiteButton variant="outline" onClick={resetRecv} style={{ flex: 1 }}>
                Receive more
              </SiteButton>
            </div>
          )}
          {recvStatus === "done" && recvMetas.length > received.length && (
            <p className="mt-3 text-xs text-amber-700">Some files did not arrive. Please try the transfer again.</p>
          )}
        </div>
      );
    }

    // idle or error
    return (
      <div>
        <label htmlFor="transfer-code" className="text-sm font-semibold">
          Enter the code from the sending device
        </label>
        <input
          id="transfer-code"
          name="transfer-code"
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          value={codeInput}
          onChange={(e) => setCodeInput(formatCode(normalizeCode(e.target.value)))}
          onKeyDown={(e) => {
            if (e.key === "Enter") connect();
          }}
          placeholder="ABCD-EFGH"
          className="mt-2 w-full rounded-xl border border-white/60 bg-white/50 px-4 py-3 text-center text-2xl font-bold tracking-[0.2em] backdrop-blur-sm focus:border-[#7A0000]/50 focus:outline-none focus:ring-2 focus:ring-[#7A0000]/10"
        />
        {recvStatus === "error" && recvError && (
          <p className="mt-3 rounded-lg bg-red-50/80 px-3 py-2 text-xs text-red-700">{recvError}</p>
        )}
        <SiteButton
          variant="primary"
          full
          onClick={connect}
          disabled={normalizeCode(codeInput).length !== CODE_LENGTH}
          style={{ marginTop: 16 }}
        >
          Connect
        </SiteButton>
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-3xl border border-white/60 bg-white/40 text-left shadow-[0_8px_32px_rgba(122,0,0,0.15)] backdrop-blur-xl">
      <div className="flex items-center justify-center border-b border-white/40 px-5 py-3">
        <div className="inline-flex rounded-full border border-white/50 bg-white/30 p-1 backdrop-blur-md" role="group" aria-label="Transfer mode">
          {(["send", "receive"] as const).map((m) => (
            <button
              key={m}
              type="button"
              disabled={busy && mode !== m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                mode === m ? "bg-[#7A0000] text-white shadow-md" : "text-[#4b5563] hover:text-[#1c1c1e]"
              }`}
            >
              {m === "send" ? "Send" : "Receive"}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">{mode === "send" ? sendUI() : receiveUI()}</div>

      <div className="border-t border-white/40 px-5 py-3 text-center text-[11px] uppercase tracking-wider text-[#6b7280]">
        End-to-end encrypted. Files are never stored on a server.
      </div>
    </div>
  );
}
