# 📋 Sistema de Informes Semanales

Este proyecto es una aplicación web para gestionar y reportar informes semanales de líderes, coordinadores y diáconos. Permite registrar asistencia, ofrendas, nuevos discípulos y generar reportes automatizados para análisis y seguimiento.

---

## 🧰 Tecnologías Utilizadas

- ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=flat-square) **Node.js** – Backend
- ![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=flat-square) **Express** – Framework HTTP
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white&style=flat-square) **PostgreSQL** – Base de datos (usando Supabase)
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=flat-square) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat-square) **HTML + JS puro** – Frontend
- ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white&style=flat-square) **Supabase** – PostgreSQL + API

---

## 🚀 Instalación del Proyecto

### 🧱 Requisitos previos

- Node.js (v18+)
- PostgreSQL o cuenta en [Supabase](https://supabase.com/)
- Git

### 📥 Clonar el repositorio

```bash
git clone https://github.com/tu_usuario/informes-semanales.git
cd informes-semanales
npm install
```

### 📂 Estructura del Proyecto
```
/backend
  ├── db/
  │   └── connection.js
  ├── routes/
  │   ├── informes/
  │   │   ├── guardarInformes.js
  │   │   └── obtenerDatosInformes.js
  │   ├── lideres.js
  │   ├── subordinados.js
  │   └── superior.js
  └── server.js
/frontend
  ├── index.html
  ├── app.js
  └── estilos.css
.env
README.md
```

### 📡 Endpoints de la API
```
| Método | Ruta                           | Descripción                           |
| ------ | ------------------------------ | ------------------------------------- |
| GET    | `/api/lideres`                 | Obtener todos los líderes             |
| GET    | `/api/superior?id={id}`        | Obtener el superior de un miembro     |
| GET    | `/api/subordinados/{id}`       | Obtener los subordinados              |
| POST   | `/api/guardarInforme`          | Guardar un informe semanal            |
| GET    | `/api/obtenerInformes?id={id}` | Obtener informes por líder (opcional) |
```
### 📑 Licencia
```
MIT License © 2025 - Desarrollado por Isaias Castillo & Rolando Barahona
