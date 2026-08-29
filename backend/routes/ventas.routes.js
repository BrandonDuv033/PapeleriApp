import { Router } from "express";
import {
  obtenerVentas,
  obtenerVentaID,
  crearVenta,
  anularVenta,
} from "../controllers/ventas.controller.js";

const router = Router();

router.get("/", obtenerVentas);
router.get("/:id", obtenerVentaID);
router.post("/", crearVenta);
router.patch("/:id/anular", anularVenta);

export default router;
