# Requisitos y reglas del negocio — Sistema de gestión papelería

## 1. Objetivo del proyecto

Sistema web de gestión/POS para administrar la papelería, usado por
el personal encargado de atender y administrar el negocio. Además
del objetivo funcional, el proyecto tiene como fin aprender
desarrollo FullStack (React + Node.js + Express + MySQL + Git/GitHub).

## 2. Usuarios del sistema

- **Administrador**: gestiona productos, inventario, ventas, clientes,
  deudas, reportes y usuarios. Es el único que puede anular ventas.
- **Cajero**: registra ventas, consulta productos y clientes, registra
  pagos.

Nota: la autenticación real se implementa en una fase posterior. La
tabla de usuarios existe desde el inicio para poder asociar ventas y
movimientos de caja a quien los realiza.

## 3. Funcionalidades principales

- CRUD de productos (con categorías, control opcional de inventario)
- Control de inventario (descuento automático de stock en ventas)
- Alertas de stock mínimo (visual, no bloqueante)
- Registro de ventas (mixtas: productos de catálogo + líneas manuales)
- Historial de ventas por día, semana, mes y rango de fechas
- Gestión de clientes y ventas fiadas (crédito)
- Registro de pagos/abonos (parciales, método de pago dividido)
- Caja: conteo de efectivo por denominación (billete/moneda)

## 4. Reglas de negocio

### Ventas

- Una venta puede combinar productos de inventario y líneas manuales.
- Estados posibles: `completada`, `pendiente` (fiada), `anulada`.
- No se puede vender más cantidad de un producto que el stock disponible.
- Al anular una venta, el registro se conserva (no se borra) marcado
  como `anulada`, y el stock descontado se devuelve. Solo el
  administrador puede anular ventas.
- El método de pago puede dividirse entre varios medios (ej: parte
  efectivo, parte transferencia).

### Fiados / crédito

- En una venta fiada, el stock se descuenta de inmediato; la venta
  queda en estado `pendiente` hasta completar el pago.
- Una venta `pendiente` solo entra al reporte de ventas del día cuando
  pasa a `completada`, usando la fecha/hora en que se completó el
  pago (no la fecha original de la compra).
- Los abonos se aplican contra el total de la venta como bloque
  completo, no producto por producto.
- La deuda de un cliente no se almacena como dato: se calcula sumando
  el total de sus ventas `pendiente` menos la suma de sus pagos
  asociados.

### Inventario

- El stock mínimo es solo una alerta visual; no bloquea operaciones.
- Servicios de precio fijo y conocido (fotocopias, impresiones B/N,
  plastificado, etc.) se registran como productos del catálogo con
  `controla_inventario = false`, no como líneas manuales.
- Las líneas manuales (sin producto asociado) se reservan para casos
  de precio verdaderamente variable e impredecible (ej: impresión a
  color).

### Caja

- Conteo de efectivo por denominación (billete y moneda por separado,
  ya que existen ambas formas para algunos valores).
- El conteo puede hacerse al abrir y al cerrar caja; ninguno de los
  dos es obligatorio.
- El conteo puede actualizarse en cualquier momento del día para
  reflejar movimientos reales de efectivo.

## 5. Fuera de alcance para la v1 (dejado para v2)

- Códigos de barras / SKU
- Generación de PDF de recibos
- Reportes avanzados / dashboards con gráficos
- Roles más granulares (más allá de Administrador y Cajero)
- Autenticación (se deja para la Fase 11 del proyecto)
