/**
 * ⚠️⚠️⚠️ CONFIGURACIÓN DE PRUEBA - NO USAR EN PRODUCCIÓN ⚠️⚠️⚠️
 * 
 * Este archivo documenta todos los valores de prueba/desarrollo
 * que DEBEN cambiarse antes de desplegar a producción.
 * 
 * Ver: CONFIGURACION_PRODUCCION.md para guía detallada
 */

// ============================================================
// 1. URLS DE RETORNO/CANCELACIÓN (App.js)
// ============================================================
const TEST_CONFIG = {
  webpay: {
    returnUrl: 'https://localhost:3001/payment/success',
    // ⚠️ CAMBIAR A: 'https://www.tupulgashop.com/payment/success'
  },
  
  paypal: {
    cancelUrl: 'https://localhost:3001/payment/cancel',
    // ⚠️ CAMBIAR A: 'https://www.tupulgashop.com/payment/cancel'
  },
  
  stripe: {
    // ⚠️ PRUEBA: ID simulado
    customerId: 'test_customer_[sessionId]',
    // ⚠️ CAMBIAR A: ID real desde base de datos
  }
};

// ============================================================
// 2. BACKEND URL (.env)
// ============================================================
const BACKEND_CONFIG = {
  test: {
    url: 'https://localhost:3000/api',
    ssl: 'Certificado auto-firmado',
  },
  
  production: {
    // ⚠️ CAMBIAR A:
    url: 'https://api.tupulgashop.com/api',
    ssl: 'Certificado SSL válido (Let\'s Encrypt, etc.)',
  }
};

// ============================================================
// 3. CREDENCIALES DE PAGO (Variables de Entorno Backend)
// ============================================================
const PAYMENT_CREDENTIALS = {
  stripe: {
    test: {
      secretKey: 'sk_test_...',
      publishableKey: 'pk_test_...',
    },
    production: {
      // ⚠️ CAMBIAR A:
      secretKey: 'sk_live_...',
      publishableKey: 'pk_live_...',
    }
  },
  
  paypal: {
    test: {
      clientId: 'client_id_sandbox',
      secret: 'secret_sandbox',
      mode: 'sandbox',
    },
    production: {
      // ⚠️ CAMBIAR A:
      clientId: 'client_id_production',
      secret: 'secret_production',
      mode: 'live',
    }
  },
  
  webpay: {
    test: {
      commerceCode: '597055555532',
      apiKey: 'test_key',
      environment: 'integration',
    },
    production: {
      // ⚠️ CAMBIAR A:
      commerceCode: 'tu_codigo_comercio_real',
      apiKey: 'tu_api_key_real',
      environment: 'production',
    }
  }
};

// ============================================================
// 4. TARJETAS DE PRUEBA (SOLO DESARROLLO)
// ============================================================
const TEST_CARDS = {
  stripe: {
    success: '4242 4242 4242 4242',
    declined: '4000 0000 0000 0002',
    insufficientFunds: '4000 0000 0000 9995',
    // ⚠️ REMOVER ESTAS REFERENCIAS EN PRODUCCIÓN
  },
  
  // ⚠️ EN PRODUCCIÓN: Los usuarios ingresan sus propias tarjetas
};

// ============================================================
// 5. CVV GENÉRICO (App.js línea ~186)
// ============================================================
const GENERIC_CVV = '000'; // ⚠️ Solo para PayPal/Webpay en pruebas
// ⚠️ EN PRODUCCIÓN: Usar tokenización o datos reales según el método

// ============================================================
// CHECKLIST DE PRODUCCIÓN
// ============================================================
const PRODUCTION_CHECKLIST = [
  '[ ] URLs apuntan a dominio de producción',
  '[ ] Customer ID viene de base de datos',
  '[ ] API URL es de producción',
  '[ ] SSL válido instalado',
  '[ ] Credenciales de producción configuradas',
  '[ ] CORS solo permite dominios de producción',
  '[ ] Variables de entorno de producción',
  '[ ] Sin datos hardcodeados',
  '[ ] Logs de debug deshabilitados',
  '[ ] Datos de prueba removidos',
  '[ ] Base de datos de producción',
  '[ ] Monitoreo configurado',
];

module.exports = {
  TEST_CONFIG,
  BACKEND_CONFIG,
  PAYMENT_CREDENTIALS,
  TEST_CARDS,
  GENERIC_CVV,
  PRODUCTION_CHECKLIST
};
