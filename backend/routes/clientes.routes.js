import { Router } from "express";
import {
  obtenerClientes,
  obtenerClienteID,
  crearCliente,
  actualizarCliente,
  desactivarCliente,
} from "../controllers/clientes.controller.js";

const router = Router();

router.get("/", obtenerClientes);
router.get("/:id", obtenerClienteID);
router.post("/", crearCliente);
router.put("/:id", actualizarCliente);
router.patch("/:id/desactivar", desactivarCliente);

export default router;
