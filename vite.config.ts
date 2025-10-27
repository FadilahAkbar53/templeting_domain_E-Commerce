// Fix: Add reference to node types to resolve issues with the global `process` object.
/// <reference types="node" />

import path from "path";
// Fix: The explicit import of `process` has been removed as it was causing a type error.
// In a Vite config file (a Node.js environment), `process` is a global object and does not need to be imported.
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

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
        "@": path.resolve(process.cwd(), "."),
      },
    },
  };
});
