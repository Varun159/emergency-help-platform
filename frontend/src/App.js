import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RequesterDashboard from "./pages/RequesterDashboard";
import HelperDashboard from "./pages/HelperDashboard";

function App() {
return (

<Router>

<Routes>

<Route path="/" element={<Login />} />

<Route path="/register" element={<Register />} />

<Route path="/requester" element={<RequesterDashboard />} />

<Route path="/helper" element={<HelperDashboard />} />

</Routes>

</Router>

);
}

export default App;