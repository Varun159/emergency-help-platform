import React from 'react';
import ReactDOM from 'react-dom/client';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'leaflet/dist/leaflet.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();


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