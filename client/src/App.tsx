import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import UpdateProfile from "./components/Auth/UpdateProfile";
import AuthCheck from "./hooks/AuthCheck";
import GetMyProfile from "./components/Auth/GetMyProfile";
import Logout from "./components/Auth/Logout";
import Profile from "./components/Auth/Profile";
function App() {
  return (
    <Router>
      <AuthCheck />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/update" element={<UpdateProfile />} />
        <Route path="/me" element={<GetMyProfile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/:id" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
