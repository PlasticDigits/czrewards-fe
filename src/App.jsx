import { Button, Divider, Stack, TextField } from '@mui/material';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { Web3Button, Web3Modal } from '@web3modal/react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { bsc } from 'wagmi/chains';
import BaseThemeProvider from '../providers/BaseThemeProvider';
import czrewardsLogo from './assets/czrewards-logo.png';

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
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginBottom: 16,
              }}
            />
          </a>
          <h2 css={{ fontWeight: 'bold' }}>Setup Account</h2>
          1. Connect your Wallet: <br />
          <Web3Button />
          <br />
          <br />
          2. Register Your Code: <br />
          <TextField label="YourCodeName" variant="standard" />
          <br />
          <Button css={{ marginTop: 8, marginBottom: 8 }} variant="outlined">
            Register (5 CZUSD)
          </Button>
          <br />
          Need CZUSD?{' '}
          <a
            target="_blank"
            href="https://cz.cash/#/swap?inputCurrency=BNB&outputCurrency=0xE68b79e51bf826534Ff37AA9CeE71a3842ee9c70"
          >
            Buy on CZ.Cash
          </a>{' '}
          or{' '}
          <a target="_blank" href="https://t.me/CZodiacofficial">
            Ask for help on Telegram
          </a>
          <br />
          <br />
          <hr />
          <h2>Manage Account</h2>
          <Stack
            direction="row"
            justifyContent="center"
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <div>
              <h3>Your Referral Link</h3>
              <p>
                Share this link to earn rewards <br />
                from anyone who registers with it.
              </p>
            </div>
            <div>
              <h3>Claim Rewards</h3>
            </div>
            <div>
              <h3>Upgrade Tier</h3>
            </div>
          </Stack>
          <hr />
          <h2>Account Stats</h2>
        </div>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </BaseThemeProvider>
  );
}

export default App;
