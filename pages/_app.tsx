import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';

function HandcraftedHavenPage({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <SessionProvider session={pageProps.session}>
        <Navigation />
        <main className="flex-grow p-10 bg-gray-100 text-gray-700">
          <Component {...pageProps} />
        </main>
        <Footer />
      </SessionProvider>    
    </div>
  );
}

export default HandcraftedHavenPage;
