// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document'

class HandcraftedHavenDocument extends Document {
  render() {
    return (
      <Html className="h-full">
        <Head />
        <body className="h-full bg-gray-100">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default HandcraftedHavenDocument;