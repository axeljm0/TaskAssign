import React, { useState, useEffect } from 'react';
import { FiTrash2, FiEdit, FiCheck, FiPlus, FiSearch, FiX } from 'react-icons/fi';

const App = () => {
  // Estados
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', assignee: '', completed: false });
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtener tareas
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8000/tasks');
      if (!response.ok) throw new Error('Error al cargar tareas');
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar y buscar tareas
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'completed' && task.completed) || 
                         (filter === 'pending' && !task.completed);
    return matchesSearch && matchesFilter;
  });

  // Agregar tarea
  const handleAddTask = async () => {
    try {
      const response = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) throw new Error('Error al agregar tarea');
      fetchTasks();
      setNewTask({ name: '', assignee: '', completed: false });
      setIsModalOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // Editar tarea
  const handleEditTask = async () => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTask),
      });
      if (!response.ok) throw new Error('Error al editar tarea');
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      setError(error.message);
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar tarea');
      fetchTasks();
    } catch (error) {
      setError(error.message);
    }
  };

  // Completar tarea
  const handleCompleteTask = async (taskId, currentStatus) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskToUpdate,
          completed: !currentStatus
        }),
      });
      if (!response.ok) throw new Error('Error al actualizar tarea');
      fetchTasks();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="mx-auto max-w-md md:max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">TaskAssign Pro</h1>

        {/* Barra de búsqueda y filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar tareas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Completadas
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Pendientes
            </button>
          </div>
        </div>

        {/* Botón Agregar */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-6 w-full md:w-auto flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus /> Agregar Tarea
        </button>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
            <div className="flex items-center gap-2">
              <FiAlertTriangle className="text-red-500" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Lista de tareas */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredTasks.map(task => (
              <li 
                key={task.id} 
                className={`p-4 border rounded-lg flex justify-between items-center transition-all ${
                  task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  <p className="font-medium">{task.name}</p>
                  <p className="text-sm text-gray-600">Asignado a: {task.assignee}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCompleteTask(task.id, task.completed)}
                    className={`p-2 rounded-full transition-colors ${
                      task.completed 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <FiCheck />
                  </button>
                  <button
                    onClick={() => setEditingTask(task)}
                    className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Modal con blur claro */}
        {(isModalOpen || editingTask) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo blanco con blur - Cambio clave aquí */}
            <div 
              className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm"
              onClick={() => {
                setIsModalOpen(false);
                setEditingTask(null);
              }}
            />
            
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTask(null);
                }}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX className="text-gray-500" />
              </button>
              
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingTask ? editingTask.name : newTask.name}
                    onChange={(e) => 
                      editingTask 
                        ? setEditingTask({ ...editingTask, name: e.target.value })
                        : setNewTask({ ...newTask, name: e.target.value })
                    }
                    placeholder="Ej: Revisar informe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asignado a</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingTask ? editingTask.assignee : newTask.assignee}
                    onChange={(e) => 
                      editingTask 
                        ? setEditingTask({ ...editingTask, assignee: e.target.value })
                        : setNewTask({ ...newTask, assignee: e.target.value })
                    }
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={editingTask ? handleEditTask : handleAddTask}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {editingTask ? 'Guardar Cambios' : 'Agregar Tarea'}
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingTask(null);
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;