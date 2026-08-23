-- Deshabilitar la verificación de llaves foráneas y cheques únicos temporalmente
SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------
-- Base de Datos: `papeleriapp`
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS `papeleriapp` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `papeleriapp`;

-- -----------------------------------------------------
-- Tabla: `categorias`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `categorias`;

CREATE TABLE `categorias` (
  `idCategorias` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la categoría',
  `nombre` VARCHAR(100) NOT NULL COMMENT 'Nombre de la categoría (ej: Papelería, Servicios de impresión)',
  PRIMARY KEY (`idCategorias`)
) ENGINE = InnoDB COMMENT = 'Categorías de los productos y servicios';

-- -----------------------------------------------------
-- Tabla: `productos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `productos`;

CREATE TABLE `productos` (
  `idProductos` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador único',
  `nombre` VARCHAR(150) NOT NULL COMMENT 'Nombre del producto/servicio (ej: Cuaderno 100 hojas, Fotocopia)',
  `categorias_idCategorias` INT NOT NULL COMMENT 'A qué categoría pertenece',
  `precio_compra` DECIMAL(10,2) NULL COMMENT 'Cuánto cuesta comprarlo/producirlo (puede no aplicar a servicios)',
  `precio_venta` DECIMAL(10,2) NOT NULL COMMENT 'Precio al que se vende',
  `controla_inventario` TINYINT(1) NOT NULL COMMENT '1 = tiene stock físico (cuaderno); 0 = servicio sin stock (fotocopia)',
  `stock` INT NOT NULL DEFAULT 0 COMMENT 'Cantidad disponible. Si controla_inventario es 0, no se usa',
  `stock_minimo` INT NOT NULL DEFAULT 0 COMMENT 'Umbral para la alerta visual de reabastecimiento',
  `estado` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = activo, 0 = descontinuado',
  PRIMARY KEY (`idProductos`),
  INDEX `idx_productos_categorias` (`categorias_idCategorias` ASC),
  CONSTRAINT `fk_productos_categorias`
    FOREIGN KEY (`categorias_idCategorias`)
    REFERENCES `categorias` (`idCategorias`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE
) ENGINE = InnoDB COMMENT = 'Catálogo de productos y servicios prestados';

-- -----------------------------------------------------
-- Tabla: `usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE `usuarios` (
  `idUsuarios` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador único',
  `nombre` VARCHAR(100) NOT NULL COMMENT 'Nombre de la persona',
  `rol` ENUM('Administrador', 'Cajero') NOT NULL COMMENT 'Define permisos futuros — administrador o cajero',
  `estado` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = Activo, 0 = Inactivo (conserva historial de ventas)',
  PRIMARY KEY (`idUsuarios`)
) ENGINE = InnoDB COMMENT = 'Usuarios/Operadores del sistema';

