# 📒 Papelería App

Sistema web de gestión / POS para una papelería, desarrollado como
proyecto de aprendizaje FullStack (React + Node.js + Express + MySQL).

> 🎓 Proyecto personal desarrollado como aprendiz de **Análisis y
> Desarrollo de Software (ADSO) - SENA**, con el objetivo principal
> de aprender desarrollo Backend y arquitectura FullStack construyendo
> un sistema real para la papelería en la que trabajo.

## 📌 Estado del proyecto

🚧 En desarrollo — módulo de ventas completo (crear con descuento y validación de stock, consultar, anular con devolución de stock). Próximo paso: módulo de clientes.

## ✨ Funcionalidades

- Gestión de productos e inventario (con control de stock opcional
  para servicios como fotocopias e impresiones)
- Registro de ventas, con soporte para productos de catálogo y
  productos manuales (precio variable)
- Historial de ventas por día, semana, mes y rango de fechas
- Gestión de clientes y ventas fiadas (crédito), con cálculo
  automático de deuda
- Registro de pagos y abonos parciales
- Control de caja con conteo de efectivo por denominación

## 🛠️ Stack tecnológico

| Capa                 | Tecnología                              |
| -------------------- | --------------------------------------- |
| Frontend             | React, JavaScript, HTML, CSS, Bootstrap |
| Backend              | Node.js, Express.js                     |
| Base de datos        | MySQL                                   |
| Control de versiones | Git / GitHub                            |

## 📁 Estructura del repositorio

```
papeleria-app/
│
├── frontend/         → Aplicación React
├── backend/          → API REST con Node.js + Express
├── database/         → Diagramas ER y scripts SQL
├── docs/             → Requisitos y documentación del proyecto
└── README.md
```

## 📄 Documentación

- [Requisitos y reglas del negocio](docs/requisitos.md)
- [Diagrama entidad-relación](database/diagrams)
- [Script de creación de base de datos](database/database.sql)

## 🎯 Objetivo de aprendizaje

Este proyecto no busca únicamente entregar una aplicación funcional,
sino servir como espacio de aprendizaje práctico para dominar:

- Diseño y normalización de bases de datos relacionales
- Construcción de una API REST con Node.js y Express
- Conexión entre Frontend (React) y Backend (Node.js)
- Autenticación y control de permisos por rol
- Despliegue de una aplicación FullStack completa
