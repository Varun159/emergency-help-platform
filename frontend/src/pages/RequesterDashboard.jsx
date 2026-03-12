import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import DashboardMap from "../components/DashboardMap";
import Sidebar from "../components/Sidebar";

function RequesterDashboard(){

const navigate = useNavigate();

const [sidebarOpen,setSidebarOpen] = useState(false);

return(

<div style={styles.layout}>

<Sidebar
open={sidebarOpen}
close={()=>setSidebarOpen(false)}
/>

<div style={styles.content}>

<Navbar toggleSidebar={()=>setSidebarOpen(true)} />

<div style={styles.container}>

{/* HERO ACTION */}

<div style={styles.heroCard}>

<h1 style={styles.heroTitle}>
Need Help Right Now?
</h1>

<p style={styles.heroText}>
Create an emergency request and nearby helpers will be notified instantly.
</p>

<button
style={styles.heroButton}
onClick={()=>navigate("/create-emergency")}
>
Create Emergency Request
</button>

</div>

<div style={styles.divider}></div>

{/* STATS */}

<h3 style={styles.sectionHeader}>Overview</h3>

<div style={styles.statsGrid}>

<div
style={styles.statCard}
onMouseEnter={(e)=>{
e.currentTarget.style.transform="translateY(-5px)";
e.currentTarget.style.boxShadow="0 18px 40px rgba(0,0,0,0.15)";
}}
onMouseLeave={(e)=>{
e.currentTarget.style.transform="translateY(0)";
e.currentTarget.style.boxShadow="0 6px 18px rgba(0,0,0,0.06)";
}}
>

<div style={styles.statBarPurple}></div>

<div style={styles.statHeader}>
<span style={styles.statDotOpen}></span>
<p style={styles.statLabel}>Open Requests</p>
</div>

<h2 style={styles.statNumber}>2</h2>
<p style={styles.statMeta}>Active emergencies</p>

</div>


<div
style={styles.statCard}
onMouseEnter={(e)=>{
e.currentTarget.style.transform="translateY(-5px)";
e.currentTarget.style.boxShadow="0 18px 40px rgba(0,0,0,0.15)";
}}
onMouseLeave={(e)=>{
e.currentTarget.style.transform="translateY(0)";
e.currentTarget.style.boxShadow="0 6px 18px rgba(0,0,0,0.06)";
}}
>

<div style={styles.statBarGreen}></div>

<div style={styles.statHeader}>
<span style={styles.statDotResolved}></span>
<p style={styles.statLabel}>Resolved</p>
</div>

<h2 style={styles.statNumber}>5</h2>
<p style={styles.statMeta}>Completed help</p>

</div>


<div
style={styles.statCard}
onMouseEnter={(e)=>{
e.currentTarget.style.transform="translateY(-5px)";
e.currentTarget.style.boxShadow="0 18px 40px rgba(0,0,0,0.15)";
}}
onMouseLeave={(e)=>{
e.currentTarget.style.transform="translateY(0)";
e.currentTarget.style.boxShadow="0 6px 18px rgba(0,0,0,0.06)";
}}
>

<div style={styles.statBarOrange}></div>

<div style={styles.statHeader}>
<span style={styles.statDotHelpers}></span>
<p style={styles.statLabel}>Nearby Helpers</p>
</div>

<h2 style={styles.statNumber}>12</h2>
<p style={styles.statMeta}>Available nearby</p>

</div>

</div>

<div style={styles.divider}></div>

{/* RECENT REQUESTS */}

<h3 style={styles.sectionHeader}>Activity</h3>

<div style={styles.activityGrid}>

<div style={styles.requestList}>

<h2 style={styles.sectionTitle}>Recent Requests</h2>

<div style={styles.requestCard}>

<div>
<p style={styles.requestTitle}>Blood Needed</p>
<p style={styles.requestDesc}>Urgent donor required</p>
</div>

<div style={styles.requestRight}>
<span style={styles.high}>HIGH</span>
<span style={styles.open}>OPEN</span>
</div>

</div>


<div style={styles.requestCard}>

<div>
<p style={styles.requestTitle}>Transport Needed</p>
<p style={styles.requestDesc}>Patient transfer required</p>
</div>

<div style={styles.requestRight}>
<span style={styles.medium}>MEDIUM</span>
<span style={styles.resolved}>RESOLVED</span>
</div>

</div>


<div style={styles.requestCard}>

<div>
<p style={styles.requestTitle}>Medicine Required</p>
<p style={styles.requestDesc}>Pharmacy assistance needed</p>
</div>

<div style={styles.requestRight}>
<span style={styles.high}>HIGH</span>
<span style={styles.open}>OPEN</span>
</div>

</div>

</div>


{/* MAP PANEL */}

<div style={styles.mapPanel}>

<div style={styles.mapHeader}>
<h2 style={styles.sectionTitle}>Emergency Map</h2>
<span style={styles.mapBadge}>LIVE</span>
</div>

<div style={styles.mapContainer}>
<DashboardMap/>
</div>

</div>

</div>

</div>

</div>

</div>

);

}

