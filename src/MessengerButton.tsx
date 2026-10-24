const MESSENGER_URL = "https://m.me/61578515921428";

export default function MessengerButton() {
  return (
    <a
      href={MESSENGER_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with ParamShots on Messenger"
      title="Chat with us on Messenger"
      className="fixed bottom-6 right-6 z-[100] flex h-20 w-20 items-center justify-center rounded-full bg-[#990000] text-white shadow-xl transition hover:scale-105 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0084FF]/40 sm:h-24 sm:w-24"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-11 w-11 sm:h-14 sm:w-14"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2C6.48 2 2 6.15 2 11.27c0 2.92 1.45 5.52 3.72 7.24V22l3.4-1.87c.91.25 1.88.39 2.88.39 5.52 0 10-4.15 10-9.26S17.52 2 12 2Zm1 12.45-2.55-2.72-4.98 2.72 5.48-5.81 2.61 2.72 4.92-2.72L13 14.45Z" />
      </svg>
    </a>
  );
}
