import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen px-8 py-12 max-w-4xl mx-auto text-foreground flex flex-col gap-12">
      
      {/* Primer texto - baja lento */}
      <motion.p
        className="text-lg md:text-xl font-medium"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0 }}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores beatae, provident labore sequi consectetur quasi, corrupti impedit esse eaque cum porro accusantium animi nostrum modi, illo suscipit consequatur! Quaerat, ex.
      </motion.p>

      {/* Segundo texto - baja lento después del primero */}
      <motion.p
        className="text-lg md:text-xl font-medium"
        initial={{ opacity: 0, x: -50, y: -30 }}  // sale desde la izquierda y arriba
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.5, delay: 1.6 }}
        >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi commodi quaerat ipsa voluptatem soluta. Laboriosam, placeat laudantium quibusdam optio veritatis consectetur esse eos alias officiis sit unde, iure id dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas quibusdam unde, ducimus aperiam saepe sit assumenda labore iste ullam, repellat maiores voluptatum, tenetur soluta! Omnis asperiores excepturi iste labore temporibus?
    </motion.p>

      {/* Dos imágenes que bajan un poco más rápido, en fila */}
      <motion.div
        className="flex flex-col md:flex-row gap-6 justify-center"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 3.2 }}
      >
        <img
          src="/assets/image1.png"
          alt="Descripción imagen 1"
          className="w-full md:w-1/2 rounded-lg object-cover"
        />
        <img
          src="/assets/image2.png"
          alt="Descripción imagen 2"
          className="w-full md:w-1/2 rounded-lg object-cover"
        />
      </motion.div>

      {/* Último texto rápido al centro */}
      <motion.p
        className="text-lg md:text-xl font-semibold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 4.5 }}
      >
        Aquí un texto final, resumen o llamado a la acción para cerrar la sección.
      </motion.p>

    </div>
  );
}
