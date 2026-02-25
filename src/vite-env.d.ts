/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LEXIGAP_RANDOM_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
