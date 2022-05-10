import './App.css';
import Web3 from 'web3';
import { useState } from 'react';
import ABI from './blockchain/createABI.json';
import CreateCrowdfund from './components/CreateCrowdfund';
import ViewCrowdfunds from './components/ViewCrowdfunds';
import ManageCrowdfund from './components/ManageCrowdfund';
import { Navbar, Container, Dropdown,  } from 'react-bootstrap';
import { Route, Routes, Link} from 'react-router-dom';
import CrowdfundDetails from './components/CrowdfundDetails';
import UserDetails from './components/UserDetails';
import FavoriteDisplay from './components/FavoriteDisplay';
import user from './images/user.png'

function App() {
  
  const [wallet, setWallet] = useState("Connect");
  const [contract, setContract] = useState([]);
  const [logged, setAccount] = useState([]);

  const web3 = new Web3(Web3.givenProvider || "https://data-seed-prebsc-1-s1.binance.org:8545/");
  const contractInstance = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT );

  const detectCurrentProvider = () => {
      let provider;
      if (window.ethereum) {
        provider = window.ethereum;
      } else if (window.web3) {
        provider = window.web3.currentProvider;
      } else {
        alert('Metamask not found!');
      }
      return provider;
  };

 
  const loadBlockchain = async () => {
      var contractResults = [];
    
      const currentProvider = detectCurrentProvider();
      await currentProvider.request({ method: 'eth_requestAccounts' });
      const userAccount = await web3.eth.getAccounts();
      const account = userAccount[0];
      const response = await fetch(`http://localhost:8080/users/${account}`);
      var json = await response.json();
      if(json == null){
        alert("You need to create an account!");
      }
      setAccount(userAccount[0]);
      setWallet(account.substring(0, 2) + "...." + account.substring(38, 44));

      const crowdfundCount = await contractInstance.methods.totalCrowdfunds().call();
      setContract(contractInstance);
      for(var i = 1; i <= crowdfundCount; i++){
          var contractCrowdfund = await contractInstance.methods.crowdfunds(i).call();
          contractResults.push(contractCrowdfund);
      }
      if (userAccount.length === 0) {
        alert("Login to metamask!");
      }
  }

  return (
      <div className="App">
        <Navbar className="nav" >
            <Container>
              <Navbar.Brand style={{color: "#ffffff"}}>Bakalauras </Navbar.Brand>
              <Link to="/crowdfunds"><button className="buttonLink">View Crowdfunds</button></Link>
              <Link to="/create"><button className="buttonLink">Create a Crowdfund</button></Link>
              <Link to="/manage"><button className="buttonLink">Manage Crowdfunds</button></Link>
              <button onClick={loadBlockchain} className="buttonLink">{wallet}</button>
              <Dropdown className='drop'>
                  <Dropdown.Toggle  id="dropdown-basic">
                      <img style={{width: 25, height: 25}} src={user}></img>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className='drop'>
                    <Link style={{textDecoration: "none"}} to="/user"><p className='userLinks'>My Account</p></Link>
                    <Link style={{textDecoration: "none"}}  to="/favorites"><p className='userLinks'>My Favorites</p></Link>
                  </Dropdown.Menu>
                </Dropdown>
            </Container>
        </Navbar>
        <Routes>
          <Route path='/create' element={<CreateCrowdfund props={logged}/>}/>
          <Route path='/crowdfunds' element={<ViewCrowdfunds/>}/>
          <Route path='crowdfunds/:crowdfundId' element={<CrowdfundDetails props={logged}/>}/>
          <Route path='/manage' element={<ManageCrowdfund props = {logged} crowdfundProps={contract}/>}/>
          <Route path='/user' element={<UserDetails props = {logged} />}/>
          <Route path='/favorites' element={<FavoriteDisplay props = {logged} />}/>
        </Routes>
      </div>
  );
}

export default App;
