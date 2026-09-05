import pool from "../config/db.js";

export const crearServicioTercero = async (req, res) => {
  const {
    usuarios_idUsuarios,
    clientes_idClientes,
    tipo_servicio,
    monto_recibo,
    referencia_pago,
  } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [resultadoVenta] = await connection.query(
      `INSERT INTO ventas (usuarios_idUsuarios, clientes_idClientes, estado, total)
       VALUES (?, ?, 'completada', ?)`,
      [usuarios_idUsuarios, clientes_idClientes, monto_recibo],
    );

    const ventaId = resultadoVenta.insertId;

    await connection.query(
      `INSERT INTO detalle_ventas
       (ventas_idVentas, productos_idProductos, descripcion_manual, cantidad, precio_unitario, subtotal)
       VALUES (?, NULL, ?, 1, ?, ?)`,
      [
        ventaId,
        `Pago de servicio: ${tipo_servicio}`,
        monto_recibo,
        monto_recibo,
      ],
    );

    await connection.query(
      `INSERT INTO servicios_terceros
       (ventas_idVentas, tipo_servicio, monto_recibo, estado, referencia_pago)
       VALUES (?, ?, ?, 'pendiente', ?)`,
      [ventaId, tipo_servicio, monto_recibo, referencia_pago],
    );

    await connection.commit();

    res.status(201).json({
      mensaje:
        "Servicio registrado correctamente, pendiente de pago en plataforma",
      ventaId,
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      mensaje: "Error al registrar el servicio",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

export const completarServicioTercero = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [servicio] = await pool.query(
      "SELECT * FROM servicios_terceros WHERE idServicios_terceros = ?",
      [id],
    );

    if (servicio.length == 0) {
      return res.status(404).json({ mensaje: "Servicio inexistente" });
    }

    if (servicio[0].estado != "pendiente") {
      return res.status(400).json({ mensaje: "Servicio ya completado" });
    }

    await pool.query(
      `UPDATE servicios_terceros 
       SET estado = "completado", fecha_completado = NOW() 
       WHERE idServicios_terceros = ?`,
      [id],
    );

    res.status(200).json({ mensaje: "Servicio completado con éxito" });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al completar servicio",
      error: error.message,
    });
  }
};

export const obtenerServiciosPendientes = async (req, res) => {
  try {
    const [serviciosPendientes] = await pool.query(
      'SELECT * from servicios_terceros WHERE estado = "pendiente"',
    );
    res.json(serviciosPendientes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener servicios pendientes",
      error: error.message,
    });
  }
};
