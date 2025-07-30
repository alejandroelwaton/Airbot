import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b rounded-md bg-background px-2 py-3 flex justify-between items-center text-foreground">
      
      {/* Logo + Nombre */}
      <div className="flex items-center space-x-2">
        <img src="/assets/output.png" alt="Airbot Logo" className="w-8 h-8 object-contain sm:w-6 sm:h-6"/>
        <span className="text-2xl font-bold">Airbot ID</span>
      </div>

      {/* Navegación */}
      <div className="space-x-8">
        <Link to="/" className="text-foreground hover:text-primary">
          Inicio
        </Link>
        <Link to="/charts" className="text-foreground hover:text-primary">
          Charts
        </Link>
        <Link to="/sobre" className="text-foreground hover:text-primary">
          Sobre
        </Link>
      </div>
    </nav>
  );
}