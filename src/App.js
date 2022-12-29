import './App.css';
import { ethers } from "ethers";
import { useEffect, useState } from "react";

function App() {
  const [greet, setGreet] = useState('');
  const [balance, setBalance] = useState('');
  const [depositValue, setDepositValue] = useState('');
  const [greetingValue, setGreetingValue] = useState('');
  const contractAddress = "0x686EF52d3e40e73DC5ED59C1009092eBEC6F736f";

  // A Web3Provider wraps a standard Web3 provider, which is
  // what MetaMask injects as window.ethereum into each page
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner()

  // The ERC-20 Contract ABI, which is a common contract interface
  // for tokens (this is the Human-Readable ABI format)
  const contractABI = [
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_greeting",
          "type": "string"
        }
      ],
      "name": "setGreeting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_greeting",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "greet",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "greeter",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // The Contract object
  const contractObject = new ethers.Contract(contractAddress, contractABI, signer);

  useEffect(() => {
    const connectWallet = async () => {
      await provider.send("eth_requestAccounts", []);
    }
    
    const getBalance = async () => {
      const balance = await provider.getBalance(contractAddress)
      const getEthersInContract = ethers.utils.formatEther(balance)
      setBalance(getEthersInContract)
    }

    const getGreeting = async () => {
      const greeting = await contractObject.greet()

      console.log(greeting)
      setGreet(greeting)
    }

    connectWallet().catch(console.error)
    getBalance().catch(console.error)
    getGreeting().catch(console.error)
  })

  const handleDepositChange = (e) => {
    setDepositValue(e.target.value)
  }

  const handleGreetingChange = (e) => {
    setGreetingValue(e.target.value)
  }

  const handleDepositSubmit = async (e) => {
    e.preventDefault()
    console.log(depositValue)
    const depositEthValue = ethers.utils.parseEther(depositValue)
    const depositUpdate = await contractObject.deposit({ value: depositEthValue })
    await depositUpdate.wait()
    setDepositValue('')

    const balance = await provider.getBalance(contractAddress)
    const getEthersInContract = ethers.utils.formatEther(balance)
    setBalance(getEthersInContract)
  }

  const handleGreetingSubmit = async (e) => {
    e.preventDefault();
    console.log(greetingValue);
    const greetingUpdate = await contractObject.setGreeting(greetingValue)
    await greetingUpdate.wait()
    setGreet(greetingValue)
    setGreetingValue('')
  }

  return (
    <div className="container">
      <div className="container text-center">
        <div className="row mt-5">
          <div className="col">
            <h3>{greet}</h3>
            <h5>Contract Balance: {balance} MATIC</h5>
            {/* <button type="submit" className="btn btn-success" onClick={connectWallet}>Connect Wallet</button>
            <button type="submit" className="btn btn-success" onClick={getBalance}>Get Balance</button> */}
          </div>
          <div className="col">
          <form onSubmit={handleDepositSubmit}>
            <div className="mb-3">
              <input type="number" className="form-control" placeholder='0' onChange={handleDepositChange} value={depositValue}/>
            </div>
            <button type="submit" className="btn btn-success">Deposit</button>
          </form>
          <form className='mt-5' onSubmit={handleGreetingSubmit}>
            <div className="mb-3">
              <input type="text" className="form-control" placeholder='test' onChange={handleGreetingChange} value={greetingValue}/>
            </div>
            <button type="submit" className="btn btn-dark">Change Greeting</button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
