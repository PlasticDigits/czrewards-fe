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
import { BigNumber } from 'ethers';

const GETSIGNERINFO_ENUM = {
  LEVEL: 0,
  ACCOUNT_ID: 1,
  LEVEL_NODE_IDS: 2,
  REFERRER_ACCOUNT_ID: 3,
  CODE: 4,
  TOTAL_REFERRALS: 5,
  PENDING_CZUSD_TO_DISTRIBUTE: 6,
  PENDING_REWARDS: 7,
};

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
    if (
      !dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.ACCOUNT_ID] ||
      !!isErrorCashbackSignerInfo
    ) {
      return;
    }
    if ((!dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.ACCOUNT_ID] ?? 0) > 0) {
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
      setLevel(dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.LEVEL]);
      setAccountId(dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.ACCOUNT_ID]);
      setCashbackToProcess(
        dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.PENDING_CZUSD_TO_DISTRIBUTE]
      );
      setPendingRewards(
        dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.PENDING_REWARDS]
      );
      setCode(dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.CODE]);
      setReferrerAccountId(
        dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.REFERRER_ACCOUNT_ID]
      );
      setTotalReferrals(
        dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.TOTAL_REFERRALS]
      );
      setLevelNodeIds(
        dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.LEVEL_NODE_IDS]
      );
    }
  }, [
    !!isErrorCashbackSignerInfo,
    dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.ACCOUNT_ID]?.toString(),
    dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.PENDING_REWARDS]?.toString(),
    dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.TOTAL_REFERRALS]?.toString(),
    dataCashbackSignerInfo?.[
      GETSIGNERINFO_ENUM.PENDING_CZUSD_TO_DISTRIBUTE
    ]?.toString(),
    dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.CODE]?.toString(),
  ]);
  return (
    <Box css={{ minHeight: '100vh' }}>
      <p>2. Manage Your Account:</p>
      {
        //Loading check...
        isMember ==
        (dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.ACCOUNT_ID] ?? 0) > 0 ? (
          <Stack
            direction="row"
            justifyContent="center"
            spacing={0}
            css={{ flexWrap: 'wrap' }}
          >
            {!!isMember && (
              <CardWrapper>
                <ClaimRewardsCard
                  level={dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.LEVEL]}
                  pendingRewardsCompact={bnToCompact(pendingRewards, 18, 5)}
                  pendingCashbackCompact={bnToCompact(
                    (cashbackToProcess * LEVEL_WEIGHTS[level]) /
                      LEVEL_WEIGHTS[0],
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
            {!!isMember &&
              dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.LEVEL] == 5 && (
                <CardWrapper>
                  <BronzeUpgradeCard czusdBal={BigNumber.from(dataCzusdBal)} />
                </CardWrapper>
              )}
            {!!isMember &&
              dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.LEVEL] < 5 && (
                <CardWrapper>
                  <ReferralCodeCard code={code} />
                </CardWrapper>
              )}

            {!!isMember &&
              dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.LEVEL] < 5 &&
              dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.LEVEL] > 1 && (
                <CardWrapper>
                  <UpgradeTierCard
                    level={Number(
                      dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.LEVEL]
                    )}
                    czusdBal={BigNumber.from(dataCzusdBal)}
                  />
                </CardWrapper>
              )}
            {!!isMember &&
              dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.LEVEL] < 5 && (
                <CardWrapper>
                  <ReferralInfoCard
                    totalReferrals={BigNumber.from(
                      dataCashbackSignerInfo?.[
                        GETSIGNERINFO_ENUM.TOTAL_REFERRALS
                      ]
                    )}
                    level={Number(
                      dataCashbackSignerInfo?.[GETSIGNERINFO_ENUM.LEVEL]
                    )}
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
