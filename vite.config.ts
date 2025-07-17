import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sha256 } from "js-sha256";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 4173, // 可根据需要修改端口
  },
});
