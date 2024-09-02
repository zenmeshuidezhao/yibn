import type { AppConfig, Plugin } from "vue";

export type SFCWithInstall<T> = T & Plugin;
export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
  _context: AppConfig | null;
};