import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import React from 'react';
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import CashbackAbi from '../../abi/Cashback.json';
import { ADDRESS_CASHBACK } from '../../constants/addresses';
import useHash from '../../hooks/useHash';
import TxStatus from '../elements/TxStatus';

const NewMemberCard = () => {
  const [hash, setHash] = useHash();

  const {
    data: dataCashbackIsCodeRegistered,
    isError: isErrorCashbackIsCodeRegistered,
    isLoading: isLoadingCashbackIsCodeRegistered,
    isSuccess: isSuccessCashbackIsCodeRegistered,
  } = useContractRead({
    address: ADDRESS_CASHBACK,
    abi: CashbackAbi,
    functionName: 'isCodeRegistered',
    args: [hash ?? ''],
    watch: true,
  });

  const { config: configCashbackBecomeMember } = usePrepareContractWrite({
    address: ADDRESS_CASHBACK,
    abi: CashbackAbi,
    functionName: 'becomeMember',
    args: [hash ?? ''],
  });
  const {
    data: dataCashbackBecomeMember,
    error: errorCashbackBecomeMember,
    isLoading: isLoadingCashbackBecomeMember,
    isSuccess: isSuccessCashbackBecomeMember,
    isError: isErrorCashbackBecomeMember,
    write: writeCashbackBecomeMember,
  } = useContractWrite(configCashbackBecomeMember);

  return (
    <>
      <Card variant="outlined">
        <CardHeader title="Join Rewards Program" css={{ paddingBottom: 0 }} />
        <CardContent>
          <Typography variant="body2">
            Register at no cost to you and begin earning Cashback on CZODIAC
            dapps. Our Rewards program is invite only, so you will need to ask
            your friends for a link.
          </Typography>
          <Button
            variant="contained"
            disabled={!dataCashbackIsCodeRegistered}
            onClick={() => writeCashbackBecomeMember()}
          >
            Join & Earn Cashback
          </Button>
          <TxStatus
            isLoading={isLoadingCashbackBecomeMember}
            isSuccess={isSuccessCashbackBecomeMember}
            isError={isErrorCashbackBecomeMember}
            txHash={dataCashbackBecomeMember?.hash}
            errMsg={errorCashbackBecomeMember?.message}
          />
          {!dataCashbackIsCodeRegistered ? (
            <Typography variant="body1" color="red">
              Your invite link is invalid. Ask your friends for an invite link,
              or ask the community on telegram at{' '}
              <a href="https://t.me/CZodiacofficial">t.me/CZodiacOfficial</a>
            </Typography>
          ) : (
            <Typography variant="body1" color="green">
              Your invite link is valid. Check again your URL matches the link
              your friend gave you: {'https://rewards.cz.cash/#' + hash}
            </Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default NewMemberCard;
