import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RequesterDashboard from "./pages/RequesterDashboard";
import HelperDashboard from "./pages/HelperDashboard";
import CreateEmergency from "./pages/CreateEmergency";
import Requests from "./pages/Requests";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
return (

<Router>

<Routes>

<Route path="/" element={<Login />} />

<Route path="/register" element={<Register />} />

<Route path="/requester" element={<RequesterDashboard />} />

<Route path="/helper" element={<HelperDashboard />} />

<Route path="/create-emergency" element={<CreateEmergency />} />

<Route path="/requests" element={<Requests />} />

<Route path="/profile" element={<Profile />} />

<Route path="/admin" element={<AdminDashboard />} />

</Routes>

</Router>

);
}

export default App;