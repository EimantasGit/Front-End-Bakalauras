import { useEffect, useState } from 'react';
import '../App.css';


function CommentDisplay(props){
    const [user, setUser] = useState('');

    useEffect(async () =>{
        const response = await fetch(`http://localhost:8080/users/${props.logged}`);
        const json = await response.json();
        if(json.name)
        setUser(json.name);
    }, [])

    async function deleteComment(){
        
        alert("Comment deleted!");
        
        fetch('http://localhost:8080/comments/', {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: props.props._id,
            })
        }); 
    }
    
    return(
        <div className='commentContainer'>
            <p className='commentAuthor'>By: {props.props.user}</p>
            <p className='comment'>{props.props.content}</p>
            {(user === props.props.user
                ? <button className="deleteButton" onClick={deleteComment}>Delete</button>
                : <div/>)}     
        </div>
    )
}


export default CommentDisplay;