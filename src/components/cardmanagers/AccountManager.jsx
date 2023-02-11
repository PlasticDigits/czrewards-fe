import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { parseEther } from 'ethers/lib/utils.js';
import React, { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import CashbackAbi from '../../abi/Cashback.json';
import IERC20Abi from '../../abi/IERC20.json';
import {
  ADDRESS_CASHBACK,
  ADDRESS_CZUSD,
  ADDRESS_ZERO,
} from '../../constants/addresses';
import { LEVEL_WEIGHTS } from '../../constants/levelWeights';
import { bnToCompact } from '../../utils/bnToFixed';
import BronzeUpgradeCard from '../cards/BronzeUpgradeCard';
import ClaimRewardsCard from '../cards/ClaimRewardsCard';
import NewMemberCard from '../cards/NewMemberCard';
import ReferralCodeCard from '../cards/ReferralCodeCard';
import ReferralInfoCard from '../cards/ReferralInfoCard';
import UpgradeTierCard from '../cards/UpgradeTierCard';

const cashbackContract = {
  address: ADDRESS_CASHBACK,
  abi: CashbackAbi,
};

const CardWrapper = ({ children }) => (
  <Box css={{ padding: 10, maxWidth: 360, display: 'flex' }}>{children}</Box>
);

function AccountManager() {
  const { address, isConnecting, isDisconnected } = useAccount();

  const {
    data: dataCashbackSignerInfo,
    isError: isErrorCashbackSignerInfo,
    isLoading: isLoadingCashbackSignerInfo,
    isSuccess: isSuccessCashbackSignerInfo,
  } = useContractRead({
    address: ADDRESS_CASHBACK,
    abi: CashbackAbi,
    functionName: 'getSignerInfo',
    args: [address ?? ADDRESS_ZERO],
    watch: true,
  });

  const {
    data: dataCzusdBal,
    isError: isErrorCzusdBal,
    isLoading: isLoadingCzusdBal,
    isSuccess: isSuccessCzusdBal,
  } = useContractRead({
    address: ADDRESS_CZUSD,
    abi: IERC20Abi,
    functionName: 'balanceOf',
    args: [address ?? ADDRESS_ZERO],
    watch: true,
  });

  const [isMember, setIsMember] = useState(false);
  const [level, setLevel] = useState(-1);
  const [accountId, setAccountId] = useState(0);
  const [cashbackToProcess, setCashbackToProcess] = useState(parseEther('0'));
  const [pendingRewards, setPendingRewards] = useState(parseEther('0'));
  const [code, setCode] = useState('');
  const [referrerAccountId, setReferrerAccountId] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [levelNodeIds, setLevelNodeIds] = useState([]);

  useEffect(() => {
    if (!dataCashbackSignerInfo?.accoundId_ || !!isErrorCashbackSignerInfo) {
      return;
    }
    if (!dataCashbackSignerInfo?.accoundId_?.gt(0)) {
      setIsMember(false);
      setLevel(-1);
      setAccountId(0);
      setCashbackToProcess(parseEther('0'));
      setPendingRewards(parseEther('0'));
      setCode('');
      setReferrerAccountId(0);
      setTotalReferrals(0);
      setLevelNodeIds([]);
    } else {
      setIsMember(true);
      setLevel(dataCashbackSignerInfo?.level_);
      setAccountId(dataCashbackSignerInfo?.accoundId_);
      setCashbackToProcess(dataCashbackSignerInfo?.pendingCzusdToDistribute_);
      setPendingRewards(dataCashbackSignerInfo?.pendingRewards_);
      setCode(dataCashbackSignerInfo?.code_);
      setReferrerAccountId(dataCashbackSignerInfo?.referrerAccountId_);
      setTotalReferrals(dataCashbackSignerInfo?.totalReferrals_);
      setLevelNodeIds(dataCashbackSignerInfo?.levelNodeIds_);
    }
  }, [
    !!isErrorCashbackSignerInfo,
    dataCashbackSignerInfo?.accoundId_?.gt(0)?.toString(),
    dataCashbackSignerInfo?.pendingRewards_?.toString(),
    dataCashbackSignerInfo?.totalReferrals_?.toString(),
    dataCashbackSignerInfo?.pendingCzusdToDistribute_?.toString(),
    dataCashbackSignerInfo?.code_?.toString(),
  ]);

  return (
    <Box css={{ minHeight: '100vh' }}>
      <p>2. Manage Your Account:</p>
      {
        //Loading check...
        isMember == dataCashbackSignerInfo?.accoundId_?.gt(0) ? (
          <Stack
            direction="row"
            justifyContent="center"
            spacing={0}
            css={{ flexWrap: 'wrap' }}
          >
            {!!isMember && (
              <CardWrapper>
                <ClaimRewardsCard
                  level={dataCashbackSignerInfo?.level_}
                  pendingRewardsCompact={bnToCompact(pendingRewards, 18, 5)}
                  pendingCashbackCompact={bnToCompact(
                    cashbackToProcess
                      .mul(LEVEL_WEIGHTS[level])
                      .div(LEVEL_WEIGHTS[0]),
                    18,
                    5
                  )}
                />
              </CardWrapper>
            )}
            {!isMember && !!address && (
              <CardWrapper>
                <NewMemberCard />
              </CardWrapper>
            )}
            {!!isMember && dataCashbackSignerInfo?.level_ == 5 && (
              <CardWrapper>
                <BronzeUpgradeCard czusdBal={dataCzusdBal} />
              </CardWrapper>
            )}
            {!!isMember && dataCashbackSignerInfo?.level_ < 5 && (
              <CardWrapper>
                <ReferralCodeCard code={code} />
              </CardWrapper>
            )}

            {!!isMember &&
              dataCashbackSignerInfo?.level_ < 5 &&
              dataCashbackSignerInfo?.level_ > 1 && (
                <CardWrapper>
                  <UpgradeTierCard
                    level={dataCashbackSignerInfo?.level_}
                    czusdBal={dataCzusdBal}
                  />
                </CardWrapper>
              )}
            {!!isMember && dataCashbackSignerInfo?.level_ < 5 && (
              <CardWrapper>
                <ReferralInfoCard
                  totalReferrals={dataCashbackSignerInfo?.totalReferrals_?.toNumber()}
                  level={dataCashbackSignerInfo?.level_}
                />
              </CardWrapper>
            )}
          </Stack>
        ) : (
          'loading...'
        )
      }
    </Box>
  );
}

export default AccountManager;
