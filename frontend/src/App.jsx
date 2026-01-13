import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateGig from "./pages/CreateGig";
import GigDetails from "./pages/GigDetails";
import MyGigs from "./pages/MyGigs";
import Hiring from "./pages/Hiring";


import SocketListener from "./socket/SocketListener";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <SocketListener />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/my-gigs" element={<MyGigs />} />
        <Route path="/create" element={<CreateGig />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gigs/:id" element={<GigDetails />} />
        <Route path="/hiring" element={<Hiring />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
