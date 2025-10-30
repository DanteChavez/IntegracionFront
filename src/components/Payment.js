import React from 'react';

export default function Payment({ selectedMethod, disabled, loading, onCancel, onPaid }) {
  const handlePay = async () => {
    if (onPaid) {
      await onPaid();
    }
  };

  return (
    <div className="panel">
      <h2>4. Realiza tu pago</h2>
      <p className="hint">Al hacer clic en "Pagar ahora" se procesará el método seleccionado.</p>
      
      {loading && (
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '8px', 
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          <p>⏳ Procesando pago con el backend...</p>
        </div>
      )}
      
      <div className="nav-row">
        <button type="button" className="btn ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        {selectedMethod ? (
          <button 
            type="button" 
            className="btn primary" 
            onClick={handlePay} 
            disabled={disabled || loading}
          >
            {loading ? 'Procesando...' : 'Pagar ahora'}
          </button>
        ) : (
          <button type="button" className="btn primary" disabled aria-disabled="true">
            Selecciona un método
          </button>
        )}
      </div>
      {disabled && !loading && (
        <p className="error">No es posible pagar ahora (tiempo agotado o límite de intentos alcanzado).</p>
      )}
    </div>
  );
}
