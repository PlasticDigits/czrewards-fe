import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import { parseEther } from 'ethers/lib/utils.js';
import React from 'react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import CashbackAbi from '../../abi/Cashback.json';
import { ADDRESS_CASHBACK } from '../../constants/addresses';
import {
  LEVEL_COST_USD,
  LEVEL_LABELS,
  LEVEL_WEIGHTS,
} from '../../constants/levelWeights';
import { bnToCompact } from '../../utils/bnToFixed';
import TxStatus from '../elements/TxStatus';

const UpgradeTierCard = ({ level, czusdBal }) => {
  const { config: configCashbackUpgradeTier } = usePrepareContractWrite({
    address: ADDRESS_CASHBACK,
    abi: CashbackAbi,
    functionName: 'upgradeTier',
  });
  const {
    data: dataCashbackUpgradeTier,
    error: errorCashbackUpgradeTier,
    isLoading: isLoadingCashbackUpgradeTier,
    isSuccess: isSuccessCashbackUpgradeTier,
    isError: isErrorCashbackUpgradeTier,
    write: writeCashbackUpgradeTier,
  } = useContractWrite(configCashbackUpgradeTier);
  return (
    <>
      <Card variant="outlined">
        <CardHeader title="Increase Earning Rates" css={{ paddingBottom: 0 }} />
        <CardContent>
          <Typography variant="body2">
            Upgrade your account from {LEVEL_LABELS[level]} to{' '}
            {LEVEL_LABELS[level - 1]} to increase your rewards and cashback
            rates. Upgrading will also enable you to earn rewards from your
            referrals who are {LEVEL_LABELS[level]} or lower.
          </Typography>

          <Typography css={{ fontWeight: 'bold' }}>
            Upgrading Increases Rates By:
          </Typography>
          <Grid2 container columnSpacing={2} rowSpacing={0}>
            <Grid2 xs={6} css={{ textAlign: 'right' }}>
              <Typography variant="body2">CASHBACK</Typography>
            </Grid2>
            <Grid2 xs={6} css={{ textAlign: 'left' }}>
              <Typography variant="body2">
                {(LEVEL_WEIGHTS[level] / 10n).toString()}x {' -> '}
                {(LEVEL_WEIGHTS[level - 1] / 10n).toString()}x
              </Typography>
            </Grid2>
            {LEVEL_WEIGHTS.map(
              (weight, index) =>
                level <= index && (
                  <React.Fragment key={index}>
                    <Grid2 xs={6} css={{ textAlign: 'right' }}>
                      <Typography variant="body2">
                        {LEVEL_LABELS[index]}
                      </Typography>
                    </Grid2>
                    <Grid2 xs={6} css={{ textAlign: 'left' }}>
                      <Typography variant="body2">
                        {((LEVEL_WEIGHTS[level] - weight) / 10n).toString()}x{' '}
                        {' -> '}
                        {((LEVEL_WEIGHTS[level - 1] - weight) / 10n).toString()}
                        x
                      </Typography>
                    </Grid2>
                  </React.Fragment>
                )
            )}
          </Grid2>
          <Typography>
            <b>Fee:</b> {LEVEL_COST_USD[level - 1].toString()} CZUSD{' '}
            <small>
              (Your Bal:{' '}
              <span
                css={{
                  color: parseEther(LEVEL_COST_USD[level - 1].toString()).lte(
                    czusdBal
                  )
                    ? 'green'
                    : 'red',
                }}
              >
                {bnToCompact(czusdBal, 18, 4)}
              </span>
              )
            </small>
          </Typography>
          <Button
            variant="contained"
            onClick={() => writeCashbackUpgradeTier()}
            disabled={
              !parseEther(LEVEL_COST_USD[level - 1].toString()).lte(czusdBal)
            }
          >
            Upgrade Tier
          </Button>
          <TxStatus
            isLoading={isLoadingCashbackUpgradeTier}
            isSuccess={isSuccessCashbackUpgradeTier}
            isError={isErrorCashbackUpgradeTier}
            txHash={dataCashbackUpgradeTier?.hash}
            errMsg={errorCashbackUpgradeTier?.message}
          />
          <Typography>
            Need CZUSD to upgrade? <br />
            <a href="https://cz.cash/#/swap?outputCurrency=0xE68b79e51bf826534Ff37AA9CeE71a3842ee9c70">
              Buy CZUSD on CZ.Cash
            </a>
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default UpgradeTierCard;
