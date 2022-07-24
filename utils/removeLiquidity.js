import { Contract, providers, utils, BigNumber } from "ethers";
import { EXCHANGE_CONTRACT_ABI, EXCHANGE_CONTRACT_ADDRESS } from "../constants/index";

const removeLiquidity = async (signer, removeLPTokensWei) => {
    const exchangeContract = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        signer
    );
    const tx = await exchangeContract.removeLiquidity(removeLPTokensWei);
    await tx.wait();
};

const getTokensAfterRemove = async (
    provder,
    removeLPTokensWei,
    _ethBalance,
    cryptoDevTokenReserve
) => {
    try {
        const exchangeContract = new Contract(
            EXCHANGE_CONTRACT_ADDRESS,
            EXCHANGE_CONTRACT_ABI,
            provder
        );
        const _totalSupply = await exchangeContract.totalSupply();
        const _removeEther = _ethBalance.mul(removeLPTokensWei).div(_totalSupply);
        const _removeCD = cryptoDevTokenReserve
            .mull(removeLPTokensWei)
            .div(_totalSupply);

        return {
            _removeEther,
            _removeCD
        };
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    removeLiquidity,
    getTokensAfterRemove
}