import Stack from '@mui/material/Stack';
import { parseEther } from 'ethers/lib/utils.js';
import React, { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import CashbackAbi from '../../abi/Cashback.json';
import { ADDRESS_CASHBACK, ADDRESS_ZERO } from '../../constants/addresses';
import { LEVEL_WEIGHTS } from '../../constants/levelWeights';
import { bnToCompact } from '../../utils/bnToFixed';
import ClaimRewardsCard from '../cards/ClaimRewardsCard';

const cashbackContract = {
  address: ADDRESS_CASHBACK,
  abi: CashbackAbi,
};

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
    if (!dataCashbackSignerInfo?.accoundId_ && !isErrorCashbackSignerInfo) {
      return;
    }
    console.log(dataCashbackSignerInfo?.accoundId_);
    if (
      !!isErrorCashbackSignerInfo ||
      !dataCashbackSignerInfo?.accoundId_?.gt(0)
    ) {
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
    <>
      <p>2. Manage Your Account:</p>
      <Stack direction="row" justifyContent="center" spacing={2}>
        {!!isMember && (
          <ClaimRewardsCard
            pendingRewardsCompact={bnToCompact(pendingRewards, 18, 5)}
            pendingCashbackCompact={bnToCompact(
              cashbackToProcess.mul(LEVEL_WEIGHTS[level]).div(LEVEL_WEIGHTS[0]),
              18,
              5
            )}
          />
        )}
      </Stack>
    </>
  );
}

export default AccountManager;
