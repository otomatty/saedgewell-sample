declare module 'next-themes' {
  import type { ReactNode } from 'react';

  export interface UseThemeProps {
    themes?: string[];
    forcedTheme?: string;
    setTheme: (theme: string) => void;
    theme?: string;
    resolvedTheme?: string;
    systemTheme?: 'dark' | 'light';
  }

  export interface ThemeProviderProps {
    children: ReactNode;
    attribute?: string;
    defaultTheme?: string;
    forcedTheme?: string;
    disableTransitionOnChange?: boolean;
    enableSystem?: boolean;
    enableColorScheme?: boolean;
    storageKey?: string;
    themes?: string[];
    value?: { [themeName: string]: string };
  }

  export function useTheme(): UseThemeProps;
  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
}
