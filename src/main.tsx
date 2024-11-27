import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomerList } from './interfaces/components/CustomerList';
import { CustomerForm } from './interfaces/components/CustomerForm';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Ruta para la lista de clientes */}
        <Route path="/" element={<CustomerList />} />

        {/* Ruta para el formulario de creación */}
        <Route path="/customers/new" element={<CustomerForm />} />

        {/* Ruta para el formulario de actualización */}
        <Route path="/customers/edit/:id" element={<CustomerForm />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
