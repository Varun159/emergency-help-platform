import { useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function RequesterDashboard(){

const [category,setCategory] = useState("");
const [description,setDescription] = useState("");
const [urgency,setUrgency] = useState("medium");

const createEmergency = async () => {

navigator.geolocation.getCurrentPosition(async (position)=>{

const latitude = position.coords.latitude;
const longitude = position.coords.longitude;

try{

await API.post("/emergency/create",{
category,
description,
urgency_level:urgency,
latitude,
longitude
});

alert("Emergency created successfully");

}catch(err){
alert("Error creating emergency");
}

});

};

return(

<div style={styles.page}>

<Navbar/>

<div style={styles.container}>

<h2 style={styles.title}>Create Emergency Request</h2>

<div style={styles.card}>

<input
placeholder="Category (blood / transport / medicine)"
onChange={(e)=>setCategory(e.target.value)}
style={styles.input}
/>

<textarea
placeholder="Describe the emergency"
onChange={(e)=>setDescription(e.target.value)}
style={styles.textarea}
/>

<select
onChange={(e)=>setUrgency(e.target.value)}
style={styles.input}
>

<option value="low">Low Urgency</option>
<option value="medium">Medium Urgency</option>
<option value="high">High Urgency</option>

</select>

<button style={styles.button} onClick={createEmergency}>
Create Emergency
</button>

</div>

</div>

</div>

);

}

const styles = {

page:{
background:"#f1f5f9",
minHeight:"100vh"
},

container:{
maxWidth:"500px",
margin:"60px auto",
padding:"20px"
},

title:{
marginBottom:"20px",
fontWeight:"600"
},

card:{
background:"white",
padding:"30px",
borderRadius:"12px",
boxShadow:"0 10px 30px rgba(0,0,0,0.08)"
},

input:{
width:"100%",
padding:"12px",
marginBottom:"14px",
borderRadius:"8px",
border:"1px solid #d1d5db"
},

textarea:{
width:"100%",
padding:"12px",
marginBottom:"14px",
borderRadius:"8px",
border:"1px solid #d1d5db",
minHeight:"90px"
},

button:{
width:"100%",
padding:"12px",
borderRadius:"8px",
border:"none",
background:"linear-gradient(90deg,#6366F1,#8B5CF6)",
color:"white",
fontWeight:"600",
cursor:"pointer"
}

};

export default RequesterDashboard;