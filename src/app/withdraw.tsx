"use client";

import React, { useState, useEffect } from "react";
import { utils } from "web3";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import StakingContractABI from "../ABI/StakingContract.json";
import { ADDRESSES } from "@/app/addresses";

export default function WithdrawInput({ setRefresh }: { setRefresh: Function }) {
    const { config: withdrawContractWriteConfig } = usePrepareContractWrite({
        address: ADDRESSES.StakingContract,
        abi: StakingContractABI,
        functionName: "withdraw",
        args: [],
    });
    const {
        write: withdraw,
        isIdle: withdrawIsIdle,
        isLoading: withdrawIsLoading,
        isSuccess: withdrawIsSuccess,
    } = useContractWrite(withdrawContractWriteConfig);

    useEffect(() => {
        if (withdrawIsSuccess) {
            setRefresh(true);
        }
    }, [withdrawIsSuccess]);

    const handleWithdraw = async () => {
        withdraw?.();
    };

    return (
        <div>
            <h2>Withdraw</h2>
            <button onClick={handleWithdraw} style={{ padding: "10px 20px", marginTop: "10px", background: "#ef5e91" }}>
                Withdraw
            </button>
            {withdrawIsLoading ? (
                <p>Withdrawing...</p>
            ) : withdrawIsIdle ? null : withdrawIsSuccess ? (
                <p>Withdraw successful</p>
            ) : (
                <p>Withdraw failed</p>
            )}
        </div>
    );
}
