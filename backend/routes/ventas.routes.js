import { Router } from "express";
import {
  obtenerVentas,
  obtenerVentaID,
  crearVenta,
  eliminarVenta,
} from "../controllers/ventas.controller.js";

const router = Router();

router.get("/", obtenerVentas);
router.get("/:id", obtenerVentaID);
router.post("/", crearVenta);
router.delete("/:id", eliminarVenta);

export default router;
