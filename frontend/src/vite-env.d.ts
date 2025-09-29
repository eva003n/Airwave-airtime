/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_BASE_URI: string;
  readonly VITE_CLERK_PUBLISHABLE_KEY: string | undefined;
}

