"use client";

import React, { useState, useEffect } from "react";
import { Web3Button } from "@web3modal/react";
import StakeInput from "./stake";
import WithdrawInput from "./withdraw";
import { useAccount, useBalance, useNetwork, useContractRead } from "wagmi";
import StakingContractABI from "../ABI/StakingContract.json";
import { ADDRESSES } from "@/app/addresses";

export default function StakingComponent() {
    const [refresh, setRefresh] = useState(false);
    const { chain, chains } = useNetwork();
    const { address, isConnected } = useAccount();
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
    });

    useEffect(() => {}, []);

    if (!isConnected) {
        return (
            <div>
                <Web3Button />
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

    return (
        <div>
            <h1>Staking and Withdrawal</h1>
            <p>Chain: {chain?.id}</p>
            <p>Your address: {address}</p>
            <p>
                Balance: {balance?.data?.formatted} {balance?.data?.symbol}
            </p>

            <br />
            <br />

            <StakeInput setRefresh={setRefresh} />

            <br />
            <br />

            <WithdrawInput setRefresh={setRefresh} stakedAmount={stakedAmount?.data as BigInt} />
        </div>
    );
}
