'use client';
import { AuthContextProvider } from '@/firebase/AuthContext';
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}
