import { AuthContextProvider } from '@/context/AuthContext'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document(children) {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </Html>
  )
}
