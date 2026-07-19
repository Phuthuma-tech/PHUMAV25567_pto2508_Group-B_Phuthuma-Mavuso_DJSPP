import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/PHUMAV25567_pto2508_Group-B_Phuthuma-Mavuso_DJSPP",
});