const styles = {

layout:{
display:"flex"
},

content:{
width:"100%"
},

container:{
maxWidth:"1000px",
margin:"60px auto",
padding:"20px"
},

heroCard:{
background:"linear-gradient(135deg,#6366F1,#8B5CF6)",
color:"white",
padding:"40px",
borderRadius:"18px",
marginBottom:"40px",
textAlign:"center",
boxShadow:"0 12px 30px rgba(0,0,0,0.18)"
},

heroTitle:{
fontSize:"30px",
marginBottom:"10px"
},

heroText:{
opacity:"0.9",
marginBottom:"20px"
},

heroButton:{
background:"white",
color:"#6366F1",
border:"none",
padding:"12px 24px",
borderRadius:"10px",
fontWeight:"600",
cursor:"pointer"
},

sectionHeader:{
fontSize:"18px",
fontWeight:"600",
color:"#111827",
marginBottom:"18px",
marginTop:"10px"
},

divider:{
height:"1px",
background:"#f1f5f9",
margin:"30px 0"
},

statBarPurple:{
height:"4px",
width:"100%",
background:"#6366F1",
borderRadius:"10px",
marginBottom:"12px"
},

statBarGreen:{
height:"4px",
width:"100%",
background:"#10b981",
borderRadius:"10px",
marginBottom:"12px"
},

statBarOrange:{
height:"4px",
width:"100%",
background:"#f59e0b",
borderRadius:"10px",
marginBottom:"12px"
},

statsGrid:{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"20px",
marginBottom:"40px"
},

statCard:{
background:"white",
padding:"24px",
borderRadius:"14px",
boxShadow:"0 6px 18px rgba(0,0,0,0.06)",
display:"flex",
flexDirection:"column",
gap:"8px",
transition:"all 0.25s ease",
cursor:"pointer"
},

statHeader:{
display:"flex",
alignItems:"center",
gap:"8px"
},

statLabel:{
fontSize:"14px",
color:"#6b7280",
fontWeight:"500"
},

statNumber:{
fontSize:"34px",
fontWeight:"700",
color:"#111827"
},

statMeta:{
fontSize:"13px",
color:"#9ca3af"
},

statDotOpen:{
width:"10px",
height:"10px",
borderRadius:"50%",
background:"#6366F1"
},

statDotResolved:{
width:"10px",
height:"10px",
borderRadius:"50%",
background:"#10b981"
},

statDotHelpers:{
width:"10px",
height:"10px",
borderRadius:"50%",
background:"#f59e0b"
},

sectionTitle:{
marginBottom:"15px",
fontWeight:"600"
},

activityGrid:{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"25px"
},

requestList:{
background:"white",
borderRadius:"14px",
boxShadow:"0 8px 20px rgba(0,0,0,0.06)",
padding:"20px"
},

requestCard:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
background:"#f9fafb",
padding:"16px",
borderRadius:"12px",
marginBottom:"12px",
border:"1px solid #f1f5f9"
},

requestTitle:{
fontWeight:"600"
},

requestDesc:{
fontSize:"13px",
color:"#6b7280"
},

requestRight:{
display:"flex",
gap:"10px"
},

high:{
background:"#ef4444",
color:"white",
padding:"4px 10px",
borderRadius:"20px",
fontSize:"12px"
},

medium:{
background:"#f59e0b",
color:"white",
padding:"4px 10px",
borderRadius:"20px",
fontSize:"12px"
},

open:{
background:"#6366F1",
color:"white",
padding:"4px 10px",
borderRadius:"20px",
fontSize:"12px"
},

resolved:{
background:"#10b981",
color:"white",
padding:"4px 10px",
borderRadius:"20px",
fontSize:"12px"
},

mapPanel:{
background:"white",
padding:"20px",
borderRadius:"16px",
boxShadow:"0 10px 30px rgba(0,0,0,0.12)",
display:"flex",
flexDirection:"column",
gap:"12px"
},

mapHeader:{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
},

mapBadge:{
background:"#6366F1",
color:"white",
padding:"4px 10px",
borderRadius:"20px",
fontSize:"12px"
},

mapContainer:{
height:"420px",
borderRadius:"16px",
overflow:"hidden"
}

};

export default RequesterDashboard;