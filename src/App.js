import "./App.css";
import Web3 from "web3/dist/web3.min.js";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  });
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        setWeb3Api({
          provider,
          web3: new Web3(provider),
        });
      } else {
        console.error("please, install Metamask wallet");
      }
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3Api.web3 && getAccount();
  }, [web3Api]);

  const connectWallet = () => {
    web3Api.provider &&
      web3Api.provider.request({
        method: "eth_requestAccounts",
      });
  };

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <div className="balance-view is-size-2">
          Current Balance: <strong>10</strong> ETH
        </div>
        <button className="button is-primary mr-2">Donate</button>
        <button className="button is-danger mr-2">Withdraw</button>
        <button className="button is-link" onClick={connectWallet}>
          Connect Wallet
        </button>
        <p>
          <strong>Accounts Address: </strong>
          {account ? account : "Accounts need to login"}
        </p>
      </div>
    </div>
  );
}

export default App;
