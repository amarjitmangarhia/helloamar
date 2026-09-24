/// <reference types="vite/client" />
/// <reference types="vite-plugin-glsl/ext" />

interface ImportMetaEnv {
  /** Web3Forms access key for the /contact form. Get one free at web3forms.com. See .env.example. */
  readonly VITE_FORM_KEY?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
