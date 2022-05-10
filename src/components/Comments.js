import { useEffect, useState } from 'react';
import CommentDisplay from './CommentDisplay';

function Comments(props){

    const [content, setContent] = useState('');
    const [list, setList] = useState([]);
    const [updateComments, setUpdate] = useState(false);
    const [username, setUsername] = useState('');
    
    useEffect(async () => {

        if(props.crowdfundData.id){
            getComments();
        }

      }, [props]);

    useEffect(async () =>{

        getComments();

    }, [updateComments])

    async function getComments(){

        const comments = await fetch(`http://localhost:8080/comments/${props.crowdfundData.id}`);
        const json = await comments.json();
        setUsername(json);
        const list = 
            <div className="wrapper">
                {json.map((data, key) => (
                    <CommentDisplay key={key} props={data} logged={props.logged}></CommentDisplay>
                ))}
            </div>
      setList(list)

    }
    async function handleSubmit(evt){
        setUpdate(false);
        evt.preventDefault();
        const response = await fetch(`http://localhost:8080/users/${props.logged}`);
        const json = await response.json();
        fetch(`http://localhost:8080/comments/`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: props.crowdfundData.id,
                content: content,
                user: json.name,
            })
        }); 
        setUpdate(true);

    }

    return (
        <div>
            <form className="commentForm" onSubmit={handleSubmit}>
                <label className="subtitle">Comment</label>
                ​<textarea className="commentInput" rows="10" cols="70" maxLength={256} onChange={e => setContent(e.target.value)}></textarea>
                <div className="remaining">Remaining: {256}</div>
             <input  className="detailSubmit" type="submit" value="Leave a comment" />
            </form>
            {list}
        </div>
    )
}

export default Comments;