import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';

function HandcraftedHaven({ Component, pageProps }: AppProps) {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <Navigation />
        <Component {...pageProps} />
        <Footer />
      </SessionProvider>    
    </>
  );
}

export default HandcraftedHaven;
