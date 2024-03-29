import "./App.css";
import Web3 from "web3/dist/web3.min.js";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";
import { loadContract } from "./utils/loadContract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const contract = await loadContract("Faucet", provider);
        setWeb3Api({
          provider,
          contract,
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
      // console.log(provider.selectedAddress);
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3, reload]);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };
    web3Api.contract && loadBalance();
  }, [web3Api, reload]);

  useEffect(() => {
    web3Api.provider &&
      web3Api.provider.on("accountsChanged", (accounts) => {
        setReload(!reload);
      });
  }, [web3Api.provider, reload]);

  const addFunds = async () => {
    const { contract, web3 } = web3Api;
    const add = await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });
    console.log(add);
    alert("thanh toán thành công");
    setReload(!reload);
  };

  const withdraw = async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmount = web3.utils.toWei("0.5", "ether");
    await contract.withdraw(withdrawAmount, {
      from: account,
    });
    setReload(!reload);
  };

  const connectWallet = () => {
    web3Api.provider
      .request({
        method: "eth_requestAccounts",
      })
      .then((result) => {
        result && setReload(!reload);
      });
  };

  const getAllFunders = async () => {
    const { contract } = web3Api;
    const funders = await contract.getAllFunders();
    console.log(funders);
  };

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <div className="balance-view is-size-2">
          Current Balance: <strong>{balance}</strong> ETH
        </div>
        <button className="button is-primary mr-2" onClick={addFunds}>
          Donate
        </button>
        <button className="button is-danger mr-2" onClick={withdraw}>
          Withdraw
        </button>
        {!account && (
          <button className="button is-link" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        <button className="button is-warning mr-2" onClick={getAllFunders}>
          Xem danh sách nhà tài trợ
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
