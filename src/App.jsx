import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { Web3Button, Web3Modal } from '@web3modal/react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { bsc } from 'wagmi/chains';
import czrewardsLogo from './assets/czrewards-logo.png';
import AccountManager from './components/cardmanagers/AccountManager';
import BottomBar from './components/layouts/BottomBar';
import BaseThemeProvider from './providers/BaseThemeProvider';

//WAGMI + WALLETCONNECT
if (!import.meta.env.VITE_WALLETCONNECT_CLOUD_ID) {
  throw new Error('You need to provide WALLETCONNECT_CLOUD_ID env variable');
}
const projectId = import.meta.env.VITE_WALLETCONNECT_CLOUD_ID;
const chains = [bsc];
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    version: '1',
    appName: 'CZ Rewards',
    chains,
    projectId,
  }),
  provider,
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

function App() {
  /*
  
  const {
    config: configCashbackRecaptureAccounts,
    error: errorCashbackRecaptureAccounts,
  } = usePrepareContractWrite({
    address: ADDRESS_CASHBACK,
    abi: CashbackAbi,
    functionName: 'recaptureAccounts',
  });
  const writeCashbackRecaptureAccounts = useContractWrite(
    configCashbackRecaptureAccounts
  );*/

  return (
    <BaseThemeProvider>
      <WagmiConfig client={wagmiClient}>
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
          <Web3Button />
          <br />
          <br />
          <hr />
          <AccountManager />
          <BottomBar />
        </div>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </BaseThemeProvider>
  );
}

export default App;
