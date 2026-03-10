console.log(import.meta.env);
export const API_BASE = import.meta.env.VITE_API_BASE || "https://api.fudge-bit.me";
export const WS_BASE = import.meta.env.VITE_WS_BASE || "wss://api.fudge-bit.me";
