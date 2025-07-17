import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-1 border-gray-200 px-8 py-3 flex justify-between items-center ">
  <div className="text-2xl font-bold text-black">Robot ID</div>
  <div className="space-x-8">
    <Link to="/" className="text-text-black">Inicio</Link>
    <Link to="/charts" className="text-black">Charts</Link>
    <Link to="/sobre" className="text-black">Sobre</Link>
  </div>
</nav>

  );
}
