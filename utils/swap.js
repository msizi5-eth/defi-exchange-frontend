import { Contract, providers, Signer } from "ethers";
import {
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    TOKEN_CONTRACT_ABI,
    TOKEN_CONTRACT_ADDRESS
} from "../constants/index";

const getAmountOfTokensReceivedFromSwap = async (
    _swapAmountWei,
    provider,
    ethSelected,
    ethBalance,
    reservedCD
) => {
    const exchangeContract = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        provider
    );
    let amountOfTokens;
    if (ethSelected) {
        amountOfTokens = await exchangeContract.getAmountOfTokens(
            _swapAmountWei,
            ethBalance,
            reservedCD
        );
    } else {
        amountOfTokens = await exchangeContract.getAmountOfTokens(
            _swapAmountWei,
            reservedCD,
            ethBalance
        );
    }
    return amountOfTokens;
}

const swapTokens = async (
    signer,
    swapAmountWei,
    tokensToBeReceivedAfterSwap,
    ethSelected
) => {
    const exchangeContract = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        signer
    );

    const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
    );

    let tx;
    if (ethSelected) {
        tx = await exchangeContract.ethToCryptoDevToken(
            tokensToBeReceivedAfterSwap,
            {
                value: swapAmountWei
            }
        );
    } else {
        tx = await exchangeContract.cryptoDevTokenToEth(
            swapAmountWei,
            tokensToBeReceivedAfterSwap
        );
    }
    await tx.wait();
}

module.exports = {
    getAmountOfTokensReceivedFromSwap,
    swapTokens
}