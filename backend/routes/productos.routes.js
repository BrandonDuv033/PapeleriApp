import { Router } from "express";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerAlertasStock,
} from "../controllers/productos.controller.js";

const router = Router();


router.get("/", obtenerProductos);
router.post("/", crearProducto);
router.put("/:id", actualizarProducto);
router.delete("/:id", eliminarProducto);
router.get("/alertas-stock", obtenerAlertasStock)

export default router;
