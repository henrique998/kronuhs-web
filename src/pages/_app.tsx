import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Providers } from '../contexts/Providers';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
        <Header />
          <Component {...pageProps} />
          <Toaster />
        <Footer />
    </Providers>
  );
}

export default MyApp
