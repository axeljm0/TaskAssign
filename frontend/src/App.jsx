import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiCheck } from 'react-icons/fi';

const App = () => {
  // Declaramos los estados
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setMessage(data.message);  // Asumiendo que el backend devuelve un campo 'message'
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-6">
          {isLoading ? (
            <div className="text-center p-4">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : error ? (
            <div>
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <FiAlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-center mb-2">Connection Error</h2>
              <div className="bg-red-50 p-3 rounded border border-red-100">
                <p className="text-red-600 text-center">{error}</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FiCheck className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-center mb-2">Successful Connection</h2>
              <div className="bg-green-50 p-3 rounded border border-green-100">
                <p className="text-green-600 text-center">{message}</p>
              </div>
              <div className="mt-4 flex gap-2">
                {/* Puedes añadir más elementos si es necesario */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App
