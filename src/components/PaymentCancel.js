import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/PaymentResult.css';

/**
 * Componente de cancelación de pago de PayPal
 * HU4-CA6: Manejo de cancelación de pago
 */
function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="payment-result-container">
      <div className="payment-result-card cancel">
        <div className="icon cancel-icon">⚠</div>
        <h2>Pago cancelado</h2>
        <p>Has cancelado el proceso de pago con PayPal.</p>
        <p className="info-message">
          No se ha realizado ningún cargo a tu cuenta.
        </p>
        
        <div className="action-buttons">
          <button 
            onClick={() => navigate('/')} 
            className="btn secondary"
          >
            Volver al inicio
          </button>
          <button 
            onClick={() => navigate('/', { state: { retryPayment: true } })} 
            className="btn primary"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentCancel;
