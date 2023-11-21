import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';

function HandcraftedHavenPage({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow bg-gray-100">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>    
    </SessionProvider>
  );
}

export default HandcraftedHavenPage;
