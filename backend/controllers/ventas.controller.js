let ventas = [
  {
    id: 1,
    total: 2000,
    estado: "completada",
  },
  {
    id: 2,
    total: 1000,
    estado: "cancelada",
  },
];

export const obtenerVentas = (req, res) => {
  res.json(ventas);
};
