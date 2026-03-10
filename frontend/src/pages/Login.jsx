import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const navigate = useNavigate();

const handleLogin = async () => {

try {

const res = await API.post("/auth/login",{
email,
password
});

localStorage.setItem("token",res.data.token);

if(res.data.user.role === "helper"){
navigate("/helper");
}else{
navigate("/requester");
}

} catch(err){
alert("Login failed");
}

};

return (

<div>

<h2>Login</h2>

<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
placeholder="Password"
type="password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={handleLogin}>
Login
</button>

</div>

);

}

export default Login;