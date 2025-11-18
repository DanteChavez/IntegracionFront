import React, { useState } from 'react';
import '../style/PayPalButton.css';

/**
 * Botón de pago de PayPal
 * HU4-CA2: Redirección a PayPal Sandbox
 * IMPORTANTE: Todo el procesamiento ocurre en el backend
 */
function PayPalButton({ amount, description, sessionId, userId, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);

  const handlePayPalPayment = async () => {
    try {
      setLoading(true);

      console.log('Solicitando creación de orden PayPal al backend');

      // El backend maneja TODA la lógica de PayPal (credenciales, SDK, etc.)
      const response = await fetch('https://localhost:3000/api/paypal/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'USD',
          sessionId: sessionId || `session_${Date.now()}`,
          userId: userId || 'anonymous',
          metadata: {
            description: description || 'Compra en PulgaShop',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el pago');
      }

      const data = await response.json();
      console.log('Backend retornó URL de aprobación de PayPal');

      // El backend ya procesó todo y nos dio la URL de PayPal
      if (!data.approvalUrl) {
        throw new Error('No se recibió la URL de aprobación de PayPal');
      }

      // Solo redirigimos al usuario a PayPal
      window.location.href = data.approvalUrl;
      
    } catch (error) {
      console.error('Error al solicitar pago de PayPal:', error);
      setLoading(false);
      
      if (onError) {
        onError(error);
      } else {
        alert('Error al procesar el pago con PayPal: ' + error.message);
      }
    }
  };

  return (
    <button
      className={`paypal-button ${loading ? 'loading' : ''}`}
      onClick={handlePayPalPayment}
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="spinner-small"></span>
          Procesando...
        </>
      ) : (
        <>
          <svg className="paypal-logo" viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg">
            <path fill="#003087" d="M12 4.917L4.7 24.333H8.316l1.338-3.942h5.224l1.338 3.942h3.616L12 4.917zm-1.588 11.925l1.588-4.65 1.588 4.65h-3.176z"/>
            <path fill="#009cde" d="M38.333 12.167c0-2.442-1.879-4.417-4.2-4.417h-6.3L25.467 20.5h3.5l.7-2.333h2.8c2.321 0 4.2-1.975 4.2-4.417 0-.7-.233-1.4-.7-1.983zm-6.533 2.333h-1.4l.7-2.333h1.4c.7 0 1.4.7 1.4 1.4s-.7 1.4-1.4 1.4z"/>
            <path fill="#012169" d="M56 12.167c0-2.442-1.879-4.417-4.2-4.417h-6.3L43.133 20.5h3.5l.7-2.333h2.8c2.321 0 4.2-1.975 4.2-4.417 0-.7-.233-1.4-.7-1.983zm-6.533 2.333h-1.4l.7-2.333h1.4c.7 0 1.4.7 1.4 1.4s-.7 1.4-1.4 1.4z"/>
          </svg>
          Pagar con PayPal
        </>
      )}
    </button>
  );
}

export default PayPalButton;
