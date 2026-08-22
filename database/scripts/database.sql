SET FOREIGN_KEY_CHECKS = 0;

CREATE SCHEMA IF NOT EXISTS papeleriapp DEFAULT CHARACTER SET utf8mb4;
USE papeleriapp;

-- -----------------------------------------------------
-- 1. Tablas Independientes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    idCategorias INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
    idUsuarios INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    rol ENUM('Administrador', 'Cajero') NOT NULL,
    estado TINYINT NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes (
    idClientes INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NULL,
    estado TINYINT NOT NULL
);

-- -----------------------------------------------------
-- 2. Tablas Dependientes / Transaccionales
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
    idProductos INT AUTO_INCREMENT PRIMARY KEY,
    categorias_idCategorias INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    precio_compra DECIMAL(10,2) NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    controla_inventario TINYINT NOT NULL,
    stock INT NOT NULL,
    stock_minimo INT NOT NULL,
    estado TINYINT NOT NULL,
    FOREIGN KEY (categorias_idCategorias) REFERENCES categorias(idCategorias)
);

CREATE TABLE IF NOT EXISTS ventas (
    idVentas INT AUTO_INCREMENT PRIMARY KEY,
    usuarios_idUsuarios INT NOT NULL,
    clientes_idClientes INT NULL,
    estado ENUM('completada', 'pendiente', 'anulada') NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    fecha_creacion DATETIME NOT NULL,
    fecha_cierre DATETIME NULL,
    FOREIGN KEY (usuarios_idUsuarios) REFERENCES usuarios(idUsuarios),
    FOREIGN KEY (clientes_idClientes) REFERENCES clientes(idClientes)
);

CREATE TABLE IF NOT EXISTS detalle_ventas (
    idDetalle_ventas INT AUTO_INCREMENT PRIMARY KEY,
    ventas_idVentas INT NOT NULL,
    productos_idProductos INT NULL,
    descripcion_manual VARCHAR(150) NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (ventas_idVentas) REFERENCES ventas(idVentas),
    FOREIGN KEY (productos_idProductos) REFERENCES productos(idProductos)
);

CREATE TABLE IF NOT EXISTS pagos (
    idPagos INT AUTO_INCREMENT PRIMARY KEY,
    ventas_idVentas INT NOT NULL,
    metodo_pago ENUM('efectivo', 'transferencia', 'otro') NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha DATETIME NOT NULL,
    FOREIGN KEY (ventas_idVentas) REFERENCES ventas(idVentas)
);

CREATE TABLE IF NOT EXISTS movimientos_caja (
    idMovimientos_caja INT AUTO_INCREMENT PRIMARY KEY,
    usuarios_idUsuarios INT NOT NULL,
    tipo ENUM('apertura', 'cierre', 'ajuste') NOT NULL,
    fecha DATETIME NOT NULL,
    total_efectivo DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (usuarios_idUsuarios) REFERENCES usuarios(idUsuarios)
);

CREATE TABLE IF NOT EXISTS detalle_denominaciones (
    idDetalle_denominaciones INT AUTO_INCREMENT PRIMARY KEY,
    movimientos_caja_idMovimientos_caja INT NOT NULL,
    denominacion INT NOT NULL,
    tipo ENUM('billete', 'moneda') NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (movimientos_caja_idMovimientos_caja) REFERENCES movimientos_caja(idMovimientos_caja)
);

SET FOREIGN_KEY_CHECKS = 1;