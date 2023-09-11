'use client';

import React, {useState, useEffect} from 'react';
import { Web3Button } from "@web3modal/react";
import StakeInput from './stake';
import WithdrawInput from './withdraw';
import Web3 from 'web3';
import { useAccount, useBalance, useNetwork, useContractRead } from 'wagmi';
import StakingContractABI from '../ABI/StakingContract.json';
import {ADDRESSES} from "@/app/addresses";

export default function StakingComponent() {
  const [web3, setWeb3] = useState(null);
  const { chain, chains } = useNetwork();
  const { address, isConnected } = useAccount();
  const balance = useBalance({
    address: address,
    token: ADDRESSES.MockToken
  });

  const isWhitelisted = useContractRead({
    address: ADDRESSES.StakingContract,
    abi: StakingContractABI,
    functionName: 'isWhitelisted',
    args: [address],
  });

  const stakedAmount = useContractRead({
    address: ADDRESSES.StakingContract,
    abi: StakingContractABI,
    functionName: 'getStakedAmount',
    args: [address],
  });

  useEffect(() => {

  }, []);

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


  if (!isConnected) {
    return <div>
      <Web3Button />
    </div>;
  }

  if (isWhitelisted?.data !== true) {
    return <div>
      <p>You are not whitelisted</p>
    </div>;
  }

  return (
    <div>
      <h1>Staking and Withdrawal</h1>
      <p>Chain: {chain?.id}</p>
      <p>Your address: {address}</p>
      <p>Balance: {balance?.data?.formatted} {balance?.data?.symbol}</p>

      <br />
      <br />

      <StakeInput stakedAmount={stakedAmount} />

      <br />
      <br />

      <WithdrawInput stakedAmount={stakedAmount} />
    </div>
  );
};
