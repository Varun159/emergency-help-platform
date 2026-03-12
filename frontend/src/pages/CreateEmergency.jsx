import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";

function CreateEmergency(){

const navigate = useNavigate();

const [sidebarOpen,setSidebarOpen] = useState(false);

const [category,setCategory] = useState("");
const [description,setDescription] = useState("");
const [urgency,setUrgency] = useState("medium");

const createEmergency = async () => {

navigator.geolocation.getCurrentPosition(async (position)=>{

const latitude = position.coords.latitude;
const longitude = position.coords.longitude;

await API.post("/emergency/create",{
category,
description,
urgency_level:urgency,
latitude,
longitude
});

alert("Emergency created successfully");

navigate("/requests");

});

};

return(

<div style={styles.layout}>

<Sidebar
open={sidebarOpen}
close={()=>setSidebarOpen(false)}
/>

<div style={styles.content}>

<Navbar toggleSidebar={()=>setSidebarOpen(true)} />

<div style={styles.page}>

<div style={styles.container}>

<h2>Create Emergency Request</h2>

<div style={styles.card}>

<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
style={styles.input}
>

<option value="">Select Category</option>
<option value="blood">Blood</option>
<option value="transport">Medical Transport</option>
<option value="medicine">Medicine</option>
<option value="beds">Hospital Beds</option>
<option value="oxygen">Oxygen Cylinder</option>

</select>

<textarea
placeholder="Describe the emergency"
onChange={(e)=>setDescription(e.target.value)}
style={styles.textarea}
/>

<select
value={urgency}
onChange={(e)=>setUrgency(e.target.value)}
style={styles.input}
>

<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>

</select>

<button style={styles.button} onClick={createEmergency}>
Submit Emergency
</button>

</div>

</div>

</div>

</div>

</div>

);

}

const styles={

layout:{
display:"flex"
},

content:{
width:"100%"
},

page:{
background:"#f1f5f9",
minHeight:"100vh"
},

container:{
maxWidth:"500px",
margin:"60px auto"
},

card:{
background:"white",
padding:"30px",
borderRadius:"12px",
boxShadow:"0 8px 20px rgba(0,0,0,0.1)"
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
minHeight:"80px"
},

button:{
width:"100%",
padding:"12px",
background:"linear-gradient(90deg,#6366F1,#8B5CF6)",
border:"none",
borderRadius:"8px",
color:"white",
fontWeight:"600",
cursor:"pointer"
}

}

export default CreateEmergency;