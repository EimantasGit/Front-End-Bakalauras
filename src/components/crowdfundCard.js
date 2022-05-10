import '../App.css';
import Web3 from 'web3';
import { Link } from 'react-router-dom';

import {useEffect, useState} from 'react';

function CrowdfundCard(props){
    const [start, setStart] = useState('');
    const [contributed, setContributed] = useState(0);
    const [goal, setGoal] = useState(0);
    const [status, setStatus] = useState(true);

    const web3 = new Web3(Web3.givenProvider || "https://data-seed-prebsc-1-s1.binance.org:8545/");

    useEffect(async () =>{        
        var pos = props.chainProps.map(function(e) { return parseInt(e.id); }).indexOf(parseInt(props.props.id));
        setContributed(await web3.utils.fromWei(props.chainProps[pos].crowdfundAmount, 'ether'));
        setGoal(await props.chainProps[pos].crowdfundGoal, 'ether');
        setStatus(await props.chainProps[pos].isOpen);
        
        var date = new Date(props.chainProps[pos].crowdfundStart * 1000);
        var hours = date.getHours();

        if(hours < 9) { var hourString = "0" + hours}
        else { hourString = hours}
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = hourString + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        var year = date.getFullYear()        
        var month = date.getMonth() + 1;
        var day = date.getDate()

        if(day < 9){ var dayString = "0" + day }
        else{ dayString = day}
        
        if(month < 9){ var monthString = "0" + month }
        else { monthString = month}
        setStart(year + "-" + monthString + "-" + dayString + " " + formattedTime)
    
    }, [props])
    
    return(
        <div className="card">
            <div className="card__body">
                <h2 className="card__title">{props.props.title}</h2>
                <p className="card__description">{props.props.mission}</p>
                <p className="card__description">Goal: {goal}</p>
                <p className="card__description">Raised: {contributed}</p>
                <p className="card__description">Starts: {start}</p>
                {status === true
                ? <p>Status: Active</p>
                : <p>Status: Finished</p>}
         </div>
            <Link to={`/crowdfunds/${props.props.id}`} ><button className="card__btn">View Details</button></Link>
        </div>
    )
}

export default CrowdfundCard;