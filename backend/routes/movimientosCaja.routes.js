import { Router } from "express";
import { crearMovimientoCaja } from "../controllers/movimientosCaja.controller.js";

const router = Router();

router.post("/", crearMovimientoCaja);

export default router;
