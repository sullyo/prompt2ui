"use client";

import * as React from "react";

export interface UseCopyToClipboardProps {
  timeout?: number;
}

export function useCopyToClipboard({
  timeout = 2000,
}: UseCopyToClipboardProps = {}) {
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = async (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    if (!value) {
      return;
    }

    await navigator.clipboard.writeText(value);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, timeout);
  };

  return { isCopied, copyToClipboard };
}
