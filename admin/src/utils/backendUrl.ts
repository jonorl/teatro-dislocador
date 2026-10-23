// Same production check main.tsx uses for the Clerk key, so the dashboard and its login always agree.
export default function backendUrl(env: ImportMetaEnv): string {
  const isProd = env.MODE === "PROD" || env.PROD;
  return isProd ? env.VITE_DISLOCADOR_PROD_BACKEND : env.VITE_DISLOCADOR_DEV_BACKEND;
}
