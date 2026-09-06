import pool from "../config/db.js";

export const crearMovimientoCaja = async (req, res) => {
  const { usuarios_idUsuarios, tipo, denominaciones = [] } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (tipo === "ajuste" && denominaciones.length === 0) {
      throw new Error("No hay denominaciones");
    }

    const total = denominaciones.reduce((acumulado, item) => {
      return acumulado + item.denominacion * item.cantidad;
    }, 0);

    const [resultadoMovimiento] = await connection.query(
      "INSERT INTO movimientos_caja (usuarios_idUsuarios, tipo, total_efectivo) VALUES (? ,?, ?)",
      [usuarios_idUsuarios, tipo, total],
    );
    const idMovimiento = resultadoMovimiento.insertId;

    for (const item of denominaciones) {
      await connection.query(
        "INSERT INTO detalle_denominaciones (movimientos_caja_idMovimientos_caja, denominacion, tipo, cantidad) VALUES (?, ?, ?, ?)",
        [idMovimiento, item.denominacion, item.tipo, item.cantidad],
      );
    }

    await connection.commit();
    res.status(201).json({
      mensaje: "Movimiento registrado con exito",
      idMovimiento,
      total,
    });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ mensaje: error.message });
  } finally {
    connection.release();
  }
};
