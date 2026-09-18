type GenoveErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type GenoveEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: GenoveErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __genoveEvents?: GenoveEvents;
  }
}

export function reportGenoveError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.__genoveEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}
