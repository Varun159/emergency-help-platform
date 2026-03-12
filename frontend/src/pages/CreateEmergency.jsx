import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";

import LocationPreviewMap from "../components/LocationPreviewMap";

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

<h2 style={styles.title}>Create Emergency Request</h2>

<div style={styles.card}>

{/* CATEGORY */}

<p style={styles.label}>Select Category</p>

<div style={styles.categoryGrid}>

<div
style={{
...styles.categoryCard,
...(category==="blood" && styles.categorySelected)
}}
onClick={()=>setCategory("blood")}
>
Blood
</div>

<div
style={{
...styles.categoryCard,
...(category==="transport" && styles.categorySelected)
}}
onClick={()=>setCategory("transport")}
>
Transport
</div>

<div
style={{
...styles.categoryCard,
...(category==="medicine" && styles.categorySelected)
}}
onClick={()=>setCategory("medicine")}
>
Medicine
</div>

<div
style={{
...styles.categoryCard,
...(category==="beds" && styles.categorySelected)
}}
onClick={()=>setCategory("beds")}
>
Beds
</div>

<div
style={{
...styles.categoryCard,
...(category==="oxygen" && styles.categorySelected)
}}
onClick={()=>setCategory("oxygen")}
>
Oxygen
</div>

</div>

{/* DESCRIPTION */}

<p style={styles.label}>Describe Emergency</p>

<textarea
placeholder="Provide details about the emergency"
onChange={(e)=>setDescription(e.target.value)}
style={styles.textarea}
/>

{/* URGENCY */}

<p style={styles.label}>Urgency Level</p>

<div style={styles.urgencyRow}>

<div
style={{
...styles.urgencyButton,
...(urgency==="low" && styles.urgencySelected)
}}
onClick={()=>setUrgency("low")}
>
Low
</div>

<div
style={{
...styles.urgencyButton,
...(urgency==="medium" && styles.urgencySelected)
}}
onClick={()=>setUrgency("medium")}
>
Medium
</div>

<div
style={{
...styles.urgencyButton,
...(urgency==="high" && styles.urgencySelected)
}}
onClick={()=>setUrgency("high")}
>
High
</div>

</div>

<div style={styles.mapSection}>

<h3 style={styles.mapTitle}>
Location Preview
</h3>

<div style={styles.mapCard}>
<LocationPreviewMap/>
</div>

</div>
<br></br>

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
maxWidth:"600px",
margin:"60px auto"
},

title:{
marginBottom:"20px"
},

card:{
background:"white",
padding:"30px",
borderRadius:"12px",
boxShadow:"0 8px 20px rgba(0,0,0,0.1)"
},

label:{
fontSize:"14px",
fontWeight:"600",
marginBottom:"8px",
display:"block"
},

categoryGrid:{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"12px",
marginBottom:"20px"
},

categoryCard:{
padding:"12px",
borderRadius:"10px",
background:"#f9fafb",
border:"1px solid #e5e7eb",
cursor:"pointer",
textAlign:"center",
fontWeight:"500"
},

categorySelected:{
background:"#6366F1",
color:"white",
border:"none"
},

textarea:{
width:"100%",
padding:"12px",
marginBottom:"20px",
borderRadius:"8px",
border:"1px solid #d1d5db",
minHeight:"100px"
},

urgencyRow:{
display:"flex",
gap:"10px",
marginBottom:"20px"
},

urgencyButton:{
flex:1,
padding:"10px",
borderRadius:"10px",
background:"#f3f4f6",
textAlign:"center",
cursor:"pointer",
fontWeight:"500"
},

urgencySelected:{
background:"#ef4444",
color:"white"
},

mapSection:{
marginTop:"40px"
},

mapTitle:{
marginBottom:"12px",
fontWeight:"600"
},

mapCard:{
background:"white",
padding:"10px",
borderRadius:"12px",
boxShadow:"0 8px 20px rgba(0,0,0,0.08)"
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

};

export default CreateEmergency;