import { useNavigate } from "react-router-dom";

function Navbar(){

const navigate = useNavigate();

const logout = () => {
localStorage.removeItem("token");
navigate("/");
};

return(

<div style={styles.navbar}>

<h2 style={styles.logo}>
Emergency<span style={{color:"#8B5CF6"}}>Connect</span>
</h2>

<div style={styles.links}>

<button onClick={()=>navigate("/requester")}>Dashboard</button>

<button onClick={logout}>Logout</button>

</div>

</div>

);

}

const styles = {

navbar:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"15px 40px",
background:"#111827",
color:"white",
boxShadow:"0 4px 10px rgba(0,0,0,0.4)"
},

logo:{
fontWeight:"600"
},

links:{
display:"flex",
gap:"15px"
}

};

export default Navbar;