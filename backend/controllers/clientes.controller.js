import pool from "../config/db.js";

export const obtenerClientes = async (req, res) => {
  try {
    const [clientes] = await pool.query("SELECT * FROM clientes");
    res.json(clientes);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener cliente", error: error.message });
  }
};

export const obtenerClienteID = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [resultado] = await pool.query(
      "SELECT * FROM clientes WHERE idClientes = ?",
      [id],
    );

    if (resultado.length === 0) {
      return res.status(404).json({ mensaje: "Cliente no existe" });
    }

    res.status(200).json(resultado[0]);
  } catch (error) {
    res
      .status(505)
      .json({ mensaje: "Error al obtener usuario", error: error.message });
  }
};

export const crearCliente = async (req, res) => {
  try {
    const { nombre, telefono, torre, apartamento } = req.body;

    const [resultado] = await pool.query(
      "INSERT INTO clientes (nombre, telefono, torre, apartamento) VALUES (?, ?, ?, ?)",
      [nombre, telefono, torre, apartamento],
    );

    res
      .status(201)
      .json({ id: resultado.insertId, nombre, telefono, torre, apartamento });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear cliente", error: error.message });
  }
};

export const actualizarCliente = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { telefono, torre, apartamento } = req.body;

    const [resultado] = await pool.query(
      `UPDATE clientes SET telefono = COALESCE(?, telefono), torre = COALESCE(?, torre), apartamento = COALESCE(?, apartamento) WHERE idClientes = ?`,
      [telefono ?? null, torre ?? null, apartamento ?? null, id],
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    res.json({ mensaje: "Cliente actualizado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar cliente", error: error.message });
  }
};

export const desactivarCliente = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [resultado] = await pool.query(
      "UPDATE clientes SET estado = 0 WHERE idClientes = ?",
      [id],
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    res.status(200).json({ mensaje: "Cliente desactivado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al desactivar cliente", error: error.message });
  }
};
