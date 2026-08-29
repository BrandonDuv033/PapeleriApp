import express from "express";
import productosRoutes from "./routes/productos.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/productos", productosRoutes);
app.use("/ventas", ventasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
