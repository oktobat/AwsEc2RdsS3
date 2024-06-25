import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define : {
    'import.meta.env.VITE_API_URL' : JSON.stringify('http://퍼블릭 IPv4 DNS'),
    
    'import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID': JSON.stringify('본인 구글키'),
    'import.meta.env.VITE_GOOGLE_AUTH_REDIRECT_URI': JSON.stringify('http://퍼블릭 IPv4 DNS/callback'),

    'import.meta.env.VITE_KAKAO_AUTH_CLIENT_ID': JSON.stringify('본인 카카오앱키'),
    'import.meta.env.VITE_KAKAO_AUTH_REDIRECT_URI': JSON.stringify('http://퍼블릭 IPv4 DNS/oauth'),

    'import.meta.env.VITE_NAVER_AUTH_CLIENT_ID': JSON.stringify('본인 네이버아이디로그인 앱키'),
    'import.meta.env.VITE_NAVER_AUTH_REDIRECT_URI': JSON.stringify('http://퍼블릭 IPv4 DNS/oauth')
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})