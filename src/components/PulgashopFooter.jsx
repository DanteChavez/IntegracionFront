import React from "react";
import "./PulgashopFooter.css";

export default function PulgashopFooter() {
  return (
    <footer className="ps-footer">
      <div className="ps-footer-container">
        <div className="ps-grid">
          {/* Exclusivo */}
          <div className="ps-space-y-4">
            <h3 className="font-medium text-lg">Exclusivo</h3>
            <div className="ps-space-y-3">
              <h4 className="font-medium">Suscribirse</h4>
              <p className="ps-text-sm">
                Obtén 10% de descuento en tu primer pedido
              </p>
              <div style={{ display: "flex" }}>
                <input
                  type="email"
                  placeholder="Ingresa tu email"
                  className="ps-input"
                />
                <button className="ps-button">
                  <span className="text-sm">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Soporte */}
          <div className="ps-space-y-4">
            <h3 className="font-medium text-lg">Soporte</h3>
            <div className="ps-space-y-2 ps-text-sm">
              <p>
                Calle Principal 123, Ciudad,
                <br />
                CP 12345, España.
              </p>
              <p>soporte@pulgashop.com</p>
              <p>+34-900-123-456</p>
            </div>
          </div>

          {/* Cuenta */}
          <div className="ps-space-y-4">
            <h3 className="font-medium text-lg">Cuenta</h3>
            <div className="ps-space-y-2 ps-text-sm">
              <a href="#" className="block">
                Mi Cuenta
              </a>
              <a href="#" className="block">
                Iniciar Sesión / Registro
              </a>
              <a href="#" className="block">
                Carrito
              </a>
              <a href="#" className="block">
                Lista de Deseos
              </a>
              <a href="#" className="block">
                Tienda
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className="ps-space-y-4">
            <h3 className="font-medium text-lg">Enlaces Rápidos</h3>
            <div className="ps-space-y-2 ps-text-sm">
              <a href="#" className="block">
                Política de Privacidad
              </a>
              <a href="#" className="block">
                Términos de Uso
              </a>
              <a href="#" className="block">
                Preguntas Frecuentes
              </a>
              <a href="#" className="block">
                Contacto
              </a>
            </div>
          </div>

          {/* Descargar App */}
          <div className="ps-space-y-4">
            <h3 className="font-medium text-lg">Descargar App</h3>
            <div className="ps-space-y-3">
              <p className="ps-text-xs">
                Ahorra €3 solo para nuevos usuarios de la app
              </p>

              <div style={{ display: "flex", gap: "8px" }}>
                <div className="ps-box">
                  <div className="ps-inner-box" />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div className="ps-rect">Google Play</div>
                  <div className="ps-rect">App Store</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", paddingTop: "8px" }}>
                <div className="ps-icon" />
                <div className="ps-icon" />
                <div className="ps-icon" />
                <div className="ps-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
