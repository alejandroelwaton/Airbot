import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background px-8 py-3 flex justify-between items-center text-foreground">
      <div className="text-2xl font-bold">Airbot ID</div>
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
