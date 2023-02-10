import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import CashbackAbi from '../../abi/Cashback.json';
import { ADDRESS_CASHBACK } from '../../constants/addresses';
import TxStatus from '../elements/TxStatus';

const BronzeUpgradeCard = () => {
  const [newCode, setNewCode] = useState('');

  const {
    data: dataCashbackIsCodeRegistered,
    isError: isErrorCashbackIsCodeRegistered,
    isLoading: isLoadingCashbackIsCodeRegistered,
    isSuccess: isSuccessCashbackIsCodeRegistered,
  } = useContractRead({
    address: ADDRESS_CASHBACK,
    abi: CashbackAbi,
    functionName: 'isCodeRegistered',
    args: [newCode ?? ''],
    watch: true,
  });

  const { config: configCashbackUpgdadeTierAndSetCode } =
    usePrepareContractWrite({
      address: ADDRESS_CASHBACK,
      abi: CashbackAbi,
      functionName: 'upgradeTierAndSetCode',
      args: [newCode],
    });
  const {
    data: dataCashbackUpgdadeTierAndSetCode,
    error: errorCashbackUpgdadeTierAndSetCode,
    isLoading: isLoadingCashbackUpgdadeTierAndSetCode,
    isSuccess: isSuccessCashbackUpgdadeTierAndSetCode,
    isError: isErrorCashbackUpgdadeTierAndSetCode,
    write: writeCashbackUpgdadeTierAndSetCode,
  } = useContractWrite(configCashbackUpgdadeTierAndSetCode);

  return (
    <>
      <Card variant="outlined">
        <CardHeader
          title="Upgrade & Earn Referrals"
          css={{ paddingBottom: 0 }}
        />
        <CardContent>
          <Typography variant="body2">
            Upgrade your account to bronze tier to begin earning referral
            rewards. You will get a unique referral code link you can share to
            earn up to <b>2x</b> your referral's cashback claims. Additionally,
            you will increase your cashback by <b>3x</b>.
          </Typography>
          <TextField
            css={{ marginTop: 8 }}
            variant="outlined"
            label="Your_Code-1"
            value={newCode}
            onChange={(event) => {
              let inputText = event.target.value;
              const re = /[a-zA-Z0-9_-]*/g;
              const res = re.exec(inputText);
              if (
                !!res &&
                res.length > 0 &&
                res[0].length == inputText.length
              ) {
                setNewCode(res[0]);
                return;
              }
              if (inputText.length == 0) setNewCode('');
            }}
            helperText={
              !!newCode ? 'Your link: https://rewards.cz.cash/#' + newCode : ' '
            }
          />
          {!dataCashbackIsCodeRegistered && newCode?.length != 0 ? (
            <Typography variant="body1" color="green">
              Your code is valid and not yet registered.
            </Typography>
          ) : newCode?.length == 0 ? (
            <Typography variant="body1" color="blue">
              Valid characters: a-z, A-Z, 0-9, "-", "_"
            </Typography>
          ) : (
            <Typography variant="body1" color="red">
              Code is invalid or already registered.
            </Typography>
          )}
          <Button
            variant="contained"
            disabled={!!dataCashbackIsCodeRegistered || newCode?.length == 0}
            onClick={() => writeCashbackUpgdadeTierAndSetCode()}
          >
            Upgrade & Earn Referrals
          </Button>
          <TxStatus
            isLoading={isLoadingCashbackUpgdadeTierAndSetCode}
            isSuccess={isSuccessCashbackUpgdadeTierAndSetCode}
            isError={isErrorCashbackUpgdadeTierAndSetCode}
            txHash={dataCashbackUpgdadeTierAndSetCode?.hash}
            errMsg={errorCashbackUpgdadeTierAndSetCode?.message}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default BronzeUpgradeCard;
