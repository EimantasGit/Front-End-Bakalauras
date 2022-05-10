import { useEffect, useState } from "react";
import '../App.css';
import Web3 from 'web3';
import ABI from '../blockchain/createABI.json';
import { Container, Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';

function SimilarDisplay(props){

    const [list, setList] = useState([]);

    const web3 = new Web3(Web3.givenProvider || "https://data-seed-prebsc-1-s1.binance.org:8545/");
    const contractInstance = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT);

    useEffect(async ()=>{
        getSimilar();
    },  [props]);

    async function getSimilar(){

        const currentCrowdfund = await contractInstance.methods.crowdfunds(props.props.id).call();
        var min = parseInt(currentCrowdfund.crowdfundGoal) - 2;
        var max = parseInt(currentCrowdfund.crowdfundGoal) + 2;
        const similar = [];
        
        for(var i = 1; i <= await contractInstance.methods.totalCrowdfunds().call(); i++ ){
            var crowdfund = await contractInstance.methods.crowdfunds(i).call();
            if(parseInt(crowdfund.crowdfundGoal) >= min && parseInt(crowdfund.crowdfundGoal) <= max && crowdfund.id != currentCrowdfund.id){
                similar.push(crowdfund);
            }
        }
        const favorites = [];

        for(var i = 0; i < similar.length; i++){
            const crowdfund = await fetch(`http://localhost:8080/crowdfunds/${similar[i].id}`)
            favorites.push(await crowdfund.json());
        }

        const list = 
        <div className="container">
        {favorites.map((data, key) => (
                <Container key={key}>
                <Row style={{padding: 10}}> 
                    <Col style={{color: "#fff", margin: 10}}>{data.title}</Col>
                    <Col style={{color: "#fff", margin: 10}}>Goal: {similar[key].crowdfundGoal}</Col>
                    <Col><Link to={`/crowdfunds/${data.id}`} ><button className="manageButton">View Details</button></Link></Col>
                    </Row>
                </Container>
        ))}
        </div>
        setList(list);

    }
    return(
        <div>
            <h1 style={{color: "#ffffff", textAlign: "center", padding: "25px"}}>Similar Crowdfunds</h1>
            {list}
        </div>
    )
}

export default SimilarDisplay;