import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useMemo } from 'react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';

//css import for wallet connector
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

/*
set the providers for : 1. Connection
                          2. Wallet
                          3. WalletModal
for the whole App
*/
const MyApp = ({ Component, pageProps }: AppProps) => {
  //set network
  const network = 'http://localhost:8899';
  //rpc endpoint
  const endPoint = useMemo(() => network, [network]);
  //Wallet list on the walletModal
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  /**
   * Connection provider provides chain info and rpc endpoint
   * Wallet provider provides the wallet list to the child components
   */
  return (
    <ConnectionProvider endpoint={endPoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default MyApp;
