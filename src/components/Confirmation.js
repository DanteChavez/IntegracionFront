import React from 'react';

export default function Confirmation({ selectedMethod, cardMasked, paymentMethods }) {
  // Encontrar el método de pago seleccionado en la lista de métodos disponibles
  const methodInfo = paymentMethods?.find(m => m.provider === selectedMethod);
  const methodName = methodInfo ? methodInfo.displayName : selectedMethod || '—';

  return (
    <div className="panel">
      <h2>3. Confirma tu pedido</h2>
      <div className="confirm-grid">
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
        <p className="hint">Revisa bien los datos antes de continuar.</p>
      </div>
    </div>
  );
}
