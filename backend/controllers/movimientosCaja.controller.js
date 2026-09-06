import pool from "../config/db.js";

export const obtenerMovimientos = async (req, res) => {
  try {
    const [movimientos] = await pool.query("SELECT * FROM movimientos_caja");
    res.json(movimientos);
  } catch (error) {
    res.status(505).json({
      mensaje: "Error de conexión con el servidor",
      error: error.message,
    });
  }
};

export const obtenerMovimientoId = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [movimiento] = await pool.query(
      "SELECT * FROM movimientos_caja WHERE idMovimientos_caja = ?",
      [id],
    );

    if (movimiento.length === 0) {
      return res
        .status(404)
        .json({ mensaje: `No existe el movimiento con el id ${id}` });
    }

    const [denominaciones] = await pool.query(
      "SELECT * FROM detalle_denominaciones WHERE movimientos_caja_idMovimientos_caja = ?",
      [id],
    );

    res.json({ ...movimiento[0], denominaciones });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error de conexión con el servidor",
      error: error.message,
    });
  }
};

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
