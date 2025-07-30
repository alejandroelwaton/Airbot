import TempChart from "./TempChart";
import HumChart from "./HumidityChart";
import CO2Chart from "./CO2Chart";
import Card from "./Card";
import Contaminants from "./Contaminants";
import { motion } from "framer-motion";

export default function Charts() {
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <div className="content-center">
        <h2 className="text-center text-foreground text-2xl font-bold mb-4">Dashboard</h2>
      </div>

      <motion.div
        className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={item}>
          <Card title="Temperatura">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <TempChart />
            </motion.div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card title="Humedad">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <HumChart />
            </motion.div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card title="Combustibles contaminantes volatiles">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CO2Chart />
            </motion.div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card title="Gases Contaminantes">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Contaminants />
            </motion.div>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
}
