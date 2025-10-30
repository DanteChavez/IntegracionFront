import React, { useEffect, useState } from 'react';

function maskCard(num) {
  const raw = (num || '').replace(/\D/g, '');
  const last4 = raw.slice(-4);
  return last4 ? `**** **** **** ${last4}` : '';
}

export default function PaymentMethod({
  selectedMethod,
  setSelectedMethod,
  onCardStatusChange,
  onTransferStatusChange,
  failedAttempts,
  setFailedAttempts,
  paymentMethods = []
}) {
  const [fileName, setFileName] = useState('');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});

  const choose = (m) => {
    setSelectedMethod(m);
    // reset errores/estados sensibles al cambiar de método
    setErrors({});
    onCardStatusChange && onCardStatusChange({ valid: false, masked: '' });
    onTransferStatusChange && onTransferStatusChange({ fileName: '' });
    setFileName('');
  };

  // Validación tarjeta (CA11, CA12, CA13, CA16)
  useEffect(() => {
    if (selectedMethod !== 'stripe') return;
    const newErr = {};
    const onlyDigits = card.number.replace(/\D/g, '');

    // Validaciones básicas de formato (la validación Luhn se hace en el backend)
    if (!onlyDigits) {
      newErr.number = 'Número de tarjeta requerido.';
    } else if (!/^\d{13,19}$/.test(onlyDigits)) {
      newErr.number = 'Número de tarjeta debe tener entre 13 y 19 dígitos.';
    }

    if (!card.name.trim()) newErr.name = 'Nombre del titular requerido.';
    // expiry MM/YY y no en pasado
    const expMatch = card.expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!expMatch) {
      newErr.expiry = 'Usa MM/YY.';
    } else {
      const mm = parseInt(expMatch[1], 10);
      const yy = parseInt('20' + expMatch[2], 10);
      const now = new Date();
      const lastDay = new Date(yy, mm, 0); // último día del mes
      if (mm < 1 || mm > 12) newErr.expiry = 'Mes inválido.';
      else if (lastDay < now) newErr.expiry = 'Tarjeta vencida.';
    }
    if (!/^\d{3,4}$/.test(card.cvv)) newErr.cvv = 'CVV inválido (3-4 dígitos).';

    setErrors(newErr);
    const ok = Object.keys(newErr).length === 0;
    // usar onlyDigits para enmascarar correctamente aunque el usuario incluya espacios
    const cardData = ok ? {
      number: onlyDigits,
      name: card.name.trim(),
      expiry: card.expiry,
      cvv: card.cvv
    } : null;
    
    onCardStatusChange && onCardStatusChange({ 
      valid: ok, 
      masked: ok ? maskCard(onlyDigits) : '',
      cardData: cardData
    });
  }, [card, selectedMethod]); // Eliminamos onCardStatusChange de las dependencias

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setFileName(f ? f.name : '');
    onTransferStatusChange && onTransferStatusChange({ fileName: f ? f.name : '' });
  };



  return (
    <div className="panel">
      <h2>2. Elige tu método de pago</h2>

      {/* Opciones dinámicas desde backend */}
      <div className="method-grid" role="radiogroup" aria-label="Métodos de pago">
        {paymentMethods.map((method) => {
          if (!method.enabled) return null;
          
          const methodKey = method.provider.toLowerCase();
          const isSelected = selectedMethod === methodKey;
          
          return (
            <label key={method.provider} className={`method ${isSelected ? 'active' : ''}`}>
              <input
                type="radio"
                name="paymethod"
                checked={isSelected}
                onChange={() => choose(methodKey)}
              />
              <span className="icon">{method.logoUrl || '💳'}</span>
              <span>{method.displayName}</span>
            </label>
          );
        })}
      </div>

      {/* Form tarjeta (solo para Stripe) */}
      {selectedMethod === 'stripe' && (
        <div className="card-form">
          <div className="fg fg-full">
            <label htmlFor="cc-number">Número de tarjeta</label>
            <input
              id="cc-number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="**** **** **** ****"
              maxLength="19"
              value={card.number}
              onKeyDown={(e) => {
                const value = e.target.value;
                const cursorPos = e.target.selectionStart;
                
                // Si presiona Backspace y el cursor está después de un espacio
                if (e.key === 'Backspace' && value[cursorPos - 1] === ' ') {
                  e.preventDefault();
                  // Borra el espacio y el número anterior
                  const newValue = value.slice(0, cursorPos - 2) + value.slice(cursorPos);
                  const formatted = newValue.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                  setCard({ ...card, number: formatted });
                }
              }}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, ''); // Solo números
                
                // Formatear: agregar espacio cada 4 dígitos
                value = value.replace(/(\d{4})/g, '$1 ').trim();
                
                setCard({ ...card, number: value });
              }}
            />
            {errors.number && <span className="error">{errors.number}</span>}
          </div>

          <div className="fg fg-full">
            <label htmlFor="cc-name">Titular</label>
            <input
              id="cc-name"
              autoComplete="cc-name"
              placeholder="Como aparece en la tarjeta"
              value={card.name}
              onChange={(e) => setCard({ ...card, name: e.target.value })}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="row">
          <div className="row">
            <div className="fg">
              <label htmlFor="cc-exp">Vencimiento (MM/YY)</label>
              <input
                id="cc-exp"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                maxLength="5"
                value={card.expiry}
                onKeyDown={(e) => {
                  // Si presiona Backspace y el cursor está después del "/"
                  if (e.key === 'Backspace' && e.target.value.length === 3 && e.target.value.endsWith('/')) {
                    e.preventDefault();
                    setCard({ ...card, expiry: e.target.value.slice(0, -2) }); // Borra también el número antes del "/"
                  }
                }}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, ''); // Solo números
                  
                  // Formatear automáticamente: agregar "/" después de 2 dígitos
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                  }
                  
                  setCard({ ...card, expiry: value });
                }}
              />
              {errors.expiry && <span className="error">{errors.expiry}</span>}
            </div>
            <div className="fg">
              <label htmlFor="cc-cvv">CVV</label>
              <input
                id="cc-cvv"
                inputMode="numeric"
                autoComplete="off"
                placeholder="***"
                value={card.cvv}
                onChange={(e) => setCard({ ...card, cvv: e.target.value })}
              />
              {errors.cvv && <span className="error">{errors.cvv}</span>}
            </div>
          </div>
          <p className="hint">Mostramos solo los últimos 4 dígitos al confirmar (enmascarado).</p>
          {failedAttempts > 0 && <p className="hint attempts">Intentos fallidos: {failedAttempts}/3</p>}
        </div>
      </div>
      )}
    </div>
  );
}
