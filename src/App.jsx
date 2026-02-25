import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "./components/Auth";
import MessManager from "./components/MessManager";

function App() {
  // Check if user is logged in
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  console.log("App - Is authenticated:", isAuthenticated);

  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />}
        />

        {/* Dashboard page */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <MessManager /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