-- -----------------------------------------------------
-- Tabla: `clientes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `clientes`;

CREATE TABLE `clientes` (
  `idClientes` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador único',
  `nombre` VARCHAR(150) NOT NULL COMMENT 'Nombre completo',
  `telefono` VARCHAR(20) NULL COMMENT 'Contacto, útil para cobrar',
  `estado` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = Activo, 0 = Inactivo',
  `torre` VARCHAR(20) NULL COMMENT 'Torre donde reside el cliente (si aplica)',
  `apartamento` VARCHAR(20) NULL COMMENT 'Apartamento donde reside el cliente (si aplica)',
  PRIMARY KEY (`idClientes`)
) ENGINE = InnoDB COMMENT = 'Directorio de clientes para créditos o servicios';

-- -----------------------------------------------------
-- Tabla: `ventas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ventas`;

CREATE TABLE `ventas` (
  `idVentas` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador único',
  `usuarios_idUsuarios` INT NOT NULL COMMENT 'Quién registró la venta',
  `clientes_idClientes` INT NULL COMMENT 'Solo se llena si la venta fue fiada o tiene un cliente asociado. Contado sin cliente = NULL',
  `estado` ENUM('completada', 'pendiente', 'anulada') NOT NULL DEFAULT 'completada' COMMENT 'Estado de la transacción',
  `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Suma total de detalle_ventas',
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Momento original de la venta',
  `fecha_cierre` DATETIME NULL COMMENT 'Cuándo pasó a completada (si fue fiada)',
  PRIMARY KEY (`idVentas`),
  INDEX `idx_ventas_usuarios` (`usuarios_idUsuarios` ASC),
  INDEX `idx_ventas_clientes` (`clientes_idClientes` ASC),
  CONSTRAINT `fk_ventas_usuarios`
    FOREIGN KEY (`usuarios_idUsuarios`)
    REFERENCES `usuarios` (`idUsuarios`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ventas_clientes`
    FOREIGN KEY (`clientes_idClientes`)
    REFERENCES `clientes` (`idClientes`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE
) ENGINE = InnoDB COMMENT = 'Cabecera de transacciones de ventas';

-- -----------------------------------------------------
-- Tabla: `detalle_ventas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `detalle_ventas`;

CREATE TABLE `detalle_ventas` (
  `idDetalle_ventas` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador único',
  `ventas_idVentas` INT NOT NULL COMMENT 'A qué venta pertenece esta línea',
  `productos_idProductos` INT NULL COMMENT 'NULL para servicios/precios variables fuera de catálogo (ej: impresión a color)',
  `descripcion_manual` VARCHAR(150) NULL COMMENT 'Solo se llena cuando productos_idProductos es NULL',
  `cantidad` INT NOT NULL COMMENT 'Unidades vendidas de esta línea',
  `precio_unitario` DECIMAL(10,2) NOT NULL COMMENT 'Precio capturado al momento de la venta (histórico, no cambia si el producto cambia de precio)',
  `subtotal` DECIMAL(10,2) NOT NULL COMMENT 'cantidad * precio_unitario',
  PRIMARY KEY (`idDetalle_ventas`),
  INDEX `idx_detalle_ventas_ventas` (`ventas_idVentas` ASC),
  INDEX `idx_detalle_ventas_productos` (`productos_idProductos` ASC),
  CONSTRAINT `fk_detalle_ventas_ventas`
    FOREIGN KEY (`ventas_idVentas`)
    REFERENCES `ventas` (`idVentas`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_detalle_ventas_productos`
    FOREIGN KEY (`productos_idProductos`)
    REFERENCES `productos` (`idProductos`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE
) ENGINE = InnoDB COMMENT = 'Líneas/Detalles individualizados por venta';

-- -----------------------------------------------------
-- Tabla: `pagos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pagos`;

CREATE TABLE `pagos` (
  `idPagos` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador único',
  `ventas_idVentas` INT NOT NULL COMMENT 'A qué venta pertenece este pago/abono',
  `metodo_pago` ENUM('efectivo', 'transferencia', 'otro') NOT NULL COMMENT 'Medio usado en este pago específico',
  `monto` DECIMAL(10,2) NOT NULL COMMENT 'Monto registrado en este pago',
  `fecha` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha/hora del pago',
  PRIMARY KEY (`idPagos`),
  INDEX `idx_pagos_ventas` (`ventas_idVentas` ASC),
  CONSTRAINT `fk_pagos_ventas`
    FOREIGN KEY (`ventas_idVentas`)
    REFERENCES `ventas` (`idVentas`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB COMMENT = 'Abonos y pagos asociados a una venta (una venta puede tener cero o varios)';

-- -----------------------------------------------------
-- Tabla: `movimientos_caja`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `movimientos_caja`;

CREATE TABLE `movimientos_caja` (
  `idMovimientos_caja` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador único',
  `usuarios_idUsuarios` INT NOT NULL COMMENT 'Quién realizó el conteo',
  `tipo` ENUM('apertura', 'cierre', 'ajuste') NOT NULL COMMENT 'Tipo de conteo o arqueo',
  `fecha` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de ejecución del arqueo',
  `total_efectivo` DECIMAL(10,2) NOT NULL COMMENT 'Monto total, calculado a partir de detalle_denominaciones',
  PRIMARY KEY (`idMovimientos_caja`),
  INDEX `idx_movimientos_caja_usuarios` (`usuarios_idUsuarios` ASC),
  CONSTRAINT `fk_movimientos_caja_usuarios`
    FOREIGN KEY (`usuarios_idUsuarios`)
    REFERENCES `usuarios` (`idUsuarios`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE
) ENGINE = InnoDB COMMENT = 'Registro de arqueos y movimientos de caja';

-- -----------------------------------------------------
-- Tabla: `detalle_denominaciones`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `detalle_denominaciones`;

CREATE TABLE `detalle_denominaciones` (
  `idDetalle_denominaciones` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador único',
  `movimientos_caja_idMovimientos_caja` INT NOT NULL COMMENT 'Arqueo al que pertenece',
  `denominacion` INT NOT NULL COMMENT 'Valor nominal (ej: 2000, 50000, 200, 100)',
  `tipo` ENUM('billete', 'moneda') NOT NULL COMMENT 'Si esa denominación es billete o moneda (ej: $1.000 existe en ambas formas)',
  `cantidad` INT NOT NULL COMMENT 'Unidades contadas',
  PRIMARY KEY (`idDetalle_denominaciones`),
  INDEX `idx_detalle_denominaciones_movimientos_caja` (`movimientos_caja_idMovimientos_caja` ASC),
  CONSTRAINT `fk_detalle_denominaciones_movimientos_caja`
    FOREIGN KEY (`movimientos_caja_idMovimientos_caja`)
    REFERENCES `movimientos_caja` (`idMovimientos_caja`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB COMMENT = 'Desglose físico por billete/moneda en un arqueo de caja';

-- -----------------------------------------------------
-- Tabla: `servicios_terceros`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `servicios_terceros`;

CREATE TABLE `servicios_terceros` (
  `idServicios_terceros` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador único',
  `ventas_idVentas` INT NOT NULL COMMENT 'Venta en la que se recibió el dinero para este servicio',
  `tipo_servicio` ENUM('luz', 'agua', 'gas', 'internet', 'otro') NOT NULL COMMENT 'Qué servicio es',
  `monto_recibo` DECIMAL(10,2) NOT NULL COMMENT 'Valor exacto del recibo que dejó el cliente',
  `estado` ENUM('pendiente', 'completado') NOT NULL DEFAULT 'pendiente' COMMENT 'Si ya se pagó el servicio en la plataforma o sigue pendiente',
  `referencia_pago` VARCHAR(150) NOT NULL COMMENT 'Número de referencia del recibo, necesario para poder pagar el servicio en la plataforma',
  `comprobante_imagen` VARCHAR(255) NULL COMMENT 'Ruta/URL de la foto del comprobante que dejó el cliente',
  `fecha_completado` DATETIME NULL COMMENT 'Fecha/hora en que se confirmó que el servicio quedó pagado',
  PRIMARY KEY (`idServicios_terceros`),
  UNIQUE INDEX `ux_servicios_terceros_ventas` (`ventas_idVentas` ASC) COMMENT 'Garantiza que cada venta tenga como máximo un servicio asociado',
  CONSTRAINT `fk_servicios_terceros_ventas`
    FOREIGN KEY (`ventas_idVentas`)
    REFERENCES `ventas` (`idVentas`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB COMMENT = 'Recaudos y trámites de pago de recibos/servicios externos (luz, agua, gas, internet)';

-- Restaurar configuraciones originales
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;