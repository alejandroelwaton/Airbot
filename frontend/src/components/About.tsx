import { motion } from "framer-motion";
import aImg from "../assets/a.jpg";
import bImg from "../assets/b.jpg"

import { Heart, Coffee } from "lucide-react";

function FooterNote() {
  return (
    <div className="text-center text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
      <span>Hecho con</span>
      <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
      <span>por</span>
      <span className="font-semibold text-foreground">Alejandro Sanchez</span>
      <Coffee className="w-4 h-4 text-amber-700" fill="currentColor" />
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen px-8 py-12 max-w-4xl mx-auto text-foreground flex flex-col gap-12">
       <motion.h1
        className="text-center text-lg md:text-xl font-bold"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0 }}
      > Airbot by ID Bright Robots
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl font-medium"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0 }}
      >
        AirBot es un robot desarrollado por estudiantes de 17 años con el objetivo de ayudar a las personas a conocer la calidad del aire que respiran. Surge de nuestra preocupación por el medio ambiente y el deseo de usar la tecnología para crear soluciones reales.
      </motion.p>

      <motion.p
        className="text-lg md:text-xl font-medium"
        initial={{ opacity: 0, x: -50, y: -30 }} 
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.5, delay: 5 }}
        >
        AirBot se mueve por diferentes lugares y, mientras lo hace, mide gases como el dióxido de carbono, monóxido de carbono, compuestos dañinos del aire, además de temperatura y humedad. Toda esa información puede verse en tiempo real desde una pantalla, una app móvil, o directamente en esta página web.

        El proyecto combina sensores, un microcontrolador (Arduino) y una computadora pequeña (Rock 3A) que trabaja con un sistema operativo especializado en robótica. Fue completamente diseñado, construido y programado por nosotros, enfrentando muchos desafíos, aprendiendo en el camino y disfrutando cada paso.
    </motion.p>

      <motion.div
        className="flex flex-col md:flex-row gap-6 justify-center"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 5.5 }}
      >
        <img
          src={aImg}
          alt="Descripción imagen 1"
          className="w-full md:w-1/2 rounded-lg object-cover"
        />
        <img
          src={bImg}
          alt="Descripción imagen 2"
          className="w-full md:w-1/2 rounded-lg object-cover"
        />
      </motion.div>

      <motion.p
        className="text-lg md:text-xl font-semibold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 8 }}
      >
        Nuestro objetivo es que AirBot no solo sea útil para medir el aire, sino que también sirva para inspirar a otros jóvenes a crear, experimentar y preocuparse por el futuro del planeta.
      </motion.p>
      <FooterNote></FooterNote>
      <div className="block text-sm text-muted-foreground text-center mt-2">
        Bright Bots © 2025
      </div>
    </div>
  );
}
