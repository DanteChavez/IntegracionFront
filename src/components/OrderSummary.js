import React, { useEffect, useState } from 'react';
import apiService from '../services/api.service';

export default function OrderSummary() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await apiService.getCart();
        setCartData(data);
      } catch (error) {
        console.error('Error cargando carrito:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCart();
  }, []);

  if (loading) {
    return (
      <div className="summary-card">
        <h3>Resumen del pedido</h3>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!cartData) {
    return (
      <div className="summary-card">
        <h3>Resumen del pedido</h3>
        <p>No se pudo cargar el carrito</p>
      </div>
    );
  }

  return (
    <div className="summary-card" aria-live="polite">
      <h3>Resumen del pedido</h3>
      <ul className="items">
        {cartData.items.map(item => (
          <li key={item.id}>
            <span>
              {item.name} {item.quantity > 1 && <span className="quantity">x{item.quantity}</span>}
            </span>
            <strong>{cartData.currency.symbol}{(item.price * item.quantity).toLocaleString('es-CL')}</strong>
          </li>
        ))}
      </ul>

      <div className="totals">
        <div>
          <span>Subtotal: </span>
          <strong>{cartData.currency.symbol}{cartData.subtotal.toLocaleString('es-CL')}</strong>
        </div>
        <div>
          <span>IVA ({cartData.iva.percentage}%): </span>
          <strong>{cartData.currency.symbol}{cartData.iva.amount.toLocaleString('es-CL')}</strong>
        </div>
        <div className="grand">
          <span>Total: </span>
          <strong>{cartData.currency.symbol}{cartData.total.toLocaleString('es-CL')}</strong>
        </div>
      </div>
    </div>
  );
}
