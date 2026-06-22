"use client";

import { useEffect } from "react";

// Catches errors thrown in the root layout itself (must render its own <html>).
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error boundary]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ color: "#555", maxWidth: "28rem" }}>
          The page failed to load. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            borderRadius: "0.375rem",
            background: "#0057B8",
            color: "white",
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
