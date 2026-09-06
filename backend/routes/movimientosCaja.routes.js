import { Router } from "express";
import {
  obtenerMovimientos,
  crearMovimientoCaja,
  obtenerMovimientoId,
} from "../controllers/movimientosCaja.controller.js";

const router = Router();

router.get("/", obtenerMovimientos);
router.post("/", crearMovimientoCaja);
router.get("/:id", obtenerMovimientoId);

export default router;
