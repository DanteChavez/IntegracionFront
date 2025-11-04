import React, { useEffect , useState, useMemo } from 'react';
import DataVerification from './components/DataVerification';
import PaymentMethod from './components/PaymentMethod';
import Confirmation from './components/Confirmation';
import Payment from './components/Payment';
import OrderSummary from './components/OrderSummary';
import PaymentSuccess from './components/PaymentSuccess'; // Importar el componente de éxito


function App() {
  // Carrito en estado global para que aparezca en todas las pestañas
  const [products] = useState([
    { id: 1, name: 'Audífonos Pro', price: 29990 },
    { id: 2, name: 'Mouse Inalámbrico', price: 14990 },
    { id: 3, name: 'Teclado Mecánico', price: 49990 },
  ]);
  const taxRate = 0.19;   // IVA 19%
  const discount = 0;      // Ejemplo: podrías aplicar cupones más adelante

  const subtotal = useMemo(
    () => products.reduce((acc, p) => acc + p.price, 0),
    [products]
  );
  const taxes = useMemo(() => Math.round(subtotal * taxRate), [subtotal]);
  const totalAmount = useMemo(() => subtotal + taxes - discount, [subtotal, taxes, discount]);

  // Flujo por pasos
  const [step, setStep] = useState(1);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false); // Estado para controlar el éxito del pago
  // Seguridad / validaciones de método
  const [selectedMethod, setSelectedMethod] = useState(null); // 'card' | 'transferencia' | 'webpay' | 'mercadopago'
  const [cardStatus, setCardStatus] = useState({ valid: false, masked: '' });
  const [transferStatus, setTransferStatus] = useState({ fileName: '' });
  const [dataValid, setDataValid] = useState(false);

  // Límite de intentos fallidos (CA Seguridad)
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Temporizador (IU1-CA2). 10 minutos = 600 s
  const [timeLeft, setTimeLeft] = useState(600);
  useEffect(() => {
    const t = setInterval(() => setTimeLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const timeExpired = timeLeft === 0;

const handlePaymentSuccess = () => {
    setIsPaymentSuccessful(true); // Cambiar el estado cuando el pago es exitoso
  };

  // “No avanzar hasta validación exitosa” (CA15) por paso
  const canProceed = useMemo(() => {
    if (timeExpired || failedAttempts >= 3) return false;

    if (step === 1) 
        return dataValid;
    if (step === 2) {
      if (selectedMethod === 'card') 
          return cardStatus.valid;
      if (selectedMethod === 'transfer') 
          return Boolean(transferStatus.fileName);
      // Pasarelas externas: basta con selección
      if (selectedMethod === 'webpay' || selectedMethod === 'mercadopago') return true;
      return false;
    }
    if (step === 3) return true; // Confirmación visual
    if (step === 4) return true; // Botón pagar controla estados
    return false;
  }, [step, dataValid, selectedMethod, cardStatus.valid, transferStatus.fileName, timeExpired, failedAttempts]);


  const nextStep = () => setStep((s) => Math.min(4, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));
  const cancelFlow = () => {
    // Limpieza de datos sensibles (no persistimos nada en almacenamiento)
    setSelectedMethod(null);
    setCardStatus({ valid: false, masked: '' });
    setTransferStatus({ fileName: '' });
    setFailedAttempts(0);
    setStep(1);
  };

  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  return (
    <div className="app-shell">
      {/* Header con logo, candado/https y botón cancelar (CA4/CA6) */}
      <header className="pay-header">
        <div className="brand">
          <img src={`${process.env.PUBLIC_URL}/assets/images/logo.svg`} alt="PulgaShop" />
          <div className="secure-pill" aria-live="polite">
            <span className="lock" aria-hidden>🔒</span>
            {isSecure ? 'Conexión segura (HTTPS)' : 'Conexión no segura'}
          </div>
        </div>

        <div className="header-actions">
          <button type="button" className="btn ghost" onClick={cancelFlow}>Cancelar</button>
        </div>
      </header>

      {/* Stepper y temporizador */}
      <div className="topbar">
        <ol className="stepper" aria-label="Pasos de pago">
          <li className={step >= 1 ? 'done' : ''}><span>1</span> Datos</li>
          <li className={step >= 2 ? 'done' : ''}><span>2</span> Método</li>
          <li className={step >= 3 ? 'done' : ''}><span>3</span> Confirmación</li>
          <li className={step >= 4 ? 'done' : ''}><span>4</span> Pago</li>
        </ol>
        <div className={`timer ${timeExpired ? 'expired' : ''}`} aria-live="polite">
          {(() => {
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
            return timeExpired ? 'Tiempo agotado' : `Tiempo restante: ${m}:${s}`;
          })()}
        </div>
      </div>

      {isPaymentSuccessful ? (
        <PaymentSuccess />
      ) : (
        /* Layout principal: contenido + resumen persistente */
        <main className="pay-layout">
          <section
            className="pay-content"
            // Hacemos que los hijos puedan reordenarse visualmente para colocar el footer
            // después de los botones "Anterior / Siguiente" aunque en el DOM esté antes.
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {step === 1 && (
              <DataVerification
          onValidityChange={setDataValid}
              />
            )}

            {step === 2 && (
              <PaymentMethod
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          onCardStatusChange={(st) => setCardStatus(st)}
          onTransferStatusChange={(st) => setTransferStatus(st)}
          failedAttempts={failedAttempts}
          setFailedAttempts={setFailedAttempts}
              />
            )}

            {step === 3 && (
              <Confirmation
                selectedMethod={selectedMethod}
                cardMasked={cardStatus.masked}
                userData={{    //Aca colocar los datos de la bd
                  name: 'Mario',
                  surname: 'Brito',
                  email: 'mario.brito@gmail.com',
                  address: 'Jose Agustin #777, Quilpue, Chile'
                }}
                totalAmount={totalAmount}
              />
            )}

            {step === 4 && (
              <Payment 
          selectedMethod={selectedMethod}
          disabled={timeExpired || failedAttempts >= 3}
          onCancel={cancelFlow}
          onPaid={() => {
            handlePaymentSuccess();
            alert('Pago simulado (frontend). Datos sensibles no se almacenan.');
            cancelFlow();
          }}
              />
            )}
                    <footer
                      role="contentinfo"
                      className="app-footer"
                      aria-label="Pie de página PulgaShop"
                      style={{
                       position: 'fixed',
                       left: 0,
                       right: 0,
                       bottom: 0,
                       zIndex: 999,
                       backgroundColor: '#1abc3dff',
                       color: '#ffffff',
                       padding: '50px 30px',
                       borderRadius: 0,
                       boxSizing: 'border-box',
                      }}
                    >
                      <div
                       className="footer-inner"
                       style={{
                        maxWidth: 1100,
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 20,
                       }}
                      >
                       <div className="footer-left" style={{ minWidth: 0 }}>
                        <strong style={{fontSize: 20, display: 'block', marginBottom: 6 }}>PulgaShop</strong>
                        <div style={{ fontSize: 17, lineHeight: 1.2 }}>Av. España 1234, Valparaíso, Chile</div>
                       </div>

                       <div className="footer-right" style={{ textAlign: 'right', fontSize: 20 }}>
                        <div>Contacto: contacto@pulgashop.cl</div>
                        <div>Tel: +56 9 1234 5678</div>
                       </div>
                      </div>
                    </footer>

                   {/* Spacer para que el contenido/controles no queden ocultos detrás del footer fijo */}
                   <div aria-hidden style={{ height: 90, width: '100%' }} />

                   <div className="nav-row" style={{ zIndex: 1000 }}>
                    <button className="btn ghost" onClick={prevStep} disabled={step === 1}>Anterior</button>
                    <button className="btn primary" onClick={nextStep} disabled={!canProceed}>
                      {step < 4 ? 'Siguiente' : 'Pagar ahora'}
                    </button>
                   </div>

                   {/* Límite de intentos (seguridad) */}
          {failedAttempts > 0 && (
            <p className="hint attempts">Intentos fallidos: {failedAttempts} / 3</p>
          )}
          {failedAttempts >= 3 && (
            <p className="error">Has alcanzado el límite de 3 intentos fallidos. Intenta más tarde o cambia el método.</p>
          )}

          {/* Badges de confianza (CA4) */}
          <div className="trust-badges" aria-hidden>
            <img src={`${process.env.PUBLIC_URL}/assets/images/logo1.png`} alt="" /> 
            <img src={`${process.env.PUBLIC_URL}/assets/images/logo2.png`} alt="" />
            <img src={`${process.env.PUBLIC_URL}/assets/images/logo3.png`} alt="" />
            <img src={`${process.env.PUBLIC_URL}/assets/images/logo4.png`} alt="" />
          </div>
        </section>

        <aside className="pay-summary">
          <OrderSummary
            products={products}
            subtotal={subtotal}
            taxes={taxes}
            discount={discount}
            total={totalAmount}
            selectedMethod={selectedMethod}
            cardMasked={cardStatus.masked}
          />
        </aside>
      </main>
      )}
    </div>
  );
}

export default App;

