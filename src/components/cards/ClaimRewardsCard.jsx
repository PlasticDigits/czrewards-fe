import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import CashbackAbi from '../../abi/Cashback.json';
import { ADDRESS_CASHBACK } from '../../constants/addresses';
import TxStatus from '../elements/TxStatus';

const ClaimRewardsCard = ({
  pendingRewardsCompact,
  pendingCashbackCompact,
}) => {
  const { address } = useAccount();
  const { config: configCashbackClaimCashback } = usePrepareContractWrite({
    address: ADDRESS_CASHBACK,
    abi: CashbackAbi,
    functionName: 'claimCashback',
    args: [address],
  });
  const {
    data: dataCashbackClaimCashback,
    error: errorCashbackClaimCashback,
    isLoading: isLoadingCashbackClaimCashback,
    isSuccess: isSuccessCashbackClaimCashback,
    isError: isErrorCashbackClaimCashback,
    write: writeCashbackClaimCashback,
  } = useContractWrite(configCashbackClaimCashback);
  const { config: configCashbackClaimRewards } = usePrepareContractWrite({
    address: ADDRESS_CASHBACK,
    abi: CashbackAbi,
    functionName: 'claimRewards',
    args: [address],
  });
  const {
    data: dataCashbackClaimRewards,
    error: errorCashbackClaimRewards,
    isLoading: isLoadingCashbackClaimRewards,
    isSuccess: isSuccessCashbackClaimRewards,
    isError: isErrorCashbackClaimRewards,
    write: writeCashbackClaimRewards,
  } = useContractWrite(configCashbackClaimRewards);

  return (
    <Card variant="outlined" css={{ maxWidth: 360 }}>
      <CardHeader title="Claim Earnings" css={{ paddingBottom: 0 }} />
      <CardContent>
        <Typography variant="body1">
          Cashback To Claim: <b>{pendingCashbackCompact} CZUSD</b>
        </Typography>
        <Typography variant="body2">
          Cashback is generated when you use CZUSD in CZODIAC dapps that charge
          fees. Increasing your tier increases your cashback rate.
        </Typography>
        <Button
          variant="contained"
          onClick={() => writeCashbackClaimCashback()}
        >
          Claim Cashback
        </Button>
        <TxStatus
          isLoading={isLoadingCashbackClaimCashback}
          isSuccess={isSuccessCashbackClaimCashback}
          isError={isErrorCashbackClaimCashback}
          txHash={dataCashbackClaimCashback?.hash}
          errMsg={errorCashbackClaimCashback?.message}
        />
        <hr />
        <Typography variant="body1">
          Rewards To Claim: <b>{pendingRewardsCompact} CZUSD</b>
        </Typography>
        <Typography variant="body2">
          Rewards are generated when you or someone in your referral chain with
          a lower tier than yours processes their cashback. Increases with your
          tier.
        </Typography>
        <Button variant="contained" onClick={() => writeCashbackClaimRewards()}>
          Claim Rewards
        </Button>
        <TxStatus
          isLoading={isLoadingCashbackClaimRewards}
          isSuccess={isSuccessCashbackClaimRewards}
          isError={isErrorCashbackClaimRewards}
          txHash={dataCashbackClaimRewards?.hash}
          errMsg={errorCashbackClaimRewards?.message}
        />
      </CardContent>
    </Card>
  );
};

export default ClaimRewardsCard;
