import React, { useEffect, useState } from 'react';

export default function DataVerification({ userData, onValidityChange }) {

  const [form, setForm] = useState({
    name: '',
    surname: '',
    rut: '',
    email: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar datos desde userData proveniente de App.js
  useEffect(() => {
    if (!userData) return;

    setForm({
      name: userData.name || '',
      surname: userData.surname || '',
      rut: userData.rut || '',
      email: userData.email || '',
      address: userData.address || ''
    });

    // Validar inmediatamente
    const hasErrors =
      !userData.name?.trim() ||
      !userData.surname?.trim() ||
      !/^\S+@\S+\.\S+$/.test(userData.email) ||
      !userData.address?.trim();

    onValidityChange && onValidityChange(!hasErrors);

    setLoading(false);
  }, [userData, onValidityChange]);

  // Validaciones cuando cambia el formulario
  useEffect(() => {
    if (loading) return;

    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = 'Ingresa tu nombre.';
    if (!form.surname?.trim()) newErrors.surname = 'Ingresa tu apellido.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Correo inválido.';
    if (!form.address?.trim()) newErrors.address = 'Ingresa tu dirección.';

    setErrors(newErrors);
    onValidityChange && onValidityChange(Object.keys(newErrors).length === 0);
  }, [form, loading, onValidityChange]);

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
            readOnly disabled
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
        </div>

        <div className="fg">
          <label htmlFor="surname">Apellido</label>
          <input
            id="surname"
            name="surname"
            value={form.surname}
            onChange={handle}
            readOnly disabled
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
        </div>

        <div className="fg">
          <label htmlFor="rut">RUT</label>
          <input
            id="rut"
            name="rut"
            value={form.rut}
            onChange={handle}
            readOnly disabled
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
            readOnly disabled
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
        </div>

        <div className="fg fg-full">
          <label htmlFor="address">Dirección</label>
          <input
            id="address"
            name="address"
            value={form.address}
            onChange={handle}
            readOnly disabled
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
        </div>
      </div>
    </div>
  );
}
