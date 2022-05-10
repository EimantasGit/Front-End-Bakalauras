import { useEffect, useState } from "react";
import Web3 from 'web3';
import ABI from '../blockchain/createABI.json';
import CrowdfundCard from "./crowdfundCard";
import load from '../images/loading.gif';
import Trending from "./Trending";

function ViewCrowdfunds(){

    const [completeList, setList] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [crowdfundList, setCrowdfunds] = useState([]);
    const [chainData, setChainData] = useState([]);
    const [crowdfundJSON, setJSON] = useState([]);
    const web3 = new Web3(Web3.givenProvider || "https://data-seed-prebsc-1-s1.binance.org:8545/");
    const contractInstance = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT);

    useEffect(async () =>{       

        var crowdfunds = [];
        
        for(var i = 1; i <= await contractInstance.methods.totalCrowdfunds().call(); i++ ){
            var crowdfund = await contractInstance.methods.crowdfunds(i).call()
                crowdfunds.push(crowdfund);
        }

        async function fetchAPI() {
            const response = await fetch('http://localhost:8080/crowdfunds');
            var json = await response.json();
            const list = 
            <div className="wrapper">
                {json.map((data, key) => (
                    <CrowdfundCard key={key} props={data} chainProps={crowdfunds}></CrowdfundCard>
                ))}
            </div>
            setJSON(json);
            setList(list);
            setLoading(false);
            setChainData(crowdfunds);
        }
        setCrowdfunds(crowdfunds)
        fetchAPI();
    }, [])
    async function handleSearch(value){
        const list = 
        <div className="wrapper">
            {crowdfundJSON.filter(f => f.title.includes(value) || value === '').map((data, key) => (
                <CrowdfundCard key={key} props={data} chainProps={chainData}></CrowdfundCard>
            ))}
        </div>
        setList(list);
    }

    async function handleSort(value){
        const types = {
            Start: 'crowdfundStart',
            Goal: 'crowdfundGoal',
            Raised: 'crowdfundAmount',
            Active: 'isOpen',
          };
        const sortProperty = types[value];

        const sorted = chainData.sort((a, b) => b[sortProperty] - a[sortProperty]);
        var sortedJSON = [];
        for(var i = 0; i < chainData.length; i++){
            var pos = crowdfundJSON.map(function(e) { return e.id }).indexOf(parseInt(sorted[i].id));
            sortedJSON.push(crowdfundJSON[pos]);
           
        }
        const list = 
        <div className="wrapper">
            {sortedJSON.map((data, key) => (
                <CrowdfundCard key={key} props={data} chainProps={chainData}></CrowdfundCard>
            ))}
        </div>
        setList(list);
    }
    return (
        <div>
            {loading === true
             ?<div>
             <img src={load} className="loader"></img>
             </div> 
             :
                <div> 
                    <Trending crowdfunds={crowdfundJSON}></Trending>
                    <input placeholder="Search..." className="search" type="text" onChange={e => handleSearch(e.target.value)}></input> 
                    <select placeholder="Sort..." className="sort" onChange={(e) => handleSort(e.target.value)}>
                        <option value="" disabled selected>Sort</option>
                        <option>Start</option>
                        <option>Goal</option>
                        <option>Raised</option>
                        <option>Active</option>
                    </select>
                    {completeList}
                </div>
            }
        </div>
    )
}

export default ViewCrowdfunds;