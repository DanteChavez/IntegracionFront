import React from 'react';

export default function Confirmation({ selectedMethod, cardMasked, userData, totalAmount }) {
  return (
    <div className="panel">
      <h2>3. Confirma tu pedido</h2>
      <div className="confirm-grid">
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
        <div className="line">
          <span>Método seleccionado: </span>
          <strong>
            {selectedMethod === 'card' ? 'Tarjeta' :
             selectedMethod === 'transfer' ? 'Transferencia' :
             selectedMethod === 'webpay' ? 'Webpay' :
             selectedMethod === 'mercadopago' ? 'MercadoPago' : '—'}
          </strong>
        </div>
        {selectedMethod === 'card' && cardMasked && (
          <div className="line">
            <span>Tarjeta</span>
            <strong>{cardMasked}</strong>
          </div>
        )}
        <div className="line">
          <span>Monto final: </span>
          <strong>${totalAmount}</strong>
        </div>
        <p className="hint">Revisa bien los datos antes de continuar.</p>
      </div>
    </div>
  );
}
