import pool from "../config/db.js";

export const crearMovimientoCaja = async (req, res) => {
  const { usuarios_idUsuarios, tipo, denominaciones } = req.body;
  const connection = await pool.getConnection(); // 1. reservo una conexión exclusiva

  try {
    await connection.beginTransaction(); // 2. abro el "borrador"

    if (tipo === "ajuste" && denominaciones.lenght === 0) {
      throw new Error("No hay denominaciones");
    }

    const total = denominaciones.reduce((acumulado, item) => {
      return acumulado + item.denominacion * item.cantidad;
    }, 0);
    // 4. INSERT del padre (movimientos_caja)
    const [resultadoMovimiento] = await connection.query(
      "INSERT INTO movimientos_caja usuarios_idUsuarios, tipo, total_efectivo VALUES ? ,?, ?",
      [usuarios_idUsuarios, tipo, total],
    );
    const idMovimiento = resultadoMovimiento.insertId;

    // 5. loop insertando los hijos (detalle_denominaciones), uno por uno
    for (const item of denominaciones) {
      await connection.query(
        "INSERT INTO detalle_denominaciones movimientos_caja_idMovimientos VALUES ?, ?",
        [idMovimiento, denominaciones, tipo, cantidad],
      );
    }

    await connection.commit();
    res.status(201).json({
      mensaje: "Movimiento registrado con exito",
      tipo,
      denominaciones,
    });
  } catch (error) {
    await connection.rollback(); // si algo falló en el try, deshago todo
    res.status(400).json({ mensaje: error.message });
  } finally {
    connection.release(); // pase lo que pase, suelto la conexión
  }
};
