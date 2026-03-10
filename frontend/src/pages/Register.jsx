import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import Toast from "../components/Toast";

function Register(){

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [phone,setPhone] = useState("");
const [role,setRole] = useState("requester");

const [toast,setToast] = useState(null);

const navigate = useNavigate();

/* helper function for toast */

const showToast = (message,type) => {

setToast({message,type});

setTimeout(()=>{
setToast(null);
},3000);

};

const handleRegister = async (e)=>{

e.preventDefault();

navigator.geolocation.getCurrentPosition(async (position)=>{

const latitude = position.coords.latitude;
const longitude = position.coords.longitude;

try{

await API.post("/auth/register",{
name,
email,
password,
phone,
role,
latitude,
longitude
});

showToast("Registration successful!","success");

setTimeout(()=>{
navigate("/");
},1200);

}catch(err){
showToast("Registration failed","error");
}

});

};

return(

<div style={styles.container}>
    {toast && <Toast message={toast.message} type={toast.type} />}

<div style={styles.header}>

<h1 style={styles.brand}>
Emergency<span style={{color:"#8B5CF6"}}>Connect</span>
</h1>

<p style={styles.subtitle}>
Join the community emergency network
</p>

<div style={styles.featureBox}>
<span>🚑 Connect with nearby helpers</span>
<span>⚡ Real-time emergency alerts</span>
<span>🤝 Support your local community</span>
</div>

</div>


<div
style={styles.card}
onMouseOver={(e)=>e.currentTarget.style.transform="translateY(-5px)"}
onMouseOut={(e)=>e.currentTarget.style.transform="translateY(0px)"}
>

<h2 style={styles.registerTitle}>
Create Your Account
</h2>

<p style={styles.registerSubtitle}>
Join the emergency support network
</p>

<div style={styles.roleInfo}>

<p>
<b>Requester</b> – Post emergency requests when you need help.
</p>

<p>
<b>Helper</b> – Receive alerts and assist people nearby.
</p>

</div>

<form onSubmit={handleRegister}>

<div style={styles.inputRow}>

<input
placeholder="Full Name"
onChange={(e)=>setName(e.target.value)}
style={styles.inputHalf}
onFocus={(e)=>e.target.style.border="1px solid #8B5CF6"}
onBlur={(e)=>e.target.style.border="1px solid #374151"}
/>

<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
style={styles.inputHalf}
onFocus={(e)=>e.target.style.border="1px solid #8B5CF6"}
onBlur={(e)=>e.target.style.border="1px solid #374151"}
/>

</div>


<div style={styles.inputRow}>

<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
style={styles.inputHalf}
onFocus={(e)=>e.target.style.border="1px solid #8B5CF6"}
onBlur={(e)=>e.target.style.border="1px solid #374151"}
/>

<input
placeholder="Phone Number"
onChange={(e)=>setPhone(e.target.value)}
style={styles.inputHalf}
onFocus={(e)=>e.target.style.border="1px solid #8B5CF6"}
onBlur={(e)=>e.target.style.border="1px solid #374151"}
/>

</div>


<div style={styles.roleSelector}>

<div
style={{
...styles.roleCard,
border: role === "requester" ? "2px solid #8B5CF6" : "1px solid #374151"
}}
onClick={()=>setRole("requester")}
>

<h4>Requester</h4>
<p>Request emergency help</p>

</div>


<div
style={{
...styles.roleCard,
border: role === "helper" ? "2px solid #8B5CF6" : "1px solid #374151"
}}
onClick={()=>setRole("helper")}
>

<h4>Helper</h4>
<p>Assist nearby emergencies</p>

</div>

</div>

<button
style={styles.button}
onMouseOver={(e)=>e.target.style.transform="translateY(-2px)"}
onMouseOut={(e)=>e.target.style.transform="translateY(0px)"}
>
Register
</button>

</form>

<p style={styles.loginLink}>
Already have an account? <Link to="/">Login</Link>
</p>

</div>

</div>

)

}

const styles = {

container:{
minHeight:"100vh",
background:"linear-gradient(135deg,#0f172a,#1e1b4b)",
color:"white",
display:"flex",
flexDirection:"column",
alignItems:"center",
paddingTop:"40px"
},

header:{
textAlign:"center",
marginBottom:"18px"
},

brand:{
fontSize:"42px",
fontWeight:"700",
marginBottom:"4px"
},

subtitle:{
fontSize:"17px",
color:"#cbd5f5",
marginBottom:"8px"
},

featureBox:{
display:"flex",
justifyContent:"center",
gap:"28px",
fontSize:"15px",
color:"#e2e8f0"
},

card:{
width:"520px",
padding:"28px",
borderRadius:"14px",
background:"#241f55ff",
boxShadow:"0 10px 40px rgba(0,0,0,0.5)",
transition:"all 0.3s ease"
},

registerTitle:{
marginBottom:"6px",
fontWeight:"600"
},

registerSubtitle:{
fontSize:"14px",
color:"#9ca3af",
marginBottom:"16px"
},

roleInfo:{
background:"#1f2937",
padding:"10px",
borderRadius:"8px",
fontSize:"13px",
lineHeight:"1.6",
marginBottom:"14px",
color:"#d1d5db"
},

inputRow:{
display:"flex",
gap:"10px",
marginBottom:"12px"
},

inputHalf:{
flex:1,
padding:"10px",
borderRadius:"8px",
border:"1px solid #374151",
background:"#1f2937",
color:"white",
outline:"none",
transition:"all 0.2s"
},

roleSelector:{
display:"flex",
gap:"10px",
marginBottom:"14px"
},

roleCard:{
flex:1,
padding:"10px",
borderRadius:"8px",
background:"#1f2937",
cursor:"pointer",
textAlign:"center",
fontSize:"13px"
},

button:{
width:"100%",
padding:"10px",
borderRadius:"8px",
border:"none",
background:"linear-gradient(90deg,#6366F1,#8B5CF6)",
color:"white",
fontWeight:"600",
cursor:"pointer",
transition:"all 0.25s ease",
boxShadow:"0 4px 12px rgba(139,92,246,0.3)"
},

loginLink:{
marginTop:"14px",
fontSize:"14px",
textAlign:"center"
}

};

export default Register;