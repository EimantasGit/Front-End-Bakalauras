import '../App.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import ABI from '../blockchain/createABI.json';
import { ProgressBar } from 'react-bootstrap';
import Comments from './Comments';
import SimilarDisplay from './SimilarDisplay';

function CrowdfundDetails(props){

    const [crowdfund, setCrowdfund ] = useState([]);
    const { crowdfundId } = useParams();
    const [crowdfundData, setCrowdfundData] = useState([]);
    const [contract, setContract] = useState([]);
    const [contributeAmount, setContributeAmount] = useState([]);
    const [contributed, setContributed] = useState(0);
    const [percent, setPercent] = useState(0);
    const [follow, setFollow] = useState(false);
    const [followers, setFollowers] = useState(0)
    
    const web3 = new Web3(Web3.givenProvider || "https://data-seed-prebsc-1-s1.binance.org:8545/");
    const contractInstance = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT);
            
    useEffect(async () =>{      

        const crowdfundInstance = await contractInstance.methods.crowdfunds(crowdfundId).call()
        const response = await fetch(`http://localhost:8080/crowdfunds/${crowdfundId}`);
        const json = await response.json();

        setContract(contractInstance);
        setCrowdfund(crowdfundInstance);
        setContributed(await web3.utils.fromWei(crowdfundInstance.crowdfundAmount, 'ether'))
        setCrowdfundData(json);
        setFollowers(json.followers.length)
        setPercent(await web3.utils.fromWei(crowdfundInstance.crowdfundAmount, 'ether') / crowdfundInstance.crowdfundGoal * 100)

        if(json.followers.includes(props.props)){
            setFollow(true)
        }

    }, []);

    useEffect(async ()=>{

        const crowdfundInstance = await contractInstance.methods.crowdfunds(crowdfundId).call()
        setPercent(await web3.utils.fromWei(crowdfundInstance.crowdfundAmount, 'ether') / crowdfundInstance.crowdfundGoal * 100)

    }, [crowdfund])

    async function contributeCrowdfund(evt) {

        evt.preventDefault();
        const crowdfundInstance = await contract.methods.crowdfunds(crowdfundId).call()

        if(crowdfundInstance.crowdfundStart > parseInt(Date.now()/1000).toFixed(0)){
            alert("Crowdfund has not started yet!");
        }
        else{
            await contract.methods.donateCrowdfund(crowdfundId).send({from: props.props, value: web3.utils.toWei(contributeAmount.toString(), 'ether')})
            const crowdfundInstance = await contract.methods.crowdfunds(crowdfundId).call()
            setContributed(await web3.utils.fromWei(crowdfundInstance.crowdfundAmount.toString(), 'ether'))
            setPercent(contributed/crowdfund.crowdfundGoal*100)
        }

    }

    async function submitFollow(){

        fetch(`http://localhost:8080/crowdfunds/${crowdfundId}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: crowdfundId,
                    wallet: props.props
                })
        });
        
        fetch(`http://localhost:8080/users/bookmarked/${props.props}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                wallet: props.props,
                bookmarked: crowdfundId
            })
        });
        var temp = followers + 1;
        setFollowers(temp);
        setFollow(true);

    }
    
    return(
        <div className="details">
            <p className='followers'>Favorited: {followers}</p> 
            <button className="follow" onClick={submitFollow}>{follow ? 'Favorited' : 'Favorite'}</button>
            <p className="detailTitle">{crowdfundData.title}</p>
            <p className="detailDesc">{crowdfundData.description}</p>
            <ProgressBar className="bar" variant='success' now={percent} ></ProgressBar>
            <p className='detailDesc'>Raised: {contributed} / {crowdfund.crowdfundGoal}</p>
            <form className="detailForm"  onSubmit={contributeCrowdfund}>
                <label class="detailSub">
                 Amount to contribute
                </label>
               
                <input className="detaiInput" type="number" step="0.01" name="amount" onChange={e => setContributeAmount(e.target.value)}/>
                {crowdfund.isOpen === true
                ? <input  className="detailSubmit" type="submit" value="Contribute" />
                : <input  className="detailSubmit" type="submit" value="Closed" disabled={true}/>
            }
            </form>
            <p className="detailDesc"><a href={crowdfundData.website}>Website</a></p>
            <p className="detailDesc"><a href={crowdfundData.twitter}>Twitter</a></p>
            <Comments crowdfundData = {crowdfundData} logged = {props.props}></Comments>
            <SimilarDisplay props={crowdfundData}/>
        </div>
        )
}
        
export default CrowdfundDetails;