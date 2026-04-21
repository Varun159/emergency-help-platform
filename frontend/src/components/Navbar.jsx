import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ toggleSidebar }) {

const navigate = useNavigate();
const location = useLocation();
const [profileOpen, setProfileOpen] = useState(false);

const logout = () => {
localStorage.removeItem("token");
navigate("/");
};

const isActive = (path) => location.pathname === path;

return (

<div style={styles.navbar}>

{/* LEFT SECTION */}

<div style={styles.leftSection}>

<div
style={styles.menuButton}
onClick={toggleSidebar}
>
☰
</div>

<h2
style={styles.logo}
onClick={()=>navigate("/requester")}
>
Emergency<span style={{color:"#a78bfa"}}>Connect</span>
</h2>

</div>

{/* NAV LINKS */}

<div style={styles.links}>

<span
style={{
...styles.link,
...(isActive("/requester") ? styles.activeLink : {})
}}
onClick={()=>navigate("/requester")}
>
Dashboard
</span>

<span
style={{
...styles.link,
...(isActive("/create-emergency") ? styles.activeLink : {})
}}
onClick={()=>navigate("/create-emergency")}
>
Create Request
</span>

{/*Requests*/}

<span
style={{
...styles.link,
...(isActive("/requests") ? styles.activeLink : {})
}}
onClick={()=>navigate("/requests")}
>
Requests
</span>

{/* HELP OTHERS */}

<span
style={styles.link}
onClick={()=>navigate("/helper")}
>
Help Others
</span>

{/* PROFILE */}

<div style={styles.profileBox}>

<div
style={styles.avatar}
onClick={()=>setProfileOpen(!profileOpen)}
>
V
</div>

{profileOpen && (

<div style={styles.dropdown}>

<button
style={styles.dropdownItem}
onClick={logout}
>
Logout
</button>

</div>

)}

</div>

</div>

</div>

);

}

const styles = {

navbar:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"16px 30px",
background:"linear-gradient(90deg, #0f172a, #1e293b)",
color:"white",
boxShadow:"0 6px 18px rgba(0,0,0,0.4)",
borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
},

leftSection:{
display:"flex",
alignItems:"center",
gap:"14px"
},

menuButton:{
fontSize:"22px",
cursor:"pointer"
},

logo:{
cursor:"pointer",
fontWeight:"700",
letterSpacing:"0.5px"
},

links:{
display:"flex",
alignItems:"center",
gap:"28px",
fontSize:"15px"
},

link:{
cursor:"pointer",
fontWeight:"600",
color:"#cbd5f5",
paddingBottom:"4px",
borderBottom:"2px solid transparent",
transition:"all 0.2s"
},

activeLink:{
color:"white",
borderBottom:"2px solid #a78bfa"
},

profileBox:{
position:"relative"
},

avatar:{
width:"36px",
height:"36px",
borderRadius:"50%",
background:"linear-gradient(90deg,#6366F1,#8B5CF6)",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontWeight:"600",
cursor:"pointer"
},

dropdown:{
position:"absolute",
top:"45px",
right:"0",
background:"#1e293b",
borderRadius:"10px",
boxShadow:"0 6px 20px rgba(0,0,0,0.4)",
padding:"10px",
minWidth:"140px",
border: "1px solid rgba(255, 255, 255, 0.1)",
zIndex: 1000
},

dropdownItem:{
background:"none",
border:"none",
cursor:"pointer",
padding:"10px 12px",
width:"100%",
textAlign:"left",
color: "#f8fafc",
borderRadius: "6px",
transition: "background 0.2s"
}

};

export default Navbar;