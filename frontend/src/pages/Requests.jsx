import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";

function Requests(){

const [sidebarOpen,setSidebarOpen] = useState(false);
const [requests,setRequests] = useState([]);
const [loading,setLoading] = useState(true);

useEffect(()=>{

const fetchRequests = async ()=>{

try{

const res = await API.get("/emergency/my-requests", {
  headers: {
    "Cache-Control": "no-cache"
  }
});
console.log(res.data);

setRequests(res.data);

}catch(err){

console.log(err);

}

setLoading(false);

};

fetchRequests();

},[]);

return(

<div style={styles.layout}>

<Sidebar
open={sidebarOpen}
close={()=>setSidebarOpen(false)}
/>

<div style={styles.content}>

<Navbar toggleSidebar={()=>setSidebarOpen(true)} />

<div style={styles.container}>

<h1 style={styles.title}>My Requests</h1>

<p style={styles.subtitle}>
All emergency requests you created will appear here.
</p>

{loading && <p>Loading requests...</p>}

{!loading && requests.length === 0 && (

<div style={styles.emptyCard}>
No emergency requests created yet.
</div>

)}

{requests.map((req)=>(
<div key={req._id} style={styles.card}>

<div style={styles.cardTop}>

<span style={styles.category}>
{req.category}
</span>

<span style={{
...styles.urgency,
...(req.urgency_level==="high" && styles.high),
...(req.urgency_level==="medium" && styles.medium),
...(req.urgency_level==="low" && styles.low)
}}>
{req.urgency_level}
</span>

</div>

<p style={styles.description}>
{req.description}
</p>

<div style={styles.statusRow}>

<span>Status:</span>

<span style={{
...styles.status,
...(req.status==="open" && styles.open),
...(req.status==="resolved" && styles.resolved)
}}>
{req.status}
</span>

</div>

</div>
))}

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

container:{
maxWidth:"900px",
margin:"60px auto",
padding:"20px"
},

title:{
fontSize:"28px",
fontWeight:"700"
},

subtitle:{
color:"#6b7280",
marginBottom:"30px"
},

emptyCard:{
background:"white",
padding:"30px",
borderRadius:"12px",
boxShadow:"0 6px 20px rgba(0,0,0,0.06)"
},

card:{
background:"white",
padding:"20px",
borderRadius:"12px",
boxShadow:"0 6px 20px rgba(0,0,0,0.06)",
marginBottom:"20px"
},

cardTop:{
display:"flex",
justifyContent:"space-between",
marginBottom:"10px"
},

category:{
fontWeight:"600",
textTransform:"capitalize"
},

urgency:{
padding:"4px 10px",
borderRadius:"6px",
fontSize:"12px",
color:"white"
},

high:{
background:"#ef4444"
},

medium:{
background:"#f59e0b"
},

low:{
background:"#10b981"
},

description:{
color:"#374151",
marginBottom:"10px"
},

statusRow:{
display:"flex",
justifyContent:"space-between",
fontSize:"14px"
},

status:{
fontWeight:"600"
},

open:{
color:"#6366F1"
},

resolved:{
color:"#10b981"
}

};

export default Requests;