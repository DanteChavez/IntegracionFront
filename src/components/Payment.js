import React from 'react';
import PayPalButton from './PayPalButton';

export default function Payment({ selectedMethod, disabled, loading, onCancel, onPaid, totalAmount, sessionId, userId }) {
  const handlePay = async () => {
    if (onPaid) {
      await onPaid();
    }
  };

  // Para PayPal, mostramos el botón especial de PayPal
  const isPayPal = selectedMethod === 'paypal';

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
        
        {/* Botón especial de PayPal */}
        {isPayPal && selectedMethod && !disabled && (
          <PayPalButton 
            amount={totalAmount}
            description="Compra en PulgaShop"
            sessionId={sessionId}
            userId={userId}
            onError={(error) => {
              console.error('Error en pago PayPal:', error);
            }}
          />
        )}
        
        {/* Botón normal para otros métodos */}
        {!isPayPal && selectedMethod && (
          <button 
            type="button" 
            className="btn primary" 
            onClick={handlePay} 
            disabled={disabled || loading}
          >
            {loading ? 'Procesando...' : 'Pagar ahora'}
          </button>
        )}
        
        {!selectedMethod && (
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
