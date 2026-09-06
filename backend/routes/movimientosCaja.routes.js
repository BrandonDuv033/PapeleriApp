import { Router } from "express";
import { crearMovimientoCaja } from "../controllers/movimientosCaja.controller.js";

const rout = Router();

rout.get("/", crearMovimientoCaja);
