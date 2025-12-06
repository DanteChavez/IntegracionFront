import React, { useEffect , useState, useMemo, useRef } from 'react';
import apiService from './services/api.service';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataVerification from './components/DataVerification';
import PaymentMethod from './components/PaymentMethod';
import Confirmation from './components/Confirmation';
import Payment from './components/Payment';
import OrderSummary from './components/OrderSummary';
import PaymentSuccess from './components/PaymentSuccess'; // Importar el componente de éxito
import PulgashopFooter from "./components/PulgashopFooter";



function App() {
  // Ref para prevenir doble carga en React StrictMode
  const dataLoaded = useRef(false);
  
  // Estados para el carrito (se cargará desde backend)
  const [cartData, setCartData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  // Flujo por pasos
  const [step, setStep] = useState(1);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false); // Estado para controlar el éxito del pago
  
  // Seguridad / validaciones de método
  const [selectedMethod, setSelectedMethod] = useState(null); // 'stripe' | 'paypal' | 'webpay'
  const [cardStatus, setCardStatus] = useState({ valid: false, masked: '', cardData: null });
  const [transferStatus, setTransferStatus] = useState({ fileName: '' });
  const [dataValid, setDataValid] = useState(false);

  // Límite de intentos fallidos (CA Seguridad)
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Temporizador (IU1-CA2). 10 minutos = 600 s
  const [timeLeft, setTimeLeft] = useState(600);
  
  // Estados para integración con backend
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //nuevo
  const [externalUser, setExternalUser] = useState(null);
  
  // Leer IDs desde URL si vienen del micro-servicio externo
  const urlParams = new URLSearchParams(window.location.search);
  const idCarritoFromUrl = urlParams.get('idCarrito');
  const idUsuarioFromUrl = urlParams.get('idUsuario');
  
  
  const [sessionId] = useState(() => {
    if (idCarritoFromUrl && idUsuarioFromUrl) {
      console.log(`🔗 IDs recibidos desde micro-servicio - Carrito: ${idCarritoFromUrl}, Usuario: ${idUsuarioFromUrl}`);
      return `session_${idCarritoFromUrl}_${idUsuarioFromUrl}`;
    }
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });
  
  const [userId] = useState(() => {
    if (idUsuarioFromUrl) {
      return idUsuarioFromUrl;
    }
    return 'anonymous'; // ⚠️ PRUEBA: En producción, obtener del usuario autenticado
  });
  
  const [confirmationToken, setConfirmationToken] = useState(null);
  
  // Datos del usuario (mejora del compañero - datos mock para confirmación)
  //const [userData] = useState({
  const [userData, setUserData] = useState({
    name: 'Mario',
    surname: 'Brito',
    email: 'mario.brito@gmail.com',
    address: 'Jose Agustin #777, Quilpue, Chile'
  });
  
  // Cargar métodos de pago y carrito al iniciar
  useEffect(() => {
    // Prevenir doble carga en React StrictMode (desarrollo)
    if (dataLoaded.current) {
      console.log('⏭️ Carga ya realizada, saltando...');
      return;
    }
    
    dataLoaded.current = true;
    
    const loadData = async () => {
      // Cargar en paralelo para mejor rendimiento
      await Promise.all([
        loadPaymentMethods(),
        loadCart(),
        loadExternalUser()
      ]);
    };
    
    loadData();
  }, []); // Array vacío = solo se ejecuta al montar
  
  const loadCart = async () => {
    try {
      let data;
      
      // Si viene idCarrito desde URL (micro-servicio externo), usar servicio de carrito externo
      if (idCarritoFromUrl) {
        console.log(`🔗 Cargando carrito desde micro-servicio externo con ID: ${idCarritoFromUrl}`);
        data = await apiService.getCartFromExternalService(idCarritoFromUrl);
        console.log('🛒 Carrito cargado desde micro-servicio externo:', data);
      } else {
        // Si no, usar el carrito del backend de pagos
        data = await apiService.getCart();
        console.log('🛒 Carrito cargado desde backend:', data);
      }
      
      setCartData(data);
      setTotalAmount(data.total);
      // Configurar el tiempo límite desde el backend
      if (data.checkout?.timeoutSeconds) {
        setTimeLeft(data.checkout.timeoutSeconds);
      }
    } catch (err) {
      console.error('❌ Error cargando carrito:', err);
      setError(err.message);
    }
  };

  //const loadExternalUser = async () => {
  //try {
    //if (!idUsuarioFromUrl) return;
    //const data = await apiService.getUserFromExternalService(idUsuarioFromUrl);
    //console.log("👤 Usuario externo cargado:", data);
    //setUserData(data);
  //} catch (err) {
    //console.error("❌ Error cargando usuario externo:", err);
  //}
  //};

  const loadExternalUser = async () => {
  try {
    if (!idUsuarioFromUrl) return;

    const data = await apiService.getUserFromExternalService(idUsuarioFromUrl);
    console.log("👤 Usuario externo cargado:", data);

    // 👇 IMPORTANTE: transformar el formato al que usa tu front
    setUserData({
      name: data.name || data.fullName || "Usuario",
      surname: data.surname || "",
      email: data.email || "",
      address: data.address || data.profile?.location || ""
    });

  } catch (err) {
    console.error("❌ Error cargando usuario externo:", err);
  }
  };


  
  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const methods = await apiService.getPaymentMethods();
      setPaymentMethods(methods);
      console.log('✅ Métodos de pago cargados desde backend:', methods);
    } catch (err) {
      console.error('❌ Error cargando métodos de pago:', err);
      setError(err.message);
      // Continuar con métodos locales si falla
    } finally {
      setLoading(false);
    }
  };
  
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
      if (selectedMethod === 'stripe') 
          return cardStatus.valid;
      // Pasarelas externas: basta con selección
      if (selectedMethod === 'paypal' || selectedMethod === 'webpay') return true;
      return false;
    }
    if (step === 3) return true; // Confirmación visual
    if (step === 4) return true; // Botón pagar controla estados
    return false;
  }, [step, dataValid, selectedMethod, cardStatus.valid, timeExpired, failedAttempts]);


  const nextStep = () => setStep((s) => Math.min(4, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));
  
  const cancelFlow = () => {
    // Limpieza de datos sensibles (no persistimos nada en almacenamiento)
    setSelectedMethod(null);
    setCardStatus({ valid: false, masked: '', cardData: null });
    setTransferStatus({ fileName: '' });
    setFailedAttempts(0);
    setConfirmationToken(null);
    setError(null);
    setStep(1);
  };
  
  /**
   * Confirmar el monto antes de procesar el pago
   * Integración con backend
   */
  const confirmPaymentAmount = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.confirmAmount({
        amount: totalAmount,
        currency: 'CLP',
        provider: selectedMethod, // stripe, paypal o webpay (en minúsculas)
        description: `Compra en PulgaShop - ${cartData?.items?.length || 0} productos`,
        metadata: {
          cartId: cartData?.cartId || 'cart_unknown',
          userId: cartData?.userId || userId,
          items: cartData?.items || [],
          subtotal: cartData?.subtotal || 0,
          iva: cartData?.iva || {},
          sessionId: sessionId // Info adicional en metadata
        }
      }, sessionId, userId); // Pasar sessionId y userId como parámetros
      
      setConfirmationToken(response.confirmationToken);
      console.log('✅ Monto confirmado:', response);
      return response.confirmationToken; // Retornar el token
    } catch (err) {
      console.error('❌ Error confirmando monto:', err);
      setError(err.message);
      return null; // Retornar null en caso de error
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Procesar el pago con el backend
   */
  const processPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ⚠️ IMPORTANTE: Generar token de confirmación primero
      // El backend requiere este token para validar que el monto fue confirmado
      let tokenToUse = confirmationToken;
      if (!tokenToUse) {
        tokenToUse = await confirmPaymentAmount();
        if (!tokenToUse) {
          throw new Error('No se pudo confirmar el monto del pago');
        }
      }
      
      // Validar que tengamos los datos necesarios según el método
      if (selectedMethod === 'stripe' && !cardStatus.cardData) {
        throw new Error('Datos de tarjeta incompletos');
      }
      
      // ============================================================
      // ⚠️⚠️⚠️ CONFIGURACIÓN DE PRUEBA - CAMBIAR EN PRODUCCIÓN ⚠️⚠️⚠️
      // ============================================================
      
      // Extraer datos de tarjeta solo para Stripe (captura local)
      // Webpay y PayPal redirigen a sus propios portales para capturar la tarjeta
      let cardSecurity = null;
      if (cardStatus.cardData) {
        const expMatch = cardStatus.cardData.expiry.match(/^(\d{2})\/(\d{2})$/);
        const expiryMonth = expMatch ? parseInt(expMatch[1], 10) : null;
        const expiryYear = expMatch ? parseInt('20' + expMatch[2], 10) : null;
        
        cardSecurity = {
          cvv: cardStatus.cardData.cvv,
          last4Digits: cardStatus.cardData.number.slice(-4),
          cardHolderName: cardStatus.cardData.name.toUpperCase(),
          expiryMonth: expiryMonth,
          expiryYear: expiryYear
        };
      } else {
        // Para Webpay y PayPal: no hay datos de tarjeta capturados localmente
        // La tarjeta se ingresa en los portales externos después de la redirección
        cardSecurity = {
          cvv: '000', // CVV genérico - no se captura localmente
          last4Digits: null,
          cardHolderName: null
        };
      }
      
      // ============================================================
      // ⚠️ CONFIGURACIÓN DE PRUEBA POR PROVEEDOR
      // ============================================================
      
      // Preparar datos según el método seleccionado
      // Crear objeto completo con todos los campos requeridos según el proveedor
      const paymentData = {
        amount: totalAmount,
        currency: 'CLP',
        provider: selectedMethod, // 'stripe', 'paypal', 'webpay' (en minúsculas)
        cardSecurity: cardSecurity,
        confirmationToken: tokenToUse, // Token de confirmación del backend
        description: `Compra en PulgaShop - ${cartData?.items?.length || 0} productos`,
        metadata: {
          cartId: cartData?.cartId || 'cart_unknown',
          userId: cartData?.userId || userId,
          items: cartData?.items || [],
          subtotal: cartData?.subtotal || 0,
          iva: cartData?.iva || {},
          total: cartData?.total || totalAmount,
          paymentMethod: selectedMethod,
          sessionId: sessionId
        },
        // ⚠️ CAMPOS ESPECÍFICOS POR PROVEEDOR (TODOS CON VALORES DE PRUEBA)
        // STRIPE: customerId es obligatorio
        ...(selectedMethod === 'stripe' && {
          customerId: `test_customer_${sessionId}` // ⚠️ CAMBIAR en producción
        }),
        // WEBPAY: returnUrl es obligatorio
        ...(selectedMethod === 'webpay' && {
          returnUrl: 'https://ejemplo.com/webpay/return' // ⚠️ CAMBIAR en producción
        }),
        // PAYPAL: cancelUrl es obligatorio
        ...(selectedMethod === 'paypal' && {
          cancelUrl: 'https://ejemplo.com/paypal/cancel' // ⚠️ CAMBIAR en producción
        }),
      };
      
      // ============================================================
      // FIN DE CONFIGURACIÓN DE PRUEBA
      // ============================================================
      
      // Debug: verificar datos antes de enviar
      console.log('🔍 Verificación de datos de tarjeta:', {
        cardStatus: cardStatus,
        cardData: cardStatus.cardData,
        cardSecurity: {
          cardHolderName: cardSecurity?.cardHolderName,
          last4Digits: cardSecurity?.last4Digits,
          cvv: '***'
        }
      });
      
      console.log('📤 Enviando pago al backend:', { ...paymentData, cardSecurity: { ...paymentData.cardSecurity, cvv: '***' } });
      
      const response = await apiService.processPayment(paymentData, sessionId, userId);
      console.log('✅ Pago procesado exitosamente:', response);
      
      handlePaymentSuccess();
      return true;
    } catch (err) {
      console.error('❌ Error procesando pago:', err);
      setError(err.message);
      setFailedAttempts(prev => prev + 1);
      
      // Mensaje amigable para el usuario
      alert(`Error al procesar el pago:\n${err.message}\n\nIntentos fallidos: ${failedAttempts + 1}/3`);
      return false;
    } finally {
      setLoading(false);
    }
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
          userData={userData}
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
                paymentMethods={paymentMethods}
              />
            )}

            {step === 3 && (
              <Confirmation
          selectedMethod={selectedMethod}
          cardMasked={cardStatus.masked}
          paymentMethods={paymentMethods}
          userData={userData}
          totalAmount={totalAmount}
              />
            )}

            {step === 4 && (
              <Payment 
          selectedMethod={selectedMethod}
          disabled={timeExpired || failedAttempts >= 3 || loading}
          loading={loading}
          onCancel={cancelFlow}
          onPaid={processPayment}
          totalAmount={totalAmount}
          sessionId={sessionId}
          userId={userId}
              />
            )}
            
            {/* Mostrar errores de conexión con el backend */}
            {error && (
              <div className="error-banner" style={{
                backgroundColor: '#fee',
                border: '1px solid #c33',
                borderRadius: '8px',
                padding: '12px',
                margin: '16px 0',
                color: '#c33'
              }}>
                <strong>⚠️ Error de conexión:</strong>
                <p style={{ margin: '8px 0 0 0', whiteSpace: 'pre-line' }}>{error}</p>
                <button 
                  onClick={() => setError(null)}
                  style={{
                    marginTop: '8px',
                    padding: '4px 12px',
                    border: '1px solid #c33',
                    borderRadius: '4px',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cerrar
                </button>
              </div>
            )}

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
          <OrderSummary cartData={cartData} loading={loading} />
        </aside>
      </main>
      )}
      <PulgashopFooter />   {/* 👈 NUEVO FOOTER */}
    </div>
  );
}

export default App;
