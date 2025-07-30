import { BrowserRouter as Router, Routes, Route } from "react-router";
//import { useNavigate } from "react-router";
import About from "./components/About";
import Navbar from "./components/NavBar";
import Charts from "./components/Charts";
import BleConnector from "./components/ConnectRobot";
import { SensorProvider } from "./context/SensorContext";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";


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

function HeroPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <motion.img
        src="/assets/output.png"
        alt="Airbot Logo"
        className="w-24 h-24 mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      />

      <motion.h1
        className="text-4xl font-bold mb-4 text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Bienvenido a <span className="text-primary">Airbot ID</span>
      </motion.h1>

      <motion.p
        className="text-lg text-muted-foreground max-w-xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Visualiza la calidad del aire en tiempo real con sensores inteligentes y gráficos interactivos.
      </motion.p>

      <motion.div
        className="flex gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Link
          to="/charts"
          className="px-6 py-3 bg-primary text-white rounded-xl shadow hover:bg-primary/90 transition"
        >
          Ver gráficos
        </Link>
        <Link
          to="/sobre"
          className="px-6 py-3 border border-primary text-primary rounded-xl hover:bg-primary/10 transition"
        >
          Sobre el proyecto
        </Link>
      </motion.div>
    </div>
  );
}


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
            <Route path="/" element={<HeroPage />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/connect" element={<BleConnector />} />
          </Routes>
        </main>
      </SensorProvider>
    </Router>
  );
}