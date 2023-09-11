'use client';

import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
import { useAccount, usePrepareContractWrite, useContractWrite, useContractRead } from 'wagmi';
import StakingContractABI from '../ABI/StakingContract.json';
import ERC20ABI from '../ABI/ERC20.json';
import {ADDRESSES} from "@/app/addresses";

export default function StakeInput({
  stakedAmount
}) {
  const [web3, setWeb3] = useState(null);
  const [amountToStake, setAmountToStake] = useState(0);
  const { address, isConnected } = useAccount();

  const { config: stakeContractWriteConfig } = usePrepareContractWrite({
    address: ADDRESSES.StakingContract,
    abi: StakingContractABI,
    functionName: 'stake',
    args: [web3?.utils.toWei(amountToStake, 'ether')],
  });
  const { write: stake, isIdle: stakeIsIdle, isLoading: stakeIsLoading, isSuccess: stakeIsSuccess }= useContractWrite(stakeContractWriteConfig);

  // Allowance
  const { data: tokenAllowance } = useContractRead({
    address: ADDRESSES.MockToken,
    abi: ERC20ABI,
    functionName: 'allowance',
    args: [address, ADDRESSES.StakingContract],
  });
  const { config: approveTokenWriteConfig } = usePrepareContractWrite({
    address: ADDRESSES.MockToken,
    abi: ERC20ABI,
    functionName: 'approve',
    args: [ADDRESSES.StakingContract, '115792089237316195423570985008687907853269984665640564039457584007913129639935'],
  });
  const { write: approveToken }= useContractWrite(approveTokenWriteConfig);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3Instance);
      }
    };
    initWeb3();
  }, []);

  useEffect(() => {
    if (stakeIsSuccess) {
      console.log("SC", stakedAmount)
      stakedAmount?.refetch();
    }
  }, [stakeIsSuccess]);

  const handleStake = async () => {
    if (!web3) {
      return;
    }

    if (amountToStake === 0) {
      return;
    }

    if (!tokenAllowance) {
      approveToken?.();
    }

    stake?.();
  };

  return (
    <div>
      <h2>Staking</h2>
      <input
        type="number"
        placeholder="Amount to stake"
        value={amountToStake}
        onChange={(e) => setAmountToStake(e.target.value)}
      />
      <br />
      <button onClick={handleStake} style={{padding: '10px 20px', marginTop: '10px', background: '#2269e5'}}>Stake</button>
      {
        stakeIsLoading ? <p>Staking...</p> : (stakeIsIdle ? null : (stakeIsSuccess ? <p>Staked successful</p> : <p>Staking failed</p>))
      }
    </div>
  );
};
