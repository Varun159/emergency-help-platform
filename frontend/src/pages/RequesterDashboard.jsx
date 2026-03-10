import { useState } from "react";
import API from "../api/axios";

function RequesterDashboard(){

const [category,setCategory] = useState("");
const [description,setDescription] = useState("");
const [urgency,setUrgency] = useState("medium");

const createEmergency = async () => {

try{

// get location from browser
navigator.geolocation.getCurrentPosition(async (position)=>{

const latitude = position.coords.latitude;
const longitude = position.coords.longitude;

const res = await API.post("/emergency/create",{
category,
description,
urgency_level:urgency,
latitude,
longitude
});

alert("Emergency created successfully");

});

}catch(err){
alert("Error creating emergency");
}

};

return(

<div>

<h2>Requester Dashboard</h2>

<input
placeholder="Category (blood / transport / medicine)"
onChange={(e)=>setCategory(e.target.value)}
/>

<input
placeholder="Description"
onChange={(e)=>setDescription(e.target.value)}
/>

<select onChange={(e)=>setUrgency(e.target.value)}>

<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>

</select>

<button onClick={createEmergency}>
Create Emergency
</button>

</div>

);

}

export default RequesterDashboard;