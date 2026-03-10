import { useEffect, useState } from "react";
import API from "../api/axios";
import socket from "../sockets/socket";
import EmergencyMap from "../components/EmergencyMap";
import Navbar from "../components/Navbar";

function HelperDashboard(){

const [available,setAvailable] = useState(false);
const [emergencies,setEmergencies] = useState([]);


// listen for real-time emergencies
useEffect(()=>{

socket.on("newEmergency",(data)=>{

alert("🚨 New Emergency Received");

setEmergencies((prev)=>[data,...prev]);

});

// cleanup listener when component unmounts
return () => {
socket.off("newEmergency");
};

},[]);


// toggle availability
const toggleAvailability = async ()=>{

try{

const res = await API.patch("/helper/availability");

setAvailable(res.data.availability);

}catch(err){
alert("Error updating availability");
}

};


// accept emergency
const acceptEmergency = async (id)=>{

try{

await API.patch(`/emergency/accept/${id}`);

alert("Emergency accepted");

// remove accepted emergency from list
setEmergencies(prev => prev.filter(e => e._id !== id));

}catch(err){
alert("Error accepting request");
}

};

<>
<Navbar />
{/* rest of dashboard */}
</>

return(

<div>

<h2>Helper Dashboard</h2>

<button onClick={toggleAvailability}>
{available ? "Go Offline" : "Go Online"}
</button>

<EmergencyMap emergencies={emergencies} />

<h3>Nearby Emergencies</h3>

{emergencies.map((e)=>(

<div key={e._id} style={{border:"1px solid black",margin:"10px",padding:"10px"}}>

<p><b>Category:</b> {e.category}</p>

<p><b>Description:</b> {e.description}</p>

<p><b>Urgency:</b> {e.urgency_level}</p>

<button onClick={()=>acceptEmergency(e._id)}>
Accept Emergency
</button>

</div>

))}

</div>

);

}

export default HelperDashboard;