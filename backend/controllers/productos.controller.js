import pool from "../config/db.js";

export const obtenerProductos = async (req, res) => {
  try {
    const [productos] = await pool.query("SELECT * FROM productos");
    res.json(productos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener productos", error: error.message });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const {
      nombre,
      categorias_idCategorias,
      precio_compra,
      precio_venta,
      controla_inventario,
      stock,
      stock_minimo,
    } = req.body;

    const [resultado] = await pool.query(
      `INSERT INTO productos (nombre, categorias_idCategorias, precio_compra, precio_venta, controla_inventario, stock, stock_minimo, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        nombre,
        categorias_idCategorias,
        precio_compra,
        precio_venta,
        controla_inventario,
        stock,
        stock_minimo,
      ],
    );

    res.status(201).json({ id: resultado.insertId, ...req.body });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear producto", error: error.message });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, precio_venta, stock } = req.body;

    const [resultado] = await pool.query(
      "UPDATE productos SET nombre = ?, precio_venta = ?, stock = ? WHERE idProductos = ?",
      [nombre, precio_venta, stock, id],
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json({ mensaje: "Producto actualizado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar producto", error: error.message });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [resultado] = await pool.query(
      "DELETE FROM productos WHERE idProductos = ?",
      [id],
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar producto", error: error.message });
  }
};

export const obtenerAlertasStock = async (req, res) => {
  try {
    const [productos] = await pool.query(
      "SELECT * FROM productos WHERE stock <= stock_minimo AND controla_inventario = 1 AND estado = 1",
    );

    if (productos.length === 0) {
      return res
        .status(200)
        .json({ mensaje: "No hay productos con stock bajo" });
    }
    res.status(200).json({ mensaje: "Productos con stock bajo", productos });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error de conexión con el servidor",
      error: error.message,
    });
  }
};
