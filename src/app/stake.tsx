"use client";

import React, {useState, useEffect} from "react";
import {utils} from "web3";
import {useAccount, usePrepareContractWrite, useContractWrite, useContractRead} from "wagmi";
import StakingContractABI from "../ABI/StakingContract.json";
import ERC20ABI from "../ABI/ERC20.json";
import {ADDRESSES} from "@/app/addresses";

export default function StakeInput({setRefresh}: { setRefresh: Function }) {
  const [amountToStake, setAmountToStake] = useState(0);
  const {address, isConnected} = useAccount();

  const {config: stakeContractWriteConfig} = usePrepareContractWrite({
    address: ADDRESSES.StakingContract,
    abi: StakingContractABI,
    functionName: "stake",
    args: [utils.toWei(amountToStake, "ether")],
  });
  const {
    write: stake,
    isIdle: stakeIsIdle,
    isLoading: stakeIsLoading,
    isSuccess: stakeIsSuccess,
  } = useContractWrite(stakeContractWriteConfig);

  // Allowance
  const {data: tokenAllowance} = useContractRead({
    address: ADDRESSES.MockToken,
    abi: ERC20ABI,
    functionName: "allowance",
    args: [address, ADDRESSES.StakingContract],
  });
  const {config: approveTokenWriteConfig} = usePrepareContractWrite({
    address: ADDRESSES.MockToken,
    abi: ERC20ABI,
    functionName: "approve",
    args: [
      ADDRESSES.StakingContract,
      "115792089237316195423570985008687907853269984665640564039457584007913129639935",
    ],
  });
  const {write: approveToken} = useContractWrite(approveTokenWriteConfig);

  useEffect(() => {
    if (stakeIsSuccess) {
      setRefresh(true);
    }
  }, [stakeIsSuccess]);

  const handleStake = async () => {
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
        onChange={(e) => setAmountToStake(Number(e.target.value))}
        style={{height: "30px", width: "200px", padding: "5px 10px", fontSize: "16px"}}
      />
      <br/>
      <button onClick={handleStake} style={{padding: "10px 20px", marginTop: "10px", background: "#2269e5"}}>
        Stake
      </button>
      {stakeIsLoading ? (
        <p>Staking...</p>
      ) : stakeIsIdle ? null : stakeIsSuccess ? (
        <p>Staked successful</p>
      ) : (
        <p>Staking failed</p>
      )}
    </div>
  );
}
