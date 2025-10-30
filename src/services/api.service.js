/**
 * API Service - Comunicación con Backend de Pagos
 * 
 * Este servicio centraliza todas las llamadas HTTP al backend
 * Maneja errores, timeouts y certificados auto-firmados en desarrollo
 */

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:3000/api';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000;

/**
 * Configuración para permitir certificados auto-firmados en desarrollo
 * SOLO para desarrollo local - NUNCA en producción
 */
const fetchConfig = {
  // En desarrollo, el backend usa certificados auto-firmados
  // El navegador mostrará advertencia que el usuario debe aceptar
};

/**
 * Wrapper para fetch con manejo de errores y timeout
 */
async function apiFetch(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchConfig,
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        // Headers de seguridad requeridos por el backend
        'x-session-id': options.sessionId || 'unknown',
        'x-user-id': options.userId || 'anonymous',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    // Si la respuesta no es OK, lanzar error con detalles
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Mostrar error detallado en consola para debugging
      console.error('❌ Error del backend:', errorData);
      
      throw new Error(
        errorData.message || 
        `Error ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado. Por favor, intenta nuevamente.');
    }
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(
        'No se pudo conectar con el servidor. Verifica:\n' +
        '1. Que el backend esté ejecutándose en https://localhost:3000\n' +
        '2. Que hayas aceptado el certificado auto-firmado visitando https://localhost:3000/api\n' +
        '3. Que no haya un firewall bloqueando la conexión'
      );
    }
    
    throw error;
  }
}

/**
 * API Service - Endpoints disponibles
 */
const apiService = {
  /**
   * Obtener métodos de pago disponibles
   * GET /api/pagos/payment-methods
   */
  getPaymentMethods: async () => {
    return apiFetch('/pagos/payment-methods', {
      method: 'GET',
    });
  },

  /**
   * Validar método de pago
   * POST /api/pagos/validate-payment-method
   */
  validatePaymentMethod: async (data) => {
    return apiFetch('/pagos/validate-payment-method', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Obtener información de sesión de pago
   * GET /api/pagos/session/:sessionId
   */
  getPaymentSession: async (sessionId) => {
    return apiFetch(`/pagos/session/${sessionId}`, {
      method: 'GET',
    });
  },

  /**
   * Confirmar monto antes de procesar pago
   * POST /api/pagos/confirm-amount
   */
  confirmAmount: async (data, sessionId, userId = 'anonymous') => {
    return apiFetch('/pagos/confirm-amount', {
      method: 'POST',
      body: JSON.stringify(data),
      sessionId,
      userId,
    });
  },

  /**
   * Procesar pago
   * POST /api/pagos
   */
  processPayment: async (data, sessionId, userId = 'anonymous') => {
    return apiFetch('/pagos', {
      method: 'POST',
      body: JSON.stringify(data),
      sessionId,
      userId,
    });
  },

  /**
   * Obtener estado de un pago
   * GET /api/pagos/:id
   */
  getPaymentStatus: async (paymentId) => {
    return apiFetch(`/pagos/${paymentId}`, {
      method: 'GET',
    });
  },

  /**
   * Solicitar reembolso
   * POST /api/pagos/:id/refund
   */
  refundPayment: async (paymentId, data) => {
    return apiFetch(`/pagos/${paymentId}/refund`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Obtener todos los pagos (requiere autenticación)
   * GET /api/pagos
   */
  getAllPayments: async (token) => {
    return apiFetch('/pagos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // ===== AUTH ENDPOINTS =====

  /**
   * Login de usuario
   * POST /api/auth/login
   */
  login: async (credentials) => {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Registro de usuario
   * POST /api/auth/register
   */
  register: async (userData) => {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // ===== USER ENDPOINTS =====

  /**
   * Obtener datos del usuario actual
   * GET /api/users/current
   */
  getCurrentUser: async () => {
    return apiFetch('/users/current', {
      method: 'GET',
    });
  },

  /**
   * Obtener carrito con cálculos de totales
   * GET /api/users/cart
   */
  getCart: async () => {
    return apiFetch('/users/cart', {
      method: 'GET',
    });
  },
};

export default apiService;
