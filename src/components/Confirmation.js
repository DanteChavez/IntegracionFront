import React from 'react';

export default function Confirmation({ selectedMethod, cardMasked, paymentMethods, userData, totalAmount }) {
  // Encontrar el método de pago seleccionado en la lista de métodos disponibles
  const methodInfo = paymentMethods?.find(m => m.provider === selectedMethod);
  const methodName = methodInfo ? methodInfo.displayName : selectedMethod || '—';

  return (
    <div className="panel">
      <h2>3. Confirma tu pedido</h2>
      <div className="confirm-grid">
        {/* Datos del usuario - mejora del compañero */}
        {userData && (
          <>
            <div className="line">
              <span>Nombre: </span>
              <strong>{userData.name} {userData.surname}</strong>
            </div>
            <div className="line">
              <span>Correo: </span>
              <strong>{userData.email}</strong>
            </div>
            <div className="line">
              <span>Dirección: </span>
              <strong>{userData.address}</strong>
            </div>
          </>
        )}
        
        <div className="line">
          <span>Método seleccionado: </span>
          <strong>
            {methodName}
          </strong>
        </div>
        {selectedMethod === 'stripe' && cardMasked && (
          <div className="line">
            <span>Tarjeta</span>
            <strong>{cardMasked}</strong>
          </div>
        )}
        
        {/* Monto final - mejora del compañero */}
        {totalAmount && (
          <div className="line">
            <span>Monto final: </span>
            <strong>${totalAmount.toLocaleString('es-CL')}</strong>
          </div>
        )}
        
        <p className="hint">Revisa bien los datos antes de continuar.</p>
      </div>
    </div>
  );
}
