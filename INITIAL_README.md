# Technical test

Este repositorio contiene una base de proyecto fullstack construida con **FastAPI** para el backend y **React** para el frontend. Su propósito es servir como punto de partida para una prueba técnica, permitiendo al candidato demostrar habilidades en desarrollo de APIs, integración con base de datos, diseño de interfaces, y manejo de dependencias. Se incluyen instrucciones detalladas para levantar el entorno de desarrollo tanto del backend como del frontend.

---

# 🚀 Backend con FastAPI

La carpeta `backend` contiene la base de un backend construido con FastAPI.

## 📋 Requisitos previos

- Python instalado en tu sistema.

## ⚙️ Instalación

Accede a la carpeta del backend:

```bash
cd backend
```

Crea un entorno virtual:

**En Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

**En Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

Instala las dependencias necesarias, puede instalar tantas como considere necesario.:

```bash
pip install -r requirements.txt
```

> 💡 *Recuerda agregar cualquier dependencia adicional que instales al archivo `requirements.txt` para asegurar que el equipo revisor pueda ejecutar tu solución sin inconvenientes.*

---

## 🗃️ Base de datos local (MongoDB)

Para desarrollo local, puedes levantar una instancia de MongoDB usando Docker. El archivo `docker-compose.yml` ya está incluido en el proyecto.

## 📋 Requisitos previos

- Docker instalado en tu sistema.

### 🐳 Iniciar MongoDB con Docker

Desde la raíz del proyecto, ejecuta:

```bash
docker compose up -d
```

Esto iniciará un contenedor de MongoDB accesible en `localhost:27017`, con las siguientes credenciales:

- Usuario: `root`
- Contraseña: `rootpassword`

### 🧪 Verificar conexión desde el backend

Puedes probar que MongoDB está funcionando correctamente ejecutando el script `mongo_test.py` dentro del backend. Este script es solo para **fines de prueba**. Asegúrate de manejar adecuadamente las credenciales en tu solución.

```bash
python mongo_test.py
```

Si la conexión es exitosa, verás un mensaje como:

```
✅ Conexión exitosa: {'ok': 1.0}
```

---

## 🚀 Ejecutar el servidor

Desde la carpeta del backend:

```bash
uvicorn src.main:app --reload
```

Accede a la documentación interactiva en:  
http://localhost:8000/docs

## 📁 Estructura del proyecto

Puedes extenderla tanto como consideres necesario agregando routers, servicios, etc.

```bash
📂 backend
├── 📂 src
│   └── 📝 main.py       # Punto de entrada de la aplicación FastAPI
└── 📄 requirements.txt  # Dependencias del proyecto
```

---

# ⚛️ Frontend con React

La carpeta `frontend` contiene la base de un frontend desarrollado con React.

## 📋 Requisitos previos

- Node.js
- npm
- Tener corriendo la API de FastAPI en http://localhost:8000

## ⚙️ Instalación

Accede a la carpeta del frontend:

```bash
cd frontend
```

Instala las dependencias:

```bash
npm install
```

### 📦 Dependencias principales

- **React**: Librería para construir interfaces de usuario.
- **React Icons**: Conjunto de iconos populares como componentes React.
- **Tailwind CSS**: Framework CSS utility-first para estilizado rápido y personalizado.

## 🚀 Ejecutar la aplicación

```bash
npm run dev
```

La aplicación se ejecutará en http://localhost:5173 y se comunicará con tu API en http://localhost:8000.

## 📁 Estructura del proyecto

```bash
📂 frontend
├── 📂 src
│   ├── 📄 App.js        # Componente principal
│   ├── 📄 index.js      # Punto de entrada
│   ├── 📄 index.css     # Estilos globales con Tailwind
└── 📄 package.json      # Dependencias y scripts
```
