import express from "express";
import productosRoutes from "./routes/productos.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import pagosRoutes from "./routes/pagos.routes.js";
import serviciosRoutes from "./routes/serviciosTerceros.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/productos", productosRoutes);
app.use("/ventas", ventasRoutes);
app.use("/clientes", clientesRoutes);
app.use("/pagos", pagosRoutes);
app.use("/servicios", serviciosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
