import { useEffect, useState } from "react";
import Web3 from 'web3';
import ABI from '../blockchain/createABI.json';
import { Container, Row, Col } from "react-bootstrap";
import load from '../images/loading.gif';
import { Link } from 'react-router-dom';
import { CSVLink } from "react-csv";

function ManageCrowdfund(props) {

    const [raised, setRaised] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [funds, setFunds] = useState([]);
    const web3 = new Web3(Web3.givenProvider || "https://data-seed-prebsc-1-s1.binance.org:8545/");
    const contractInstance = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT);

    async function closeCrowdfund(crowdfundID){
        const crowdfund = await contractInstance.methods.crowdfunds(crowdfundID).call();
        const crowdfundRaised = parseFloat(await web3.utils.fromWei(crowdfund.crowdfundAmount, 'ether'));
        const crowdfundGoal = parseInt(crowdfund.crowdfundGoal);
        
        if(crowdfundGoal / 2 > crowdfundRaised){
            alert("SoftCap not reached!");
        }
        else{
            contractInstance.methods.withdrawCrowdfund(crowdfundID).send({from: props.props});
        }
    }

    useEffect(async () =>{
       
        var crowdfunds = []; 

        for(var i = 1; i <= await contractInstance.methods.totalCrowdfunds().call(); i++ ){
            var crowdfund = await contractInstance.methods.crowdfunds(i).call();
            if(props.props == crowdfund.owner){
                crowdfunds.push(crowdfund);
            }
        }

        const list = 
        <div className="container">
            {crowdfunds.map((data, key) => (
                    <Container key={key}>
                    <Row style={{padding: 10}}> 
                        <Col style={{color: "#fff", margin: 10}}>Goal: {data.crowdfundGoal}</Col>
                        <Col><Link to={`/crowdfunds/${data.id}`} ><button className="manageButton">View Details</button></Link></Col>
                        {(data.isOpen === true
                        ? <Col style={{color: "#fff"}}><button className="manageButton" onClick = {(e) => closeCrowdfund(data.id)}>Withdraw &amp; Close</button></Col>
                        : <Col style={{color: "#fff"}}><button className="manageButton" disabled={true} >Closed</button></Col>)}                              
                    </Row>
                    </Container>
            ))}
            </div>
        setRaised(list);
        const parseFunds = [...crowdfunds]
        for (var i=0;i<parseFunds.length;i++) {
            delete parseFunds[i].owner;
            delete parseFunds[i][0]
            delete parseFunds[i][1]
            delete parseFunds[i][2]
            delete parseFunds[i][3]
            delete parseFunds[i][4]
            delete parseFunds[i][5]
            parseFunds[i].crowdfundAmount = await web3.utils.fromWei(parseFunds[i].crowdfundAmount, 'ether')
            parseFunds[i].crowdfundStart =   new Date(parseFunds[i].crowdfundStart * 1000);

        }
        setLoading(false);
        setFunds(parseFunds)

    },[])

    return (
        <div className="details">
            <h1 className="pageTitle">Your Crowdfunds</h1>
            {loading === true
            ? <div><img src={load} className="loader"></img></div>
            : <div>{raised}</div>
            }
            <CSVLink className="generate" data={funds}>Generuoti projektų ataskaitą</CSVLink>;
        </div>    
    )
}

export default ManageCrowdfund;