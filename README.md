# 📒 Papelería App

Sistema web de gestión / POS para una papelería, desarrollado como
proyecto de aprendizaje FullStack (React + Node.js + Express + MySQL).

> 🎓 Proyecto personal desarrollado como aprendiz de **Análisis y
> Desarrollo de Software (ADSO) - SENA**, con el objetivo principal
> de aprender desarrollo Backend y arquitectura FullStack construyendo
> un sistema real para la papelería en la que trabajo.

## 📌 Estado del proyecto

🚧 En desarrollo — módulos de productos, ventas y clientes completos y conectados a MySQL. Configurado ESLint para control de calidad de código. Próximo paso: pagos e inventario.

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

## 🧪 Calidad de código

Este proyecto usa **ESLint** para detectar errores mientras se programa.

Para tenerlo funcionando en tu editor:

1. Ejecuta `npm install` dentro de `backend/` (instala ESLint junto con las demás dependencias).
2. Instala la extensión **ESLint** de Microsoft en VS Code.

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
