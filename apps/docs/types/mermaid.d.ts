declare module 'mermaid' {
  interface MermaidConfig {
    startOnLoad?: boolean;
    theme?: string;
    logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    securityLevel?: 'strict' | 'loose' | 'antiscript';
    [key: string]: unknown;
  }

  export function initialize(config: MermaidConfig): void;
  export function render(
    id: string,
    text: string,
    callback?: (svgCode: string) => void
  ): Promise<{ svg: string }>;
  export function parse(text: string): void;
  export function parseError(err: Error, hash: Record<string, unknown>): void;
}
