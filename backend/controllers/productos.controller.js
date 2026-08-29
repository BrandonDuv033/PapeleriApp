let productos = [
  { id: 1, nombre: "Cuaderno 100 hojas", precio: 2000 },
  { id: 2, nombre: "Lapicero", precio: 1500 },
];

export const obtenerProductos = (req, res) => {
  res.json(productos);
};

export const crearProducto = (req, res) => {
  const nuevoProducto = {
    id: productos.length + 1,
    nombre: req.body.nombre,
    precio: req.body.precio,
  };

  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
};

export const actualizarProducto = (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  producto.nombre = req.body.nombre;
  producto.precio = req.body.precio;

  res.json(producto);
};

export const eliminarProducto = (req, res) => {
  const id = Number(req.params.id);
  const existe = productos.some((p) => p.id === id);

  if (!existe) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  productos = productos.filter((p) => p.id !== id);
  res.status(204).send();
};
