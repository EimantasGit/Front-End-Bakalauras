import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import '../App.css';
import { Link } from 'react-router-dom';

function Trending(props){
    const [trendingCrowdfunds, setTrendingCrowdfunds] = useState([]);

    useEffect(async () => {
        const sorted = props.crowdfunds.sort((a, b) => b.followers.length - a.followers.length);
        const list = 
                <div>
                    {sorted.slice(0, 3).map((data) => (
                        <div>
                            <Link 
                            style={{ textDecoration: 'none' }} 
                            to={`/crowdfunds/${data.id}`}>
                                <p style={{color: "#fff", margin: 10}}>
                                    {data.title}, Likes: {data.followers.length}
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>  
        setTrendingCrowdfunds(list);
    }, []);

    return(
        <div className="trending"> 
        <Container>
                 <p>Trending</p>
                {trendingCrowdfunds}
        </Container></div>
    )

}

export default Trending;