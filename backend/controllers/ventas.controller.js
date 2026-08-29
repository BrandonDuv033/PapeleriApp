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
      if (linea.productos_idProductos) {
        const [productoActual] = await connection.query(
          "SELECT stock, nombre FROM productos WHERE idProductos = ?",
          [linea.productos_idProductos],
        );

        if (productoActual.length === 0) {
          throw new Error(
            `El producto con id ${linea.productos_idProductos} no existe`,
          );
        }

        if (productoActual[0].stock < linea.cantidad) {
          throw new Error(
            `Stock insuficiente para "${productoActual[0].nombre}". Disponible: ${productoActual[0].stock}, solicitado: ${linea.cantidad}`,
          );
        }

        await connection.query(
          "UPDATE productos SET stock = stock - ? WHERE idProductos = ?",
          [linea.cantidad, linea.productos_idProductos],
        );
      }

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
      .status(400)
      .json({ mensaje: "Error al crear la venta", error: error.message });
  } finally {
    connection.release();
  }
};

export const anularVenta = async (req, res) => {
  const id = Number(req.params.id);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [ventaExistente] = await connection.query(
      "SELECT * FROM ventas WHERE idVentas = ?",
      [id],
    );

    if (ventaExistente.length === 0) {
      await connection.rollback();
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }

    if (ventaExistente[0].estado === "anulada") {
      await connection.rollback();
      return res.status(400).json({ mensaje: "Esta venta ya ha sido anulada" });
    }

    const [lineas] = await connection.query(
      "SELECT * FROM detalle_ventas WHERE ventas_idVentas = ?",
      [id],
    );

    for (const linea of lineas) {
      if (linea.productos_idProductos !== null) {
        await connection.query(
          "UPDATE productos SET stock = stock + ? WHERE idProductos = ?",
          [linea.cantidad, linea.productos_idProductos],
        );
      }
    }

    await connection.query(
      "UPDATE ventas SET estado = 'anulada' WHERE idVentas = ?",
      [id],
    );

    await connection.commit();

    res
      .status(200)
      .json({ mensaje: "Venta anulada correctamente, stock devuelto" });
  } catch (error) {
    await connection.rollback();
    res
      .status(500)
      .json({ mensaje: "Error al anular la venta", error: error.message });
  } finally {
    connection.release();
  }
};
