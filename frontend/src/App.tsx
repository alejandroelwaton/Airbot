import { BrowserRouter as Router, Routes, Route } from "react-router";
import Navbar from "./components/NavBar";
import Charts from "./components/Charts";
import { SensorProvider } from "./context/SensorContext";

function Inicio() {
  return <h1 className="text-4xl mt-8">Bienvenido a Robot ID</h1>;
}

function Sobre() {
  return <h1 className="text-4xl mt-8">Sobre este proyecto</h1>;
}

export default function App() {
  return (
    <Router>
      <SensorProvider>
        <Navbar />
        <main className="pt-24 p-8">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/sobre" element={<Sobre />} />
          </Routes>
        </main>
      </SensorProvider>
    </Router>
  );
}
