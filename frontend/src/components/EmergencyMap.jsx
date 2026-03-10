import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function EmergencyMap({ emergencies }) {

return (

<MapContainer
center={[12.9716,77.5946]}
zoom={13}
style={{height:"400px",width:"100%"}}
>

<TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

{emergencies.map((e)=>{

const lat = e.location.coordinates[1];
const lng = e.location.coordinates[0];

return(

<Marker key={e._id} position={[lat,lng]}>

<Popup>

<b>{e.category}</b>
<br/>
{e.description}

</Popup>

</Marker>

);

})}

</MapContainer>

);

}

export default EmergencyMap;