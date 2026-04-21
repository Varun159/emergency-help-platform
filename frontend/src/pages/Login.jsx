import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import Toast from "../components/Toast";    
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);

const navigate = useNavigate();

const [toast,setToast] = useState(null);

/* helper function for toast */

const showToast = (message,type) => {

setToast({message,type});

setTimeout(()=>{
setToast(null);
},3000);

};

const handleLogin = async (e) => {

e.preventDefault();

try{

const res = await API.post("/auth/login",{ email,password });

localStorage.setItem("token",res.data.token);

const role = res.data.user.role;

if(role === "helper"){
navigate("/helper");
}else{
navigate("/requester");
}

}catch(err){
    setTimeout(()=>{
        navigate("/");
    },1200);
showToast("Invalid login credentials","error");
}

};

{toast && <Toast message={toast.message} type={toast.type} />}

return (

<div style={styles.container}>
    {toast && <Toast message={toast.message} type={toast.type} />}

<div style={styles.left}>

<h1 style={styles.brand}>
Emergency<span style={{color:"#8B5CF6"}}>Connect</span>
</h1>

<p style={styles.subtitle}>
Real-time community emergency support
</p>

<div style={styles.featureBox}>

<p>🚑 Find nearby helpers instantly</p>
<p>⚡ Real-time emergency alerts</p>
<p>🩸 Blood / medicine / transport support</p>

</div>

</div>


<div style={styles.right}>

<div
style={styles.card}
onMouseOver={(e)=>e.currentTarget.style.transform="translateY(-5px)"}
onMouseOut={(e)=>e.currentTarget.style.transform="translateY(0px)"}
>

<h2 style={styles.loginTitle}>Login</h2>

<form onSubmit={handleLogin}>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
style={styles.input}
onFocus={(e)=>e.target.style.border="1px solid #8B5CF6"}
onBlur={(e)=>e.target.style.border="1px solid #374151"}
/>

<div style={{ position: "relative", width: "100%" }}>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    style={styles.input}
    onFocus={(e)=>e.target.style.border="1px solid #8B5CF6"}
    onBlur={(e)=>e.target.style.border="1px solid #374151"}
  />
  <span 
    style={styles.eyeIcon} 
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

<button
style={styles.button}
onMouseOver={(e)=>e.target.style.transform="translateY(-2px)"}
onMouseOut={(e)=>e.target.style.transform="translateY(0px)"}
>
Login
</button>

</form>

<p style={styles.register}>
New user? <Link to="/register">Create account</Link>
</p>

</div>

</div>

</div>

)

}

const styles = {

container:{
display:"flex",
height:"100vh",
background:"linear-gradient(135deg, #0f172a, #111827)",
color:"white"
},

left:{
flex:1,
display:"flex",
flexDirection:"column",
justifyContent:"center",
padding:"80px"
},

brand:{
fontSize:"44px",
fontWeight:"700",
marginBottom:"10px"
},

subtitle:{
fontSize:"18px",
color:"#cbd5f5",
marginBottom:"40px"
},

featureBox:{
fontSize:"16px",
lineHeight:"2.2",
color:"#e2e8f0"
},

right:{
flex:1,
display:"flex",
alignItems:"center",
justifyContent:"center"
},

card:{
width:"360px",
padding:"40px",
borderRadius:"14px",
background:"#1e293b",
boxShadow:"0 20px 40px rgba(0,0,0,0.4)",
transition:"all 0.3s ease",
border: "1px solid rgba(255, 255, 255, 0.05)"
},

loginTitle:{
marginBottom:"20px",
fontWeight:"600"
},

input:{
width:"100%", // Changed from 90% to 100% since it's inside a relative container
padding:"12px",
paddingRight: "40px", // space for eye icon
marginBottom:"15px",
borderRadius:"8px",
border:"1px solid #374151",
background:"#1f2937",
color:"white",
outline:"none",
transition:"all 0.2s",
boxSizing: "border-box"
},

eyeIcon: {
position: "absolute",
right: "12px",
top: "14px",
cursor: "pointer",
color: "#9ca3af",
fontSize: "18px",
zIndex: 10
},

button:{
width:"90%",
padding:"12px",
borderRadius:"8px",
border:"none",
background:"linear-gradient(90deg,#6366F1,#8B5CF6)",
color:"white",
fontWeight:"600",
cursor:"pointer",
display: "block", // Ensures proper spacing
    margin: "0 auto",
    transition:"all 0.25s ease",
boxShadow:"0 4px 12px rgba(139,92,246,0.3)"
},

register:{
marginTop:"15px",
fontSize:"14px"
}

}

export default Login;