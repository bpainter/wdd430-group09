// pages/_document.tsx

/**
 * Custom document component for the Handcrafted Haven application.
 * This component extends the Next.js Document component and provides the base HTML structure for all pages.
 */
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