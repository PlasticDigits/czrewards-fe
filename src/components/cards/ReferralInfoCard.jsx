import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { useState } from 'react';
import {
  useAccount,
  useContractInfiniteReads,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import CashbackAbi from '../../abi/Cashback.json';
import CashbackReferralLevelsAbi from '../../abi/CashbackReferralLevels.json';
import {
  ADDRESS_CASHBACK,
  ADDRESS_CASHBACK_REFERRAL_LEVELS,
} from '../../constants/addresses';
import { LEVEL_LABELS } from '../../constants/levelWeights';
import useHash from '../../hooks/useHash';
import TxStatus from '../elements/TxStatus';

const ReferralInfoCard = ({ totalReferrals, level }) => {
  const [hash, setHash] = useHash();
  const [referredAccountIds, setReferredAccountIds] = useState([]);
  const { address, isConnecting, isDisconnected } = useAccount();

  const {
    data: dataCashbackReferredAccountsLevel,
    isError: isErrorCashbackReferredAccountsLevel,
    isLoading: isLoadingCashbackReferredAccountsLevel,
    isSuccess: isSuccessCashbackReferredAccountsLevel,
  } = useContractInfiniteReads({
    cacheKey: 'cashbackReferralLevels-' + address,
    contracts(param = 0) {
      const start = param * 50;
      const count = start + 50 > totalReferrals ? totalReferrals - start : 50;
      return [
        {
          address: ADDRESS_CASHBACK_REFERRAL_LEVELS,
          abi: CashbackReferralLevelsAbi,
          functionName: 'getSignerReferredAccountLevels',
          args: [address, start, count],
        },
      ];
    },
    getNextPageParam: (_, pages) =>
      (pages.length - 1) * 50 > totalReferrals ? undefined : pages.length + 1,
  });
  const { config: configCashbackRecaptureAccounts } = usePrepareContractWrite({
    address: ADDRESS_CASHBACK,
    abi: CashbackAbi,
    functionName: 'recaptureAccounts',
    args: [
      dataCashbackReferredAccountsLevel?.pages
        ?.flat()
        .filter((curr, i, arr) => curr?.[2]?.[0])
        .map((val, index) => index),
    ],
  });
  const {
    data: dataCashbackRecaptureAccounts,
    error: errorCashbackRecaptureAccounts,
    isLoading: isLoadingCashbackRecaptureAccounts,
    isSuccess: isSuccessCashbackRecaptureAccounts,
    isError: isErrorCashbackRecaptureAccounts,
    write: writeCashbackRecaptureAccounts,
  } = useContractWrite(configCashbackRecaptureAccounts);

  return (
    <>
      <Card variant="outlined">
        <CardHeader title="Referral Stats" css={{ paddingBottom: 0 }} />
        <CardContent>
          <Typography variant="body2">
            You earn rewards from all referrals lower than your current tier.
            When you upgrade your tier, you can recapture high-tier referrals
            that you could not earn from before.
          </Typography>
          <Typography variant="body1">
            Total Referrals: {totalReferrals.toString()}
          </Typography>

          <Grid2 container columnSpacing={2} rowSpacing={0}>
            {LEVEL_LABELS.map(
              (label, levelIndex) =>
                levelIndex > 0 && (
                  <React.Fragment key={levelIndex}>
                    {levelIndex == level + 1 && (
                      <React.Fragment>
                        <Grid2 xs={12}>----</Grid2>
                      </React.Fragment>
                    )}
                    <Grid2 xs={6} css={{ textAlign: 'right' }}>
                      <Typography variant="body2">
                        {LEVEL_LABELS[levelIndex]}
                      </Typography>
                    </Grid2>
                    <Grid2 xs={6} css={{ textAlign: 'left' }}>
                      <Typography variant="body2">
                        {
                          dataCashbackReferredAccountsLevel?.pages
                            ?.flat()?.[0]?.[1]
                            ?.filter((curr, i, arr) => curr == levelIndex)
                            .length
                        }
                      </Typography>
                    </Grid2>
                  </React.Fragment>
                )
            )}
          </Grid2>
          <Button
            variant="contained"
            onClick={() => writeCashbackRecaptureAccounts()}
            disabled={
              dataCashbackReferredAccountsLevel?.pages
                ?.flat()?.[0]?.[2]
                ?.filter((curr, i, arr) => !!curr).length.length == 0 ||
              level == 0
            }
          >
            Recapture{' '}
            {
              dataCashbackReferredAccountsLevel?.pages
                ?.flat()?.[0]?.[2]
                ?.filter((curr, i, arr) => !!curr).length
            }{' '}
            Referrals
          </Button>
          <TxStatus
            isLoading={isLoadingCashbackRecaptureAccounts}
            isSuccess={isSuccessCashbackRecaptureAccounts}
            isError={isErrorCashbackRecaptureAccounts}
            txHash={dataCashbackRecaptureAccounts?.hash}
            errMsg={errorCashbackRecaptureAccounts?.message}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ReferralInfoCard;
