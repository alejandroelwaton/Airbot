import { motion } from "framer-motion";
import { Link } from "react-router";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center text-center px-4">
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
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex space-x-6">
                        <Link
                            to="/charts"
                            className="px-6 py-3 border border-border text-fg rounded-xl bg-background hover:scale-105 transition duration-300 ease-in-out transform flex items-center gap-2"
                        >
                            Ver gráficos
                        </Link>
                        <Link
                            to="/sobre"
                            className="px-6 py-3 border border-border text-fg rounded-xl bg-background hover:scale-105 transition duration-300 ease-in-out transform flex items-center gap-2"
                        >
                            Sobre el proyecto
                        </Link>
                    </div>
                    { <Link
                        to="/connect"
                        className="px-6 py-3 border border-border text-fg rounded-xl bg-background hover:scale-105 transition duration-300 ease-in-out transform flex items-center gap-2"
                    >
                        Conectar
                    </Link>}
                </div>
            </motion.div>
        </div>
    );
}
