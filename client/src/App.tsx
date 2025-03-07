// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Login from "./components/Auth/Login";
// import Register from "./components/Auth/Register";
// import UpdateProfile from "./components/Auth/UpdateProfile";
// import AuthCheck from "./hooks/AuthCheck";
// import GetMyProfile from "./components/Auth/GetMyProfile";
// import Logout from "./components/Auth/Logout";
// import GetProfile from "./components/Auth/GetProfile";
// function App() {
//   return (
//     <Router>
//       <AuthCheck />

//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/update" element={<UpdateProfile />} />
//         <Route path="/me" element={<GetMyProfile />} />
//         <Route path="/logout" element={<Logout />} />
//         <Route path="/:id" element={<GetProfile />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import UpdateProfile from "./components/Auth/UpdateProfile";
import AuthCheck from "./hooks/AuthCheck";
import GetMyProfile from "./components/Auth/GetMyProfile";
import Logout from "./components/Auth/Logout";
import GetProfile from "./components/Auth/GetProfile";
import PostsContainer from "./components/Posts/ProductPostDetails";
import PostsPage from "./pages/PostsPage";

function App() {
  return (
    <Router>
      <AuthCheck />

      <Routes>
        {/* Маршрути для аутентифікації */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/update" element={<UpdateProfile />} />
        <Route path="/me" element={<GetMyProfile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/:id" element={<GetProfile />} />

        {/* Маршрути для постів */}
        <Route path="/posts" element={<PostsPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
