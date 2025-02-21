'use client';
import {insertMessage} from '../actions';
import {useState} from 'react';
import VisibilityTable from '../../components/VisibilityTable';




export default function Test() {
/*
<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black">
        <h1> Practice Message: </h1>
        <input type="text" className ="text-black" onChange={(e) => messageSet(e.target.value)} placeholder="Enter message here"></input>
        <button onClick={handleSubmit} >Submit</button>
        
    
    </div>
    */
    const [message, messageSet] = useState("");

    const data = [{name: "Module 1", description: "This is the first module", visible: true}, {name: "Module 2", description: "This is the second module", visible: false}, {name: "Module 3", description: "This is the third module", visible: true}];
    const handleSubmit = async () => {
        console.log(message);
        await insertMessage({message});
    }


    return (
        <VisibilityTable tableTitle={"Module Visibility"} tableData={data} moniker={"Module"}/>
    );
}
