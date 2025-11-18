import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../style/PaymentResult.css';

/**
 * Componente de éxito de pago de PayPal
 * HU4-CA5: Confirmación de pago exitoso
 */
function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const executePayment = async () => {
      try {
        // Obtener parámetros de la URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const payerId = params.get('PayerID');
        
        // El orderId es el mismo que el token en PayPal
        const orderId = token;

        if (!orderId) {
          throw new Error('No se encontró el ID de orden de PayPal');
        }

        console.log('Solicitando ejecución de pago al backend:', { orderId, payerId });

        // El backend captura el pago usando PayPal SDK (con credenciales seguras)
        const response = await fetch('https://localhost:3000/api/paypal/execute-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            payerId,
            token,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al ejecutar el pago');
        }

        const data = await response.json();
        console.log('Pago ejecutado:', data);

        setPaymentData(data);
        setLoading(false);

        // Redirigir al resumen después de 5 segundos
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } catch (err) {
        console.error('Error ejecutando pago de PayPal:', err);
        setError(err.message || 'Error al procesar el pago');
        setLoading(false);
      }
    };

    executePayment();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="payment-result-container">
        <div className="payment-result-card loading">
          <div className="spinner"></div>
          <h2>Procesando tu pago...</h2>
          <p>Por favor espera mientras confirmamos tu transacción con PayPal.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-result-container">
        <div className="payment-result-card error">
          <div className="icon error-icon">✖</div>
          <h2>Error al procesar el pago</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn primary">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-result-container">
      <div className="payment-result-card success">
        <div className="icon success-icon">✓</div>
        <h2>¡Pago exitoso!</h2>
        <p>Tu pago con PayPal se ha procesado correctamente.</p>
        
        {paymentData && (
          <div className="payment-details">
            <div className="detail-row">
              <span className="label">ID de Transacción:</span>
              <span className="value">{paymentData.transactionId}</span>
            </div>
            <div className="detail-row">
              <span className="label">Monto:</span>
              <span className="value">
                ${(paymentData.amount / 100).toFixed(2)} {paymentData.currency}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Estado:</span>
              <span className="value status-completed">{paymentData.status}</span>
            </div>
            {paymentData.payerEmail && (
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{paymentData.payerEmail}</span>
              </div>
            )}
          </div>
        )}

        <p className="redirect-message">
          Serás redirigido al inicio en unos segundos...
        </p>
        
        <button onClick={() => navigate('/')} className="btn primary">
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
