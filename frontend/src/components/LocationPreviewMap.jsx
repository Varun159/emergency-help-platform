import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

const markerIcon = new L.Icon({
iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
iconSize: [32,32]
});

function LocationPreviewMap(){

const [position,setPosition] = useState(null);
const [locationName,setLocationName] = useState("");
const [helpers,setHelpers] = useState([]);

useEffect(()=>{

navigator.geolocation.getCurrentPosition(async (pos)=>{

const lat = pos.coords.latitude;
const lng = pos.coords.longitude;

setPosition([lat,lng]);

try{

const res = await fetch(
`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`
);

const data = await res.json();

setLocationName(data.display_name);

}catch(err){

console.log("Location lookup failed");

}

});

},[]);

useEffect(()=>{

const loadHelpers = async ()=>{

try{

const res = await fetch("http://localhost:8000/api/helper/nearby");

const data = await res.json();

setHelpers(data);

}catch(err){
console.log(err);
}

};

loadHelpers();

},[]);

const helperIcon = new L.Icon({
iconUrl:"https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
iconSize:[28,28]
});

if(!position) return <p>Detecting location...</p>;

return(

<div>

<div style={styles.locationHeader}>

<span style={styles.locationIcon}>📍</span>

<div>
<p style={styles.locationTitle}>Your location detected</p>
<p style={styles.locationText}>{locationName}</p>
</div>

</div>

<MapContainer
center={position}
zoom={14}
style={{height:"300px",width:"100%",borderRadius:"10px"}}
>

<TileLayer
url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
/>

<Marker position={position} icon={markerIcon}/>

{helpers.map((h)=>(
<Marker
key={h._id}
position={[
h.location.coordinates[1],
h.location.coordinates[0]
]}
icon={helperIcon}
>
</Marker>
))}

</MapContainer>

<p style={{marginTop:"10px",fontSize:"14px",color:"#6b7280"}}>
{helpers.length} helpers available nearby
</p>

</div>

);

}

const styles = {

locationHeader:{
display:"flex",
alignItems:"center",
gap:"10px",
marginBottom:"10px"
},

locationIcon:{
fontSize:"20px"
},

locationTitle:{
fontWeight:"600",
fontSize:"14px"
},

locationText:{
fontSize:"12px",
color:"#6b7280"
}

};

export default LocationPreviewMap;