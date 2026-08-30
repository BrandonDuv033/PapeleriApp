import { Router } from "express";
import {
  crearPago,
  obtenerPagosPorVenta,
} from "../controllers/pagos.controller.js";

const router = Router();

router.get("/venta/:ventaId", obtenerPagosPorVenta);
router.post("/", crearPago);

export default router;
