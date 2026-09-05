import { Router } from "express";
import {
  crearServicioTercero,
  completarServicioTercero,
  obtenerServiciosPendientes,
} from "../controllers/serviciosTerceros.controller.js";

const router = Router();

router.post("/", crearServicioTercero);
router.patch("/:id/completar", completarServicioTercero);
router.get("/pendientes", obtenerServiciosPendientes);

