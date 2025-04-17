import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TravelTool from "./pages/TravelTool";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/travel" element={<TravelTool />} />
      </Routes>
    </Router>
  );
}

export default App;