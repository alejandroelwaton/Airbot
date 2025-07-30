import { BrowserRouter as Router, Routes, Route } from "react-router";
//import { useNavigate } from "react-router";
import About from "./components/About";
import Navbar from "./components/NavBar";
import Charts from "./components/Charts";
import BleConnector from "./components/ConnectRobot";
import Home from "./components/Home";
import { SensorProvider } from "./context/SensorContext";
import { useEffect } from "react";



// function ConectRobotButton() {
//   const navigate = useNavigate();

//   return (
//     <button
//       className="px-4 py-2 bg-blue-600 text-white rounded"
//       onClick={() => navigate('/connect')}
//     >
//       Ir a otra página
//     </button>
//   );
// }



export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <Router>
      <SensorProvider>
        <Navbar />
        <main className="pt-24 p-8 bg-background min-h-screen text-foreground">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/connect" element={<BleConnector />} />
          </Routes>
        </main>
      </SensorProvider>
    </Router>
  );
}