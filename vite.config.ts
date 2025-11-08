// FIX: The reference to node types was removed as it caused a "Cannot find type definition file" error.
// A workaround using import.meta.url is now used to get the project root directory, avoiding `process.cwd()` and its typing issues.

import path from "path";
// FIX: import `fileURLToPath` to support defining `__dirname` in an ES module.
import { fileURLToPath } from "url";
// Fix: The explicit import of `process` has been removed as it was causing a type error.
// In a Vite config file (a Node.js environment), `process` is a global object and does not need to be imported.
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// FIX: Define `__dirname` for an ES module context.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
    plugins: [react()],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        // Fix: `__dirname` is not available in an ES module context.
        // `process.cwd()` is used as a reliable alternative to get the project root.
        // FIX: Replaced `process.cwd()` with the recreated `__dirname` to avoid type errors.
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
