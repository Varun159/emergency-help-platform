import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ open, close }){

const navigate = useNavigate();
const location = useLocation();

const isActive = (path) => location.pathname === path;

const items = [
{ label:"Dashboard", icon:"🏠", path:"/requester" },
{ label:"Create Request", icon:"🚨", path:"/create-emergency" },
{ label:"Requests", icon:"📋", path:"/requests" },
{ label:"Help Others", icon:"🤝", path:"/helper" },
{ label:"Profile", icon:"👤", path:"/profile" }
];

return(

<>

<div
style={{
...styles.sidebar,
transform: open ? "translateX(0)" : "translateX(-100%)"
}}
>

<h3 style={styles.title}>Menu</h3>

{items.map((item)=>(
<div
key={item.label}
onClick={()=>{
navigate(item.path);
close();
}}
style={{
...styles.link,
...(isActive(item.path) ? styles.active : {})
}}
>

<span>{item.icon}</span>

<span style={styles.label}>
{item.label}
</span>

{isActive(item.path) && <div style={styles.activeIndicator}></div>}

</div>
))}

</div>

{open && <div style={styles.overlay} onClick={close}></div>}

</>

);

}

const styles = {

sidebar:{
position:"fixed",
top:"0",
left:"0",
width:"240px",
height:"100%",
background:"#111827",
color:"white",
padding:"30px 20px",
transition:"transform 0.3s ease",
zIndex:"1000"
},

title:{
marginBottom:"30px",
fontWeight:"600"
},

link:{
display:"flex",
alignItems:"center",
gap:"12px",
padding:"12px",
marginBottom:"8px",
borderRadius:"8px",
cursor:"pointer",
color:"#cbd5f5",
position:"relative",
transition:"all 0.2s"
},

label:{
fontWeight:"500"
},

active:{
background:"#1f2937",
color:"white"
},

activeIndicator:{
position:"absolute",
left:"-20px",
height:"24px",
width:"4px",
background:"#8B5CF6",
borderRadius:"4px",
transition:"all 0.3s"
},

overlay:{
position:"fixed",
top:"0",
left:"0",
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.3)",
zIndex:"900"
}

};

export default Sidebar;