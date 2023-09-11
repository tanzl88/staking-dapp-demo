'use client';

import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
import { useAccount, usePrepareContractWrite, useContractWrite, useContractRead } from 'wagmi';
import StakingContractABI from '../ABI/StakingContract.json';
import {ADDRESSES} from "@/app/addresses";

export default function WithdrawInput({
  stakedAmount
}) {
  const [web3, setWeb3] = useState(null);
  const { address, isConnected } = useAccount();

  const { config: withdrawContractWriteConfig } = usePrepareContractWrite({
    address: ADDRESSES.StakingContract,
    abi: StakingContractABI,
    functionName: 'withdraw',
    args: [],
  });
  const { write: withdraw, isIdle: withdrawIsIdle, isLoading: withdrawIsLoading, isSuccess: withdrawIsSuccess }= useContractWrite(withdrawContractWriteConfig);

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
    if (withdrawIsSuccess) {
      stakedAmount?.refetch();
    }
  }, [withdrawIsSuccess]);

  const handleWithdraw = async () => {
    if (!web3) {
      return;
    }

    withdraw?.();
  };

  const toWei = (amount: string) => {
    if (!amount) return null;

    return web3?.utils?.fromWei(amount, 'ether');
  }

  return (
    <div>
      <h2>Withdraw</h2>
      <p>Amount staked: {toWei(stakedAmount?.data?.toString(10))}</p>
      <button onClick={handleWithdraw} style={{padding: '10px 20px', marginTop: '10px', background: '#ef5e91'}}>Withdraw</button>
      {
        withdrawIsLoading ? <p>Withdrawing...</p> : (withdrawIsIdle ? null : (withdrawIsSuccess ? <p>Withdraw successful</p> : <p>Withdraw failed</p>))
      }
    </div>
  );
};
