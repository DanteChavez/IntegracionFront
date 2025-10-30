import React, { useEffect, useState } from 'react';
import apiService from '../services/api.service';

export default function DataVerification({ onValidityChange }) {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    rut: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar datos del usuario desde el backend
    const loadUserData = async () => {
      try {
        const userData = await apiService.getCurrentUser();
        setForm(userData);
        // Una vez cargados los datos, validar inmediatamente
        const hasErrors = !userData.name?.trim() || 
                         !userData.surname?.trim() || 
                         !/^\S+@\S+\.\S+$/.test(userData.email) || 
                         !userData.address?.trim();
        onValidityChange && onValidityChange(!hasErrors);
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
        setErrors({ general: 'No se pudieron cargar los datos del usuario' });
        onValidityChange && onValidityChange(false);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [onValidityChange]);

  useEffect(() => {
    if (loading) return;
    // Validación mínima para permitir avanzar (CA15)
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = 'Ingresa tu nombre.';
    if (!form.surname?.trim()) newErrors.surname = 'Ingresa tu apellido.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Correo inválido.';
    if (!form.address?.trim()) newErrors.address = 'Ingresa tu dirección.';
    setErrors(newErrors);
    onValidityChange && onValidityChange(Object.keys(newErrors).length === 0);
  }, [form, onValidityChange, loading]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (loading) {
    return (
      <div className="panel">
        <h2>1. Verifica tus datos</h2>
        <p>Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>1. Verifica tus datos</h2>
      <div className="form-grid">
        <div className="fg">
          <label htmlFor="name">Nombre</label>
          <input 
            id="name" 
            name="name" 
            value={form.name} 
            onChange={handle} 
            placeholder="Ej. Mario" 
            readOnly 
            disabled 
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="fg">
          <label htmlFor="surname">Apellido</label>
          <input 
            id="surname" 
            name="surname" 
            value={form.surname} 
            onChange={handle} 
            placeholder="Ej. Brito" 
            readOnly 
            disabled 
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
          {errors.surname && <span className="error">{errors.surname}</span>}
        </div>

        <div className="fg">
          <label htmlFor="rut">RUT</label>
          <input 
            id="rut" 
            name="rut" 
            value={form.rut} 
            onChange={handle} 
            placeholder="11.111.111-1" 
            readOnly 
            disabled 
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
        </div>

        <div className="fg">
          <label htmlFor="email">Correo</label>
          <input 
            id="email" 
            name="email" 
            value={form.email} 
            onChange={handle} 
            placeholder="correo@dominio.cl" 
            readOnly 
            disabled 
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="fg fg-full">
          <label htmlFor="address">Dirección</label>
          <input 
            id="address" 
            name="address" 
            value={form.address} 
            onChange={handle} 
            placeholder="Calle, número, comuna, país" 
            readOnly 
            disabled 
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>
      </div>
    </div>
  );
}
