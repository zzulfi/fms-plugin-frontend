/// <reference types="vite/client" />

export const envConfig = {
  API_BASE_URL: (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:3000',
  NODE_ENV: (import.meta as any)?.env?.NODE_ENV || 'development',
} as const;