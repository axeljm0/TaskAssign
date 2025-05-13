# Technical test
# 📘 Documentación Técnica - TaskAssign Pro

**Fecha:** 2025-05-12  
**Tecnologías:** FastAPI · React · MongoDB · Tailwind CSS  
**Autor:** Axel Jiménez Martich

---

## 🧩 Descripción General

**TaskAssign Pro** es una aplicación fullstack para la gestión de tareas. Permite a los usuarios crear, editar, eliminar, completar y filtrar tareas. Está construida con FastAPI en el backend, React en el frontend, Tailwind CSS para el diseño, y MongoDB como base de datos, conectada mediante `motor` (async driver).

---

## 📦 Dependencias del Backend

El backend está construido con **FastAPI** y se conecta a **MongoDB** usando `motor` (cliente asíncrono).

### 📄 `requirements.txt`

```txt
fastapi==0.110.0
uvicorn==0.29.0
motor==3.3.2
bson==0.5.10
pydantic==2.6.4
```

> 💡 `typing` no se incluye porque es parte de Python 3.5+

### ⚙️ Instalación del backend

1. Crear y activar entorno virtual:

**Linux/macOS**
```bash
python -m venv venv
source venv/bin/activate
```

**Windows**
```bash
python -m venv venv
venv\Scripts\activate
```

2. Instalar dependencias:

```bash
pip install -r requirements.txt
```

3. Ejecutar el servidor:

```bash
uvicorn src.main:app --reload
```

Abrir: http://localhost:8000/docs para usar la API.

---

### 🔌 Conexión

Se conecta a una base de datos MongoDB (local o Docker). Usa `motor` para operaciones asincrónicas.

### 🧱 Modelos

- `Task`: nombre (`str`), asignado a (`str`), completado (`bool`, por defecto `False`).
- `TaskInDB`: hereda de `Task`, añade `id: str`.

### 🧪 Endpoints

| Método | Ruta                          | Descripción                         
|--------|-------------------------------|-------------------------------------
| GET    | `/tasks`                      | Obtiene todas las tareas            
| GET    | `/tasks/{task_id}`            | Obtiene una tarea por su ID         
| POST   | `/tasks`                      | Crea una nueva tarea                
| PUT    | `/tasks/{task_id}`            | Edita una tarea completa            
| DELETE | `/tasks/{task_id}`            | Elimina una tarea                   

> Los endpoints usan `ObjectId` como identificador, que se serializa como `id` para el frontend.

### ✔️ Validación de datos

La validación se realiza con **Pydantic**. Se asegura que todos los campos requeridos estén presentes y con el tipo correcto.

## 🐳 Base de datos MongoDB con Docker

La base de datos MongoDB se ejecuta usando Docker para facilitar la configuración local.  

### ▶️ Ejecutar

```bash
docker compose up -d

```
MongoDB estará disponible en `localhost:27017`.


## 🎨 Frontend (React + Tailwind)

### 🔍 Funcionalidades

- Mostrar lista de tareas (filtradas por estado y buscadas por texto).
- Crear nueva tarea desde un modal.
- Editar tarea con formulario emergente.
- Eliminar tarea.
- Marcar/desmarcar como completada.
- Feedback visual (loading, errores, colores, íconos).

### ⚛️ Componentes y Estados

- `tasks`: Lista global de tareas.
- `newTask`, `editingTask`: Formularios de creación y edición.
- `filter`, `searchTerm`: Búsqueda y filtrado.
- `isModalOpen`, `isLoading`, `error`: Control de UI y estado.

### 🎯 Interacción con el backend

- `fetch('http://localhost:8000/tasks')`: Carga inicial y recarga tras cambios.
- Todos los métodos (`POST`, `PUT`, `DELETE`) usan `fetch` con headers JSON.

### 🧪 Ejecución

```bash
npm install
npm run dev
```

Se ejecuta en: http://localhost:5173

---

## 💡 Mejoras con más tiempo

- Autenticación de usuarios.
- Comentarios o subtareas por cada ítem.
- Notificaciones (snackbars) con confirmaciones o errores.
- Paginación si hay muchas tareas.
- Pruebas unitarias (con `pytest` y `react-testing-library`).
- Almacenamiento de sesión o tareas en `localStorage` como respaldo offline.

---

## 📝 Conclusión

TaskAssign Pro es una solución fullstack solida y responsiva para la gestión de tareas. Enfocada, ademas en prácticas excelentes, un diseño limpio, y una clara división de responsabilidades entre el backend y el frontend. Disfruté mucho el desarrollo pues crear todo tipo de apps es mi pasión.


