import Web3 from 'web3';
import ABI from '../blockchain/createABI.json';
import { useState } from 'react';

function ConnectButton() {

    const [wallet, setWallet] = useState("Connect");

    const detectCurrentProvider = () => {
        let provider;
        if (window.ethereum) {
          provider = window.ethereum;
        } else if (window.web3) {
          provider = window.web3.currentProvider;
        } else {
          alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
        return provider;
      };

    const loadBlockchain = async () => {
        const web3 = new Web3(Web3.givenProvider || "https://data-seed-prebsc-1-s1.binance.org:8545/");
        const currentProvider = detectCurrentProvider();
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const userAccount = await web3.eth.getAccounts();
        const account = userAccount[0];
        setWallet(account.substring(0, 5) + "...." + account.substring(38, 44));
        const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT);
        let ethBalance = await web3.eth.getBalance(account); 
        ethBalance = web3.utils.fromWei(ethBalance, 'ether');
        if (userAccount.length === 0) {
          alert("login to metamask!");
        }
    }

  return (
      <button onClick={loadBlockchain}>{wallet}</button>
  )
  
}

export default ConnectButton;