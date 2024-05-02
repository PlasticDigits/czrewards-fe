import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiConfig } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import czrewardsLogo from './assets/czrewards-logo.png';
import AccountManager from './components/cardmanagers/AccountManager';
import BottomBar from './components/layouts/BottomBar';
import BaseThemeProvider from './providers/BaseThemeProvider';
import ConnectWallet from './components/elements/ConnectWallet';

//WAGMI + WALLETCONNECT
if (!import.meta.env.VITE_WALLETCONNECT_CLOUD_ID) {
  throw new Error('You need to provide WALLETCONNECT_CLOUD_ID env variable');
}
const projectId = import.meta.env.VITE_WALLETCONNECT_CLOUD_ID;
const chains = [bsc];

const metadata = {
  name: 'CZ Rewards',
  description: 'Cashback & Referal rewards from CZODIAC dapps.',
  url: 'https://rewards.cz.cash',
  icons: ['https://rewards.cz.cash/logo.png'],
};
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });
const queryClient = new QueryClient();

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains, defaultChain: bsc });

function App() {
  return (
    <BaseThemeProvider>
      <WagmiConfig config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <div className="App">
            <br />
            <a href="https://rewards.cz.cash" target="_blank">
              <img
                src={czrewardsLogo}
                css={{
                  maxWidth: 360,
                  width: '90vw',
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: 16,
                  marginBottom: 16,
                }}
              />
            </a>
            1. Connect your Wallet: <br />
            <ConnectWallet />
            <br />
            <br />
            <hr />
            <AccountManager />
            <BottomBar />
          </div>
        </QueryClientProvider>
      </WagmiConfig>
    </BaseThemeProvider>
  );
}

export default App;
