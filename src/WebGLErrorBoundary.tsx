import { Component, type ReactNode } from "react";

/** Shown when WebGL is unavailable. */
export function WebGLFallback({
  className = "",
  message = "This needs WebGL, which is unavailable in this browser.",
}: {
  className?: string;
  message?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-[#fafaf9] p-6 text-center text-sm text-[#6b7280] ${className}`}
    >
      {message}
    </div>
  );
}

/** Catches render errors from the WebGL carousel and shows the fallback instead. */
export class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
