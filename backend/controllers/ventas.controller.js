import pool from "../config/db.js";

export const obtenerVentas = async (req, res) => {
  try {
    const [ventas] = await pool.query("SELECT * FROM ventas");
    res.json(ventas);
  } catch (error) {
    res
      .status(505)
      .json({ mensaje: "Error al obtener ventas", error: error.message });
  }
};

export const obtenerVentaID = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [resultado] = await pool.query(
      "SELECT * FROM ventas WHERE idVentas = ?",
      [id],
    );

    if (resultado.length === 0) {
      return res.status(404).json({ mensaje: "Venta inexistente" });
    }

    res.status(200).json(resultado[0]);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener venta", error: error.message });
  }
};

export const crearVenta = async (req, res) => {
  const { usuarios_idUsuarios, clientes_idClientes, detalle } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const total = detalle.reduce(
      (suma, linea) => suma + linea.cantidad * linea.precio_unitario,
      0,
    );

    const [resultadoVenta] = await connection.query(
      `INSERT INTO ventas (usuarios_idUsuarios, clientes_idClientes, estado, total)
       VALUES (?, ?, 'completada', ?)`,
      [usuarios_idUsuarios, clientes_idClientes, total],
    );

    const ventaId = resultadoVenta.insertId;

    for (const linea of detalle) {
      const subtotal = linea.cantidad * linea.precio_unitario;

      await connection.query(
        `INSERT INTO detalle_ventas
         (ventas_idVentas, productos_idProductos, descripcion_manual, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          ventaId,
          linea.productos_idProductos || null,
          linea.descripcion_manual || null,
          linea.cantidad,
          linea.precio_unitario,
          subtotal,
        ],
      );
    }

    await connection.commit();

    res
      .status(201)
      .json({ mensaje: "Venta creada correctamente", ventaId, total });
  } catch (error) {
    await connection.rollback();
    res
      .status(500)
      .json({ mensaje: "Error al crear la venta", error: error.message });
  } finally {
    connection.release();
  }
};

export const eliminarVenta = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [resultado] = await pool.query(
      "DELETE FROM ventas WHERE idVentas = ?",
      [id],
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }

    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar venta", eror: error.message });
  }
};
