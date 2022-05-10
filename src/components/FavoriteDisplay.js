import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';


function FavoriteDisplay(props){

    const [favorites, setFavorites] = useState([]);

    useEffect(async ()=>{
        getFavorites();
    }, []);

    useEffect(async ()=> {
        getFavorites();
    }, [favorites]);

    async function getFavorites(){
        const response = await fetch(`http://localhost:8080/users/${props.props}`);
        var json = await response.json();
        var favorites = []
        for(var i = 0; i < json.bookmarked.length; i++){
            const crowdfund = await fetch(`http://localhost:8080/crowdfunds/${json.bookmarked[i]}`)
            favorites.push(await crowdfund.json());
        }
        const list = 
            <div className="container">
                    {favorites.map((data, key) => (
                            <Container>
                            <Row style={{padding: 10}}> 
                                <Col style={{color: "#fff"}}>{data.title}</Col>
                                <Col><Link to={`/crowdfunds/${data.id}`} ><button className="manageButton">View Details</button></Link></Col>
                                <Col><button onClick={(e) => removeFavorite(data.id)}  className="manageButton">Remove</button></Col>
                            </Row>
                            </Container>
                    ))}
                </div>   
        setFavorites(list)
    }
    async function removeFavorite(crowdfundID){
        alert("Favorite removed!");
        fetch(`http://localhost:8080/users/bookmarked/${props.props}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                wallet: props.props,
                id: crowdfundID,
            })
        }); 
        favorites.splice(favorites.findIndex(i => i.id === crowdfundID), 1)
        setFavorites(favorites.splice(favorites.findIndex(i => i.id === crowdfundID), 1));
    }
    return(
        <div className="details">
             <h1 className="pageTitle">Your Favorites</h1>
               {favorites}
        </div>    
    )
}

export default FavoriteDisplay;