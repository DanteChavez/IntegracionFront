import React from 'react';

export default function PaymentSuccess() {
  return (
    <div className="panel">
      <h2>¡Pago Exitoso!</h2>
      <p>Tu pago ha sido procesado correctamente. ¡Gracias por tu compra!</p>
      <p>Te hemos enviado un correo de confirmación con los detalles de tu pedido.</p>
      <button onClick={() => window.location.href = "/"} className="btn primary">Volver al inicio</button>
    </div>
  );
}
