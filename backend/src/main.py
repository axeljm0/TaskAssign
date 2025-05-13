from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API corriendo correctamente"}

MONGO_URL = "mongodb://localhost:27017"  # O la URL de tu contenedor Docker
DATABASE_NAME = "task_db"
COLLECTION_NAME = "tasks"

# Conexión a MongoDB
client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]
tasks_collection = db[COLLECTION_NAME]

# Modelos de datos para Pydantic (validación de datos)
class Task(BaseModel):
    name: str
    assignee: str
    completed: bool = False

class TaskInDB(Task):
    id: str

    class Config:
        # Hacer que los campos de MongoDB (_id) se serialicen a id
        json_encoders = {
            ObjectId: str
        }


# Función para convertir ObjectId a string
# Función para convertir _id de MongoDB a id
def task_serializer(task) -> dict:
    task["id"] = str(task["_id"])  # Cambia _id por id
    return task

# Ruta para obtener todas las tareas
@app.get("/tasks", response_model=List[TaskInDB])
async def get_tasks():
    tasks = []
    async for task in tasks_collection.find():
        tasks.append(task_serializer(task))
    return tasks

# Ruta para crear una tarea
@app.post("/tasks", response_model=TaskInDB)
async def create_task(task: Task):
    task_dict = task.dict()
    result = await tasks_collection.insert_one(task_dict)
    task_id = str(result.inserted_id)
    task = await tasks_collection.find_one({"_id": ObjectId(task_id)})
    return task_serializer(task)

# Ruta para obtener una tarea por ID
@app.get("/tasks/{task_id}", response_model=TaskInDB)
async def get_task_by_id(task_id: str):
    task = await tasks_collection.find_one({"_id": ObjectId(task_id)})
    if task:
        return task_serializer(task)
    return {"error": "Task not found"}

# Ruta para actualizar una tarea
@app.put("/tasks/{task_id}", response_model=TaskInDB)
async def update_task(task_id: str, task: Task):
    updated_task = {key: value for key, value in task.dict().items()}
    result = await tasks_collection.update_one(
        {"_id": ObjectId(task_id)}, {"$set": updated_task}
    )
    if result.matched_count:
        task = await tasks_collection.find_one({"_id": ObjectId(task_id)})
        return task_serializer(task)
    return {"error": "Task not found"}

# Ruta para eliminar una tarea
@app.delete("/tasks/{task_id}", response_model=TaskInDB)
async def delete_task(task_id: str):
    task = await tasks_collection.find_one({"_id": ObjectId(task_id)})
    if task:
        await tasks_collection.delete_one({"_id": ObjectId(task_id)})
        return task_serializer(task)
    return {"error": "Task not found"}

# Ruta para marcar una tarea como completada
@app.put("/tasks/{task_id}", response_model=TaskInDB)
async def update_task(task_id: str, task: Task):
    try:
        updated_task = {k: v for k, v in task.dict().items()}
        result = await tasks_collection.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": updated_task}
        )
        if result.matched_count:
            updated = await tasks_collection.find_one({"_id": ObjectId(task_id)})
            return task_serializer(updated)
        raise HTTPException(status_code=404, detail="Task not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


