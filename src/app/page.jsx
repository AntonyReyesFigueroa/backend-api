'use client';
import React, { useState } from 'react';

export default function Page() {
  const [selectedDate, setSelectedDate] = useState('');
  const [displayedDate, setDisplayedDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisplayedDate(selectedDate);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Selecciona una fecha</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-md"
      >
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Enviar
        </button>
      </form>
      {displayedDate && (
        <h1 className="mt-6 text-xl font-semibold text-gray-700">
          Fecha seleccionada: {displayedDate}
        </h1>
      )}
    </div>
  );
}
