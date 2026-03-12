import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import API from "../api/axios";

const bloodIcon = new L.Icon({
iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
iconSize: [32,32]
});

const transportIcon = new L.Icon({
iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
iconSize: [32,32]
});

const medicineIcon = new L.Icon({
iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
iconSize: [32,32]
});

function DashboardMap(){

const [emergencies,setEmergencies] = useState([]);

useEffect(()=>{

const loadEmergencies = async ()=>{

try{

const res = await API.get("/emergency/nearby");

setEmergencies(res.data);

}catch(err){

console.log(err);

}

};

loadEmergencies();

},[]);

const getIcon = (category)=>{

if(category==="blood") return bloodIcon;
if(category==="transport") return transportIcon;
if(category==="medicine") return medicineIcon;

return bloodIcon;

};

return(

<MapContainer
center={[12.9716,77.5946]}
zoom={13}
style={{height:"100%",width:"100%"}}
>

<TileLayer
url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
/>

{emergencies.map((e)=>(
<Marker
key={e._id}
position={[
e.location.coordinates[1],
e.location.coordinates[0]
]}
icon={getIcon(e.category)}
>

<Popup>

<div style={{minWidth:"180px"}}>

<h4 style={{marginBottom:"6px"}}>{e.category}</h4>

<p style={{fontSize:"13px",marginBottom:"6px"}}>
{e.description}
</p>

<span style={{
background:"#ef4444",
color:"white",
padding:"3px 8px",
borderRadius:"6px",
fontSize:"11px"
}}>
{e.urgency_level}
</span>

</div>

</Popup>

</Marker>
))}

</MapContainer>

);

}

export default DashboardMap;