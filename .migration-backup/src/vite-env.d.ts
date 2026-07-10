/// <reference types="vite/client" />

declare module "react-katex" {
  import * as React from "react";

  interface KatexProps {
    math: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
    settings?: {
      displayMode?: boolean;
      throwOnError?: boolean;
      errorColor?: string;
      macros?: Record<string, string>;
      colorIsTextColor?: boolean;
      maxSize?: number;
      maxExpand?: number;
      trust?: boolean;
    };
  }

  export const InlineMath: React.FC<KatexProps>;
  export const BlockMath: React.FC<KatexProps>;
}
