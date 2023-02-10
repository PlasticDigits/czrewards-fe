import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import CashbackAbi from '../../abi/Cashback.json';
import { ADDRESS_CASHBACK } from '../../constants/addresses';
import TxStatus from '../elements/TxStatus';

const ReferralCodeCard = ({ code }) => {
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

  const { config: configCashbackSetCodeTo } = usePrepareContractWrite({
    address: ADDRESS_CASHBACK,
    abi: CashbackAbi,
    functionName: 'setCodeTo',
    args: [newCode],
  });
  const {
    data: dataCashbackSetCodeTo,
    error: errorCashbackSetCodeTo,
    isLoading: isLoadingCashbackSetCodeTo,
    isSuccess: isSuccessCashbackSetCodeTo,
    isError: isErrorCashbackSetCodeTo,
    write: writeCashbackUpgdadeTierAndSetCode,
  } = useContractWrite(configCashbackSetCodeTo);

  useEffect(() => {
    setNewCode(code);
  }, [code]);

  return (
    <>
      <Card variant="outlined">
        <CardHeader title="Your Referral Link" css={{ paddingBottom: 0 }} />
        <CardContent>
          <Typography variant="body1" color="">
            Share this link to gain new referrals:
            <br />
            <a target="_blank" href={'https://rewards.cz.cash/#' + code}>
              {'https://rewards.cz.cash/#' + code}
            </a>
          </Typography>
          <Typography variant="body2">
            Share your referral link to earn rewards. You earn from lower tier
            accounts you refer, or they refer, whenever those accounts claim
            cashback or upgrade to a higher tier.
          </Typography>
          <br />
          <Typography variant="h6">Change your code</Typography>
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
              !!newCode && newCode != code
                ? 'New link: https://rewards.cz.cash/#' + newCode
                : ' '
            }
          />
          {code == newCode ? (
            <Typography variant="body1">
              '{code}' is your current code.
            </Typography>
          ) : !dataCashbackIsCodeRegistered && newCode?.length != 0 ? (
            <Typography variant="body1" color="green">
              Your new code is valid and not yet registered.
            </Typography>
          ) : newCode?.length == 0 ? (
            <Typography variant="body1" color="blue">
              Valid characters: a-z, A-Z, 0-9, '-'', '_'
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
            Change Code To '{newCode}''
          </Button>
          <TxStatus
            isLoading={isLoadingCashbackSetCodeTo}
            isSuccess={isSuccessCashbackSetCodeTo}
            isError={isErrorCashbackSetCodeTo}
            txHash={dataCashbackSetCodeTo?.hash}
            errMsg={errorCashbackSetCodeTo?.message}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ReferralCodeCard;
