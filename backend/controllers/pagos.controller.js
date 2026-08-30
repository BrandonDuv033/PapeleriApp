import pool from "../config/db.js";

export const obtenerPagosPorVenta = async (req, res) => {
  try {
    const ventaId = Number(req.params.ventaId);

    const [ventaExistente] = await pool.query(
      "SELECT idVentas FROM ventas WHERE idVentas = ?",
      [ventaId],
    );

    if (ventaExistente.length === 0) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }

    const [pagos] = await pool.query(
      "SELECT * FROM pagos WHERE ventas_idVentas = ?",
      [ventaId],
    );

    res.status(200).json(pagos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener pagos", error: error.message });
  }
};

export const crearPago = async (req, res) => {
  const { ventas_idVentas, metodo_pago, monto } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [resultadonte] = await connection.query(
      "SELECT * FROM ventas WHERE idVentas = ?",
      [ventas_idVentas],
    );

    if (resultadonte.length === 0) {
      await connection.rollback();
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }

    const venta = resultadonte[0];

    if (venta.estado !== "pendiente") {
      await connection.rollback();
      return res.status(400).json({
        mensaje: `No se puede registrar un pago sobre una venta con estado "${venta.estado}"`,
      });
    }

    await connection.query(
      "INSERT INTO pagos (ventas_idVentas, metodo_pago, monto, fecha) VALUES (?, ?, ?, NOW())",
      [ventas_idVentas, metodo_pago, monto],
    );

    const [pagosVenta] = await connection.query(
      "SELECT SUM(monto) AS totalPagado FROM pagos WHERE ventas_idVentas = ?",
      [ventas_idVentas],
    );

    const totalPagado = pagosVenta[0].totalPagado;

    if (totalPagado >= venta.total) {
      await connection.query(
        "UPDATE ventas SET estado = 'completada', fecha_cierre = NOW() WHERE idVentas = ?",
        [ventas_idVentas],
      );
    }

    await connection.commit();

    res.status(201).json({
      mensaje: "Pago registrado correctamente",
      totalPagado,
      totalVenta: venta.total,
      ventaCompletada: totalPagado >= venta.total,
    });
  } catch (error) {
    await connection.rollback();
    res
      .status(500)
      .json({ mensaje: "Error al registrar el pago", error: error.message });
  } finally {
    connection.release();
  }
};
