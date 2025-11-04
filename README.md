# 💳 Payment Frontend - Sistema de Pagos con React 19

Frontend moderno desarrollado con **React 19** que implementa un flujo completo de pagos multi-proveedor con integración al backend NestJS, validación en tiempo real y experiencia de usuario optimizada.

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://react.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTTPS](https://img.shields.io/badge/HTTPS-Enabled-green)](https://developer.mozilla.org/en-US/docs/Web/Security)
[![Integration](https://img.shields.io/badge/Backend-NestJS%20API-E0234E)](https://github.com/DanteChavez/IntegracionBack)

## ✨ Características Principales

### 🎯 Flujo de Pagos Completo
- ✅ **4 Pasos Intuitivos**: Resumen → Método de Pago → Confirmación → Procesamiento
- ✅ **Navegación Fluida**: Avanzar/Retroceder entre pasos con validación
- ✅ **Feedback Visual**: Estados de carga, errores y éxito claramente indicados
- ✅ **Datos Persistentes**: Información del usuario mantenida durante todo el flujo
- ✅ **Visualización de Cantidades**: Productos con cantidades múltiples muestran badge "x2", "x3"

### 💳 Métodos de Pago
- ✅ **Stripe**: Tarjetas de crédito/débito internacionales
- ✅ **PayPal**: Pagos con cuenta PayPal
- ✅ **Webpay**: Procesamiento para mercado chileno
- ✅ **Selección Dinámica**: Métodos disponibles obtenidos del backend

### 🛡️ Validación y Seguridad
- ✅ **Validación en Tiempo Real**: Campos validados mientras el usuario escribe
- ✅ **Auto-formateo Inteligente**: 
  - Número de tarjeta: espacios cada 4 dígitos (XXXX XXXX XXXX XXXX)
  - Fecha expiración: formato MM/YY con slash automático
  - Backspace inteligente en campos formateados
- ✅ **Validación CVV Mejorada**: 
  - Máximo 4 dígitos (Amex y Visa/Mastercard)
  - Solo acepta números (sin letras ni símbolos)
  - Validación en tiempo real con feedback
- ✅ **Headers de Seguridad**: x-session-id y x-user-id en cada request
- ✅ **HTTPS Obligatorio**: Comunicación cifrada con certificados SSL

### 📊 Gestión del Pedido
- ✅ **Cálculo Automático**: Subtotal, impuestos (19% IVA) y total
- ✅ **Resumen Detallado**: Listado de productos con cantidades y precios
- ✅ **Cantidades Visibles**: Badge "x2", "x3" para productos múltiples
- ✅ **Precio Total por Ítem**: Muestra precio unitario × cantidad
- ✅ **Verificación de Datos**: Validación de carrito antes de procesar
- ✅ **Confirmación Previa**: Revisión de todos los datos antes del pago

### 🎨 Experiencia de Usuario (UX/UI)
- ✅ **Diseño Responsivo**: Funciona en desktop, tablet y móvil
- ✅ **Estilos Modernos**: Interfaz limpia y profesional
- ✅ **Estados Visuales**: Indicadores claros de campos requeridos/opcionales
- ✅ **Mensajes Claros**: Feedback comprensible en cada acción
- ✅ **Prevención de Errores**: Validación proactiva antes de enviar
- ✅ **Badges de Cantidad**: Visualización clara con "x2", "x3" en productos múltiples
- ✅ **Formato de Moneda**: Separación de miles con puntos (ej: $291.502)

## 🚀 Tecnologías y Stack

### Core
- **React 19.0.0**: Librería UI con últimas características
- **JavaScript ES6+**: Sintaxis moderna y funcional
- **CSS3**: Estilos personalizados sin frameworks pesados
- **Fetch API**: Comunicación HTTP nativa del navegador

### Desarrollo
- **Node.js**: Entorno de desarrollo y build
- **npm/npm-scripts**: Gestión de dependencias y scripts
- **HTTPS**: Servidor de desarrollo con SSL
- **dotenv**: Gestión de variables de entorno

### Integración
- **Backend NestJS**: API REST en `https://localhost:3000`
- **Swagger Docs**: Documentación interactiva del API
- **Headers Custom**: x-session-id, x-user-id para seguridad

## 📁 Estructura del Proyecto

```
frontend/
├── public/
│   └── index.html                    # HTML principal
│
├── src/
│   ├── index.js                      # Punto de entrada React
│   ├── App.js                        # 🎯 Componente principal (orquestador)
│   │
│   ├── components/                   # 📦 Componentes del flujo
│   │   ├── OrderSummary.js          # Paso 1: Resumen del pedido
│   │   ├── PaymentMethod.js         # Paso 2: Selección y datos de pago
│   │   ├── Confirmation.js          # Paso 3: Confirmación de datos
│   │   ├── PaymentSuccess.js        # Paso 4: Confirmación exitosa
│   │   ├── Payment.js               # Componente wrapper de pago
│   │   └── DataVerification.js      # Validación de datos del carrito
│   │
│   ├── services/
│   │   └── api.service.js           # 🔌 Servicio de comunicación con backend
│   │
│   ├── config/
│   │   └── test-config.js           # ⚙️ Configuración de pruebas
│   │
│   ├── assets/
│   │   └── images/                  # 🖼️ Logos e imágenes
│   │       ├── logo.svg
│   │       ├── logo1.png
│   │       ├── logo2.png
│   │       ├── logo3.jpg
│   │       └── logo4.png
│   │
│   └── style/
│       └── App.css                  # 🎨 Estilos globales
│
├── .env.example                      # Ejemplo de variables de entorno
├── .gitignore                        # Archivos ignorados por Git
├── package.json                      # Dependencias y scripts
└── README.md                         # Esta documentación

```

## 🔧 Instalación y Configuración

### Prerrequisitos

- **Node.js**: v18+ recomendado
- **npm**: v9+ (incluido con Node.js)
- **Backend**: [IntegracionBack](https://github.com/DanteChavez/IntegracionBack) corriendo en `https://localhost:3000`

### Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/DanteChavez/IntegracionFront.git
cd IntegracionFront
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Editar `.env` con tus valores:
```env
HTTPS=true
SSL_CRT_FILE=./secrets/pulgashopcert.pem
SSL_KEY_FILE=./secrets/pulgashopkey.pem
PORT=3001
REACT_APP_BACKEND_URL=https://localhost:3000
```

4. **Generar certificados SSL (desarrollo):**
```bash
# Crear directorio
mkdir secrets

# Generar certificados auto-firmados
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout secrets/pulgashopkey.pem \
  -out secrets/pulgashopcert.pem \
  -days 365 \
  -subj "/CN=localhost"
```

### Ejecución

**Modo Desarrollo:**
```bash
npm start
```

La aplicación estará disponible en:
- **URL**: `https://localhost:3001`
- **Backend API**: `https://localhost:3000`
- **Swagger Docs**: `https://localhost:3000/api/docs`

## 🎮 Uso del Sistema

### Flujo Completo de Pago

#### **Paso 1: Resumen del Pedido** (`OrderSummary.js`)

Muestra el resumen del carrito de compras:
- Lista de productos con cantidades y precios
- **Badge visual "x2", "x3"** para productos con cantidad > 1
- **Precio total por ítem** (precio unitario × cantidad)
- Cálculo de subtotal
- Aplicación de impuestos (19% IVA)
- Total a pagar con formato de moneda chilena

**Ejemplo visual:**
```
Audífonos Pro x2          $59,980
Mouse Inalámbrico         $14,990
Teclado Mecánico x3      $149,970
```

**Acciones:**
- ✅ Continuar al siguiente paso

#### **Paso 2: Método de Pago** (`PaymentMethod.js`)

Selección del proveedor y captura de datos:

**Campos del Formulario:**
- **Proveedor**: Stripe / PayPal / Webpay (selección dinámica)
- **Nombre del titular**: Texto libre
- **Número de tarjeta**: Auto-formateado (XXXX XXXX XXXX XXXX)
- **Fecha de expiración**: Auto-formateado (MM/YY)
- **CVV**: 3-4 dígitos (máximo 4, solo números)
- **Email**: Validación de formato

**Validaciones:**
- ✅ Formato de tarjeta correcto
- ✅ Fecha no vencida (mes/año válidos)
- ✅ CVV de longitud correcta (3-4 dígitos)
- ✅ CVV solo acepta números (sin letras)
- ✅ Email con formato válido
- ✅ Todos los campos requeridos completados

**Auto-formateo:**
```javascript
// Número de tarjeta: escribe "4111111111111111"
// Resultado: "4111 1111 1111 1111"

// Fecha: escribe "1225"
// Resultado: "12/25"
```

**Acciones:**
- ⬅️ Volver al resumen
- ➡️ Continuar a confirmación

#### **Paso 3: Confirmación** (`Confirmation.js`)

Revisión final antes del pago:
- Método de pago seleccionado
- Datos de la tarjeta (últimos 4 dígitos)
- Monto total a cobrar

**Acciones:**
- ⬅️ Volver a editar método de pago
- ✅ Confirmar y procesar pago

#### **Paso 4: Procesamiento** (`PaymentSuccess.js`)

Estados posibles:
- ⏳ **Procesando**: Comunicación con backend
- ✅ **Éxito**: Pago confirmado con número de transacción
- ❌ **Error**: Mensaje de error y opción de reintentar

### Datos de Prueba

**🧪 Testing - Simulación de Errores:**

Para probar el manejo de errores, modifica el carrito para que el total sea exactamente **666**:

```javascript
// Backend: src/data/carrito.json
{
  "items": [
    {
      "id": "prod-test",
      "name": "Producto de prueba",
      "price": 560,
      "quantity": 1
    }
  ],
  "subtotal": 560,
  "iva": {
    "rate": 0.19,
    "percentage": 19,
    "amount": 106,
    "description": "Impuesto al Valor Agregado (IVA)"
  },
  "total": 666  // ⚠️ Monto especial para simular error
}
```

**Comportamiento esperado:**
- ✅ Frontend: Envía pago normalmente
- ✅ Backend: Detecta amount=666 y simula error
- ✅ Estado: PENDING → PROCESSING → FAILED
- ✅ Log: Registra en `historial_de_errores` con fecha automática
- ✅ Frontend: Muestra mensaje de error y botón "Reintentar"

**Usuario de prueba:**
```javascript
const testUser = {
  userId: 'customer_12345',
  sessionId: 'session_abc123'
};
```

**Tarjetas de prueba Stripe:**
```
Visa:       4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
Amex:       3782 822463 10005

CVV: 123 (cualquier valor de 3-4 dígitos)
Fecha: cualquier fecha futura (ej. 12/25)
```

**Configuración de impuestos:**
```javascript
{
  "taxRate": 0.19,    // 19% IVA
  "currency": "CLP"   // Peso chileno
}
```

## 🔌 Integración con Backend

### API Endpoints Utilizados

#### 1. **Obtener Métodos de Pago**
```javascript
GET https://localhost:3000/payments/payment-methods
Headers: {
  'x-session-id': 'session_abc123',
  'x-user-id': 'customer_12345'
}

Response: {
  methods: [
    {
      provider: 'stripe',
      name: 'Stripe',
      description: 'Tarjetas de crédito/débito',
      enabled: true,
      supportedCurrencies: ['USD', 'EUR', 'CLP']
    },
    // ... más métodos
  ]
}
```

#### 2. **Confirmar Monto**
```javascript
POST https://localhost:3000/payments/confirm-amount
Headers: {
  'x-session-id': 'session_abc123',
  'x-user-id': 'customer_12345'
}
Body: {
  amount: 129900,
  currency: 'CLP',
  userId: 'customer_12345'
}

Response: {
  confirmationToken: 'conf_xyz789abc',
  amount: 129900,
  currency: 'CLP',
  expiresAt: '2025-10-30T15:45:00Z'
}
```

#### 3. **Procesar Pago**
```javascript
POST https://localhost:3000/api/pagos
Headers: {
  'x-session-id': 'session_abc123',
  'x-user-id': 'customer_12345'
}
Body: {
  // Datos del pago
  amount: 291502,
  currency: 'CLP',
  provider: 'stripe',
  description: 'Compra en PulgaShop - 4 productos',
  
  // Seguridad (token de confirmación)
  confirmationToken: 'conf_xyz789abc',
  
  // Datos de tarjeta (solo para Stripe)
  cardSecurity: {
    cvv: '123',                    // NUNCA se almacena en BD
    last4Digits: '4242',           // SÍ se almacena
    cardHolderName: 'JUAN PEREZ'   // SÍ se almacena
  },
  
  // Metadata adicional
  metadata: {
    cartId: 'cart_019',
    userId: 'user_123',
    orderId: '1',
    items: [
      {
        id: 'prod-001',
        name: 'Audífonos Pro',
        price: 29990,
        quantity: 2
      },
      // ... más productos
    ],
    subtotal: 244960,
    iva: {
      rate: 0.19,
      percentage: 19,
      amount: 46542
    },
    total: 291502
  }
}

Response (Éxito): {
  id: 'pay_1762194548784_afethqd',
  amount: 291502,
  currency: 'CLP',
  provider: 'stripe',
  status: 'COMPLETED',
  transactionId: 'mock_pay_1762194548784_afethqd',
  createdAt: '2025-11-03T18:29:08.793Z'
}

Response (Error - amount=666 para testing): {
  statusCode: 422,
  message: 'Error de prueba simulado - Pago rechazado',
  error: 'Unprocessable Entity'
}
```

**⚠️ IMPORTANTE - Seguridad:**
- El CVV se envía al backend pero **NUNCA se almacena**
- Solo se guardan `last4Digits` y `cardHolderName`
- El backend sanitiza automáticamente los datos antes de guardar
- Cumplimiento PCI-DSS garantizado

### Servicio API (`api.service.js`)

Capa de abstracción para comunicación con backend:

```javascript
// Obtener métodos de pago
const methods = await apiService.getPaymentMethods(sessionId, userId);

// Confirmar monto
const { confirmationToken } = await apiService.confirmAmount({
  amount: 129900,
  currency: 'CLP',
  userId: 'customer_12345',
  sessionId: 'session_abc123'
});

// Procesar pago
const result = await apiService.processPayment({
  confirmationToken,
  amount: 129900,
  currency: 'CLP',
  userId: 'customer_12345',
  provider: 'stripe',
  ...cardData,
  sessionId: 'session_abc123'
});
```

## 🔒 Seguridad

### Headers de Seguridad

Todos los requests incluyen:
```javascript
{
  'x-session-id': 'session_abc123',  // ID de sesión único
  'x-user-id': 'customer_12345'      // ID del usuario
}
```

### Validaciones Cliente

- **Formato de tarjeta**: Validación con expresiones regulares
- **Fecha de expiración**: Verificación mes (01-12) y año futuro
- **CVV**: Longitud según tipo de tarjeta (3-4 dígitos)
- **Email**: Formato RFC 5322 básico

### Datos Sensibles

⚠️ **IMPORTANTE**:
- Nunca se almacenan datos de tarjeta en localStorage/sessionStorage
- CVV nunca se guarda, solo se envía al backend
- Comunicación exclusivamente por HTTPS
- Certificados SSL requeridos (auto-firmados en desarrollo)

### Mejores Prácticas Implementadas

✅ **No almacenar CVV**: Solo se envía al backend, nunca se guarda
✅ **HTTPS obligatorio**: Sin fallback a HTTP
✅ **Validación dual**: Cliente + Servidor
✅ **Tokens de un solo uso**: Confirmación expira en 5 minutos
✅ **Headers de contexto**: Rastreo de sesión y usuario

## 📝 Componentes Principales

### `App.js` - Orquestador Principal

**Responsabilidades:**
- Gestión del estado global de la aplicación
- Control del flujo de navegación (4 pasos)
- Comunicación con backend vía `api.service.js`
- Manejo de errores y estados de carga

**Estados principales:**
```javascript
const [currentStep, setCurrentStep] = useState(1);        // Paso actual
const [selectedMethod, setSelectedMethod] = useState(''); // Proveedor seleccionado
const [cardData, setCardData] = useState({});             // Datos de tarjeta
const [confirmationToken, setConfirmationToken] = useState(''); // Token
const [paymentResult, setPaymentResult] = useState(null); // Resultado
const [loading, setLoading] = useState(false);            // Estado de carga
```

### `PaymentMethod.js` - Formulario de Pago

**Características especiales:**

**Validación CVV mejorada:**
```javascript
const handleCvvChange = (e) => {
  // Solo acepta números, máximo 4 dígitos
  let value = e.target.value.replace(/\D/g, ''); // Eliminar no-dígitos
  if (value.length <= 4) {
    setCvv(value);
  }
};

// Input con restricciones
<input
  type="text"
  maxLength="4"
  pattern="\d*"
  onChange={handleCvvChange}
  placeholder="123"
/>

// Validación antes de enviar
if (cvv.length < 3 || cvv.length > 4) {
  return 'CVV debe tener 3 o 4 dígitos';
}
```

**Auto-formateo de número de tarjeta:**
```javascript
const handleCardNumberChange = (e) => {
  let value = e.target.value.replace(/\s/g, ''); // Quitar espacios
  let formatted = value.match(/.{1,4}/g)?.join(' ') || value; // Agrupar de 4 en 4
  setCardNumber(formatted);
};
```

**Auto-formateo de fecha (MM/YY):**
```javascript
const handleExpiryChange = (e) => {
  let value = e.target.value.replace(/\D/g, ''); // Solo números
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4); // Insertar /
  }
  setExpiryDate(value);
};

// Manejo inteligente de backspace
const handleExpiryKeyDown = (e) => {
  if (e.key === 'Backspace' && expiryDate.endsWith('/')) {
    e.preventDefault();
    setExpiryDate(expiryDate.slice(0, -2)); // Borrar MM/
  }
};
```

### `Confirmation.js` - Confirmación de Datos

**Muestra:**
- Nombre del método de pago (obtenido del backend)
- Últimos 4 dígitos de la tarjeta
- Monto total con formato de moneda

**Validación:**
```javascript
const methodInfo = paymentMethods?.find(m => m.provider === selectedMethod);
const last4Digits = cardData.cardNumber?.replace(/\s/g, '').slice(-4);
```

### `PaymentSuccess.js` - Resultado del Pago

**Estados manejados:**
- ✅ **Éxito**: Muestra transactionId y mensaje de confirmación
- ❌ **Error**: Muestra mensaje de error y botón "Reintentar"
- ⏳ **Procesando**: Spinner de carga

## 🧪 Testing y Validación

### Casos de Prueba Principales

#### Test 1: Auto-formateo de Tarjeta
```
Input:  "4242424242424242"
Output: "4242 4242 4242 4242"
```

#### Test 2: Auto-formateo de Fecha
```
Input:  "1225"
Output: "12/25"

Input (backspace en "12/"): 
Output: "1"
```

#### Test 3: Validación de Campos
```javascript
// Tarjeta inválida
"1234" → Error: "Número de tarjeta inválido"

// Fecha vencida
"01/20" → Error: "Tarjeta expirada"

// CVV con letras (prevenido por validación)
Input: "12a" → Output: "12" (elimina automáticamente)

// CVV más de 4 dígitos (prevenido por maxLength)
Input: "12345" → Output: "1234" (trunca a 4)

// Email inválido
"correo@" → Error: "Email inválido"
```

#### Test 4: Visualización de Cantidades
```javascript
// Producto con cantidad 1
Item: { name: "Mouse", price: 14990, quantity: 1 }
Output: "Mouse          $14,990"

// Producto con cantidad 2
Item: { name: "Audífonos", price: 29990, quantity: 2 }
Output: "Audífonos x2   $59,980"
// Badge "x2" con estilo verde
// Precio = 29990 × 2 = 59,980
```

#### Test 5: Simulación de Errores
```javascript
// Configurar amount=666 en backend
1. Modificar Backend/src/data/carrito.json con total=666
2. Frontend carga carrito normalmente ✅
3. Usuario completa formulario ✅
4. Backend detecta amount=666 → simula error ✅
5. Frontend muestra error con botón "Reintentar" ✅
6. Verificar historial_de_errores en BD ✅
```

#### Test 4: Flujo Completo
```
1. Cargar métodos de pago ✅
2. Seleccionar Stripe ✅
3. Ingresar datos de tarjeta ✅
4. Confirmar datos ✅
5. Procesar pago ✅
6. Mostrar resultado exitoso ✅
```

### Validación Manual

**Checklist de pruebas:**
- [ ] Auto-formateo funciona mientras escribes
- [ ] Backspace borra correctamente en campos formateados
- [ ] CVV solo acepta números (máximo 4 dígitos)
- [ ] CVV rechaza letras y símbolos automáticamente
- [ ] Validación muestra errores claros
- [ ] No puedes avanzar con datos inválidos
- [ ] Puedes volver atrás sin perder datos
- [ ] Loading spinner aparece durante requests
- [ ] Errores del backend se muestran correctamente
- [ ] Pago exitoso muestra transactionId
- [ ] Badge "x2", "x3" aparece solo cuando cantidad > 1
- [ ] Precio total por ítem = precio unitario × cantidad
- [ ] Simulación de errores funciona con amount=666
- [ ] Datos de tarjeta (last4Digits, cardHolderName) se guardan
- [ ] CVV nunca aparece en respuestas del backend

## 📚 Documentación Relacionada

### Backend
- **Repositorio**: [IntegracionBack](https://github.com/DanteChavez/IntegracionBack)
- **API Docs**: `https://localhost:3000/api/docs` (Swagger UI)
- **README Backend**: Documentación completa del API

### Guía de Integración
- **Swagger Usage**: `Backend/SWAGGER_ACTUALIZADO.md`

### Archivos de Configuración
- **Test Config**: `src/config/test-config.js` - Valores de prueba
- **Environment**: `.env.example` - Variables de entorno

## 🚀 Despliegue a Producción

### Checklist Pre-Despliegue

#### 1. **Actualizar URLs**
```javascript
// src/services/api.service.js
const API_BASE_URL = 'https://api.tudominio.com'; // ⚠️ Cambiar de localhost
```

#### 2. **Actualizar Datos de Usuario**
```javascript
// src/App.js
const userId = 'customer_REAL_ID';     // ⚠️ Cambiar IDs de prueba
const sessionId = generateSessionId(); // ⚠️ Implementar generación real
```

#### 3. **Certificados SSL Reales**
```bash
# Reemplazar certificados auto-firmados
# Usar certificados de Let's Encrypt o tu proveedor
```

#### 4. **Variables de Entorno**
```env
REACT_APP_BACKEND_URL=https://api.tudominio.com
REACT_APP_ENVIRONMENT=production
```

#### 5. **Build para Producción**
```bash
npm run build
```

#### 6. **Servir con HTTPS**
```bash
# Opción 1: Nginx
# Opción 2: Apache
# Opción 3: Servicio de hosting (Vercel, Netlify, etc.)
```

### Consideraciones de Seguridad en Producción

⚠️ **CRÍTICO**:
- Nunca commitear certificados reales a Git
- Usar variables de entorno para configuración sensible
- Habilitar CORS solo para dominios específicos
- Implementar rate limiting en el frontend también
- Agregar Content Security Policy (CSP)
- Habilitar HSTS (HTTP Strict Transport Security)

## 📄 Licencia

Este proyecto es parte de un sistema de pagos educativo/demo.

## 📝 Changelog

> Para un historial completo y detallado de cambios, consulta el archivo [CHANGELOG.md](./CHANGELOG.md)

### v1.2.0 (2025-11-03) - Optimización de Rendimiento ⚡

#### 🚀 Performance
- **Optimizado**: Eliminación de llamadas API duplicadas
  - Antes: 4 llamadas simultáneas a `/api/users/current` y `/api/users/cart`
  - Después: 1 llamada por endpoint (75% de reducción)
  - Ahorro: 3 llamadas HTTP por carga de página
- **Refactorizado**: `OrderSummary.js` convertido a componente presentacional
  - Removidos: `useEffect` y `useState`
  - Ahora recibe datos como props desde `App.js`
  - Mayor facilidad de testing y mantenimiento
- **Mejorado**: Manejo de React StrictMode
  - Implementado `useRef` para flag persistente `dataLoaded`
  - Previene duplicación en modo desarrollo
  - Estado persiste entre re-montajes del componente

#### 📊 Arquitectura
```javascript
// Antes (OrderSummary hacía llamadas API duplicadas):
App.js: useEffect → API call #1 y #2
OrderSummary.js: useEffect → API call #3 y #4
Total: 4 llamadas (2 duplicadas)

// Después (Single Source of Truth):
App.js: useEffect + useRef → API call #1 y #2 (una sola vez)
OrderSummary.js: recibe props
Total: 2 llamadas (0 duplicadas) ✅
```

#### 🎯 Beneficios
- ✅ 75% menos tráfico de red
- ✅ Carga inicial más rápida
- ✅ Menor carga del servidor
- ✅ Componentes más testeables
- ✅ Patrón presentacional/contenedor mejorado

### v1.1.0 (2025-11-03) - Mejoras de UX y Validación

#### 🎨 Interfaz de Usuario
- **Agregado**: Visualización de cantidades en `OrderSummary.js`
  - Badge "x2", "x3" para productos con cantidad > 1
  - Solo muestra badge si cantidad > 1 (evita "x1" redundante)
  - Diseño: fondo verde claro (#d1fae5) con texto verde oscuro
  - Padding y border-radius para mejor apariencia
- **Mejorado**: Precio por ítem ahora muestra total (precio × cantidad)
  - Antes: mostraba solo precio unitario
  - Ahora: muestra precio total del ítem
  - Mejora claridad del resumen de pedido

#### ✅ Validación
- **Mejorado**: Validación CVV en `PaymentMethod.js`
  - `maxLength="4"` para limitar entrada
  - Regex `replace(/\D/g, '')` elimina letras y símbolos
  - Solo acepta dígitos numéricos (0-9)
  - Validación de longitud antes de submit (3-4 dígitos)
  - Previene confusión y errores de formato

#### 🔄 Sincronización con Backend
- **Mejorado**: Manejo de `cardSecurity` en `App.js`
  - Simplificado objeto `cardSecurity`
  - Envía `cvv`, `last4Digits`, `cardHolderName`
  - Alineado con cambios del backend (no guarda CVV)
  - Debug logs para troubleshooting

### v1.0.0 (2025-10-30) - Lanzamiento Inicial

#### 🚀 Sistema Completo
- Implementación completa de flujo de pagos en 4 pasos
- Integración con backend NestJS
- Soporte para Stripe, PayPal y Webpay
- Auto-formateo inteligente de campos
- Validación en tiempo real
- HTTPS con certificados SSL
- Headers de seguridad (x-session-id, x-user-id)
- Diseño responsivo y moderno
- Gestión de estados de carga y errores

**📋 Ver historial completo de cambios:** [CHANGELOG.md](./CHANGELOG.md)

## �‍💻 Repositorios

- **GitHub Backend:** [@DanteChavez/IntegracionBack](https://github.com/DanteChavez/IntegracionBack)
- **GitHub Frontend:** [@DanteChavez/IntegracionFront](https://github.com/DanteChavez/IntegracionFront)

---