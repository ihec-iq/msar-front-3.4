/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VUE_APP_SECRET_KEY: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }