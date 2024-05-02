import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import makeBlockie from 'ethereum-blockies-base64';
import React from 'react';
import { useAccount, useChainId, useDisconnect } from 'wagmi';
import { bsc } from 'wagmi/chains';

export default function ConnectWallet(sx) {
  const { open: web3ModalOpen } = useWeb3Modal();
  const { address } = useAccount();
  const { chainId } = useChainId();
  return !!address ? (
    <>
      <Tooltip title="Open Wallet Settings">
        <button
          onClick={() => web3ModalOpen({ view: 'Account' })}
          className="primary-btn"
        >
          <Avatar
            alt={address}
            src={makeBlockie(address)}
            sx={{
              mr: 1,
              height: 'auto',
              width: '1rem',
              border: 'solid 1px #06a69e',
            }}
          />
          0x...{address.substring(36)}
        </button>
      </Tooltip>
      {!!chainId && chainId != bsc.chainId && <>WRONG NETWORK. Use BSC (56)</>}
    </>
  ) : (
    <Tooltip title="Login Your Wallet">
      <button
        onClick={() => web3ModalOpen({ view: 'Connect' })}
        className="primary-btn"
      >
        <i className="fa-solid fa-wallet" aria-hidden="true"></i>
        Connect Wallet
      </button>
    </Tooltip>
  );
}
