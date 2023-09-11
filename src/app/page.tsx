"use client";

import React, {useState, useEffect} from "react";
import {Web3Button} from "@web3modal/react";
import StakeInput from "./stake";
import WithdrawInput from "./withdraw";
import {useAccount, useBalance, useNetwork, useContractRead} from "wagmi";
import StakingContractABI from "../ABI/StakingContract.json";
import {ADDRESSES} from "@/app/addresses";
import {utils} from "web3";

export default function StakingComponent() {
  const [refresh, setRefresh] = useState(false);
  const {chain, chains} = useNetwork();
  const {address, isConnected} = useAccount();
  const balance = useBalance({
    address: address,
    token: ADDRESSES.MockToken,
  });

  const isWhitelisted = useContractRead({
    address: ADDRESSES.StakingContract,
    abi: StakingContractABI,
    functionName: "isWhitelisted",
    args: [address],
  });

  const stakedAmount = useContractRead({
    address: ADDRESSES.StakingContract,
    abi: StakingContractABI,
    functionName: "getStakedAmount",
    args: [address],
    watch: true
  });

  useEffect(() => {
    if (refresh) {
      refetchStakedAmount();
    }
  }, [refresh]);

  async function refetchStakedAmount() {
    const newData = await stakedAmount?.refetch();
    console.log("NEW DATA", newData);
    setRefresh(false);
  }


  const toWei = (amount: string) => {
    if (!amount) return null;

    return utils.fromWei(amount, "ether");
  };

  if (!isConnected) {
    return (
      <div>
        <Web3Button/>
      </div>
    );
  }

  if (isWhitelisted?.data !== true) {
    return (
      <div>
        <p>You are not whitelisted</p>
      </div>
    );
  }

  // @ts-ignore
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }}>
      <div style={{textAlign: 'center'}}>
        <h1>Staking and Withdrawal</h1>
        <p>Chain: {chain?.id}</p>
        <p>Your address: {address}</p>
        <p>
          Balance: {balance?.data?.formatted} {balance?.data?.symbol}
        </p>
        <p>Amount staked: {toWei(stakedAmount?.data?.toString() as string)}</p>

        <br/>
        <br/>

        {
          stakedAmount?.data?.toString() !== '0' ?
            <WithdrawInput setRefresh={setRefresh}/> :
            <StakeInput setRefresh={setRefresh}/>
        }
      </div>
    </div>
  )
    ;
}
