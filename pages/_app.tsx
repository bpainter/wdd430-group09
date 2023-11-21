import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';

/**
 * Renders the HandcraftedHavenPage component.
 * 
 * @param {AppProps} props - The component props.
 * @param {React.ComponentType} props.Component - The component to render.
 * @param {object} props.pageProps - The page props.
 * @param {object} props.pageProps.session - The session object.
 * @returns {JSX.Element} The rendered component.
 */
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
