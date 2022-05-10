import { useEffect, useState } from "react";
import Web3 from 'web3';
import ABI from '../blockchain/createABI.json';
import '../App.css';

function CreateCrowdfund(props) {

    const [contract, setContract] = useState([]);
    const [amount, setAmount] = useState(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [mission, setMission] = useState('');
    const [twitter, setTwitter] = useState('');
    const [website, setWebsite] = useState('');

    const [BNBPrice, setBNBPrice] = useState(0);
    const [crowdfundID, setID] = useState(0);
    const [startDate, setStart] = useState("2022-01-01");
    const [displayDate, setDisplay] = useState("2022-01-01");

    useEffect(async () =>{
        const web3 = new Web3(Web3.givenProvider || "https://data-seed-prebsc-1-s1.binance.org:8545/");
        const contractInstance = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT);
       
            
        setID(parseInt(await contractInstance.methods.totalCrowdfunds().call(), 10) + 1);
        setContract(contractInstance);

        fetch("https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT")
        .then(response => response.json())
        .then(data => setBNBPrice(data.price.substring(0, data.price.length-6)));
       
    },[])

    async function handleSubmit(evt) {
        evt.preventDefault();
        contract.methods.createCrowdfund(amount, startDate).send({from: props.props});
        fetch('http://localhost:8080/crowdfunds/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: crowdfundID,
                    title: name,
                    description: description,
                    mission: mission,
                    website: website,
                    twitter: twitter
                })
        });
    }
    const handleInputChange =(e) => {
            
        setStart(parseInt((new Date(e.target.value)).getTime()/1000))
        setDisplay(e.target.value)

    }
    
    return(
        <div className="container">
            <form className="form" onSubmit={handleSubmit}>
                <label className="subtitle">
                BNB Goal 
                </label>
                <input  className="input" type="number" name="amount" onChange={e => setAmount(e.target.value)}/>
                <p className="remaining">1 BNB = {BNBPrice} USD</p>
                <label className="subtitle">
                Crowdfund Title
                </label>
                <input  className="input"type="text" name="title" maxLength={20} onChange={e => setName(e.target.value)} />
                <div className="remaining">Remaining: {20 - name.length}</div>
                <br></br>
                <label className="subtitle">
                Description:
                </label>
                ​<textarea className="descInput" rows="10" cols="70" maxLength={256} onChange={e => setDescription(e.target.value)}></textarea>
                <div className="remaining">Remaining: {256 - description.length}</div>
                <br></br>
                <label className="subtitle">
                Short description of your project
                </label>
                <input   className="input"type="text" name="mission" maxLength={50} onChange={e => setMission(e.target.value)}/>
                <div class="remaining">Remaining: {50 - mission.length}</div>
                <label className="subtitle">
                Website
                </label>
                <input   className="input"type="text" name="website" maxLength={50} onChange={e => setWebsite(e.target.value)}/>
                <label className="subtitle">
                Twitter
                </label>
                <input   className="input"type="text" name="twitter" maxLength={50} onChange={e => setTwitter(e.target.value)}/>
                <br></br>
                <label className="subtitle">Crowdfund start</label>
                <input className="dateInput" type="datetime-local" name="partydate" value={displayDate} onChange={handleInputChange}></input>
                <input  className="submit" type="submit" value="Create a Crowdfund" />
            </form>
        </div>
    )
}

export default CreateCrowdfund;