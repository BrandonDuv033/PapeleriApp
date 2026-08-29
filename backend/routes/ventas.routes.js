import { Router } from "express";
import { obtenerVentas } from "../controllers/ventas.controller.js";

const router = Router();

router.get("/", obtenerVentas);

export default router;
