import '../App.css';
import { useEffect, useState } from "react";
import { set } from 'date-fns';

function UserDetails(props){

    const [name, setName] = useState('');
    const [email, setMail] = useState('');
    const [displayName, setDisplayName] = useState('Create your user!');
    const [displayMail, setDisplayMail] = useState('Create your user!');

    useEffect(async () =>{       
        async function fetchAPI() {
            const response = await fetch(`http://localhost:8080/users/${props.props}`);
            var json = await response.json();
            setDisplayName(json.name)
            setDisplayMail(json.email)
        }
        fetchAPI();
    },[])

    async function handleSubmit(evt) {
        alert("User info saved!");
        evt.preventDefault();
        fetch('http://localhost:8080/users', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    wallet: props.props,
                    name: name,
                    email: email,
                    initialized: true
                })
        });
    }
    return(
        <div className='details'>
           
           <h1 className="pageTitle">Your Details</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <label className="subtitle">
                    Username
                    </label>
                    <input className="detaiInput" placeholder={displayName} type="text" name="title" maxLength={20} onChange={e => setName(e.target.value)}/>
                    <label className="subtitle">
                    Email Address
                    </label>
                    <input className="detaiInput" placeholder={displayMail} type="text" name="title" maxLength={20} onChange={e => setMail(e.target.value)}/>
                    <input  className="detailSubmit" type="submit" value="Save" />
            </form>
            
        </div>
    )
}

export default UserDetails;