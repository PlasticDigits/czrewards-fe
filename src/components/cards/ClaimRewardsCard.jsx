import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import CashbackAbi from '../../abi/Cashback.json';
import { ADDRESS_CASHBACK } from '../../constants/addresses';
import {
  LEVEL_COST_USD,
  LEVEL_LABELS,
  LEVEL_WEIGHTS,
} from '../../constants/levelWeights';
import TxStatus from '../elements/TxStatus';
import { BigNumber } from 'ethers';

const ClaimRewardsCard = ({
  level,
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
    <Card variant="outlined">
      <CardHeader title="Claim Earnings" css={{ paddingBottom: 0 }} />
      <CardContent>
        <Typography variant="body1">
          Cashback To Claim: <b>{pendingCashbackCompact} CZUSD</b>
        </Typography>
        <Typography variant="body2">
          Cashback is generated when you use CZUSD in CZODIAC dapps that charge
          fees. You are <b>{LEVEL_LABELS[level]}</b> tier and earn at a{' '}
          <b>{LEVEL_WEIGHTS[level] / 10n}x</b> rate.
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
          Earn rewards when a lower tier member in your referral chain claims
          cashback or upgrades their tier. Your direct referrals pay out at
          these rates when they upgrade their tier:
        </Typography>
        <Grid2 container columnSpacing={2} rowSpacing={0}>
          {LEVEL_WEIGHTS.map(
            (weight, index) =>
              level < index && (
                <React.Fragment key={index}>
                  <Grid2 xs={6} css={{ textAlign: 'right' }}>
                    <Typography variant="body2" css={{ fontWeight: 'bold' }}>
                      {LEVEL_LABELS[index]}
                    </Typography>
                  </Grid2>
                  <Grid2 xs={6} css={{ textAlign: 'left' }}>
                    <Typography variant="body2" css={{ fontWeight: 'bold' }}>
                      $
                      {Number(
                        BigInt.asIntN(
                          32,
                          LEVEL_COST_USD[index - 1] *
                            ((LEVEL_WEIGHTS[level] - weight) /
                              (100n - LEVEL_WEIGHTS[index]))
                        )
                      ).toFixed(2)}{' '}
                      ({((LEVEL_WEIGHTS[level] - weight) / 10n).toString()}x)
                    </Typography>
                  </Grid2>
                </React.Fragment>
              )
          )}
        </Grid2>
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
