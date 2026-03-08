# SeeTheNumbers - POS System

[🇪🇸 Español](#-español) | [🇬🇧 English](#-english)

---

## 🇪🇸 Español

**Sistema de Punto de Venta (POS) local-first diseñado para pequeños negocios (veterinarias, petshops, peluquerías caninas) con enfoque en el control de inventario y el cálculo real de márgenes.**

### ¿Qué es SeeTheNumbers?
SeeTheNumbers no es solo una caja registradora. Es un sistema integral de gestión comercial que permite:
- **Control de Inventario**: Seguimiento de stock en tiempo real y alertas de bajo stock.
- **Cálculo de Rentabilidad**: Calcula automáticamente costos y márgenes de productos y servicios.
- **Punto de Venta Rápido**: Interfaz optimizada (atajos de teclado, lector de código de barras) para facturar en segundos.
- **Facturación PDF**: Generación automática de comprobantes.
- **Insights**: Datos sobre productos más vendidos, stock crítico y rendimiento.

> ⚠️ **Nota**: Esta es una aplicación orientada a escritorio/local. No requiere conexión a internet constante para funcionar de manera óptima.

### Tecnologías Principales
- **Monorepo**: npm workspaces
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui, TanStack Query.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Arquitectura Modular por Dominios.
- **Desktop**: Electron (En desarrollo).

### Guía Rápida de Desarrollo

```bash
# 1. Clonar e instalar
git clone <repo-url>
cd See-The-Numbers
npm install

# 2. Base de datos (Requiere MongoDB o Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 3. Cargar datos de prueba
npm run seed

# 4. Iniciar sistema completo (API + Web)
npm run dev

# Limpiar datos del negocio (productos/categorías/ventas/etc.)
npm run db:reset
```
* **Web**: `http://localhost:3000`
* **API**: `http://localhost:4000`

---

## 🇬🇧 English

**A local-first Point of Sale (POS) system designed for small businesses (veterinary clinics, pet shops, dog grooming) focusing on inventory control and real margin calculation.**

### What is SeeTheNumbers?
SeeTheNumbers is more than a cash register. It's a comprehensive business management system that provides:
- **Inventory Control**: Real-time stock tracking and low-stock alerts.
- **Profitability Calculation**: Automatically calculates costs and profit margins for products and services.
- **Fast POS**: Optimized interface (keyboard shortcuts, barcode scanner support) to check out customers in seconds.
- **PDF Invoicing**: Automatic receipt generation.
- **Insights**: Data on top-selling products, critical stock levels, and performance.

> ⚠️ **Note**: This is a desktop/local-oriented application. It does not require a constant internet connection to function optimally.

### Main Tech Stack
- **Monorepo**: npm workspaces
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui, TanStack Query.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Modular Domain-Driven Architecture.
- **Desktop**: Electron (In development).

### Quick Start (Development)

```bash
# 1. Clone and install
git clone <repo-url>
cd See-The-Numbers
npm install

# 2. Database (Requires MongoDB or Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 3. Load dummy data
npm run seed

# 4. Start full system (API + Web)
npm run dev

# Clean business data (products/categories/sales/etc.)
npm run db:reset
```
* **Web**: `http://localhost:3000`
* **API**: `http://localhost:4000`

---

## Funcionalidades MVP v1.0.0

### Implementadas

- [x] **Punto de Venta (POS)**: Carrito con productos y servicios, descuentos por linea y por carrito, seleccion de metodo de pago, alias de cliente
- [x] **Atajos de teclado**: F2 para enfocar campo de codigo de barras, F9 para confirmar venta
- [x] **Modo kiosco**: Pantalla completa para uso en caja
- [x] **Gestion de stock**: Recarga de inventario, ajuste manual, historial de movimientos (IN/OUT/ADJUSTMENT)
- [x] **Importacion CSV/Excel**: Preview con deteccion de SKU existentes, confirmacion selectiva de reemplazos, soporte de headers en espanol e ingles
- [x] **Facturacion PDF**: Generacion de comprobante descargable por venta
- [x] **Productos**: CRUD con codigo de barras, SKU, proveedor, laboratorio, costo, precio, cantidad, stock minimo
- [x] **Servicios**: CRUD con items de costo y calculo de margen automatico
- [x] **Dashboard**: Resumen de ventas, productos, servicios y alertas de stock bajo
- [x] **Insights**: Analisis de negocio con reglas de productos mas vendidos, stock critico, margenes
- [x] **Metodos de pago**: CRUD con ordenamiento y activacion/desactivacion
- [x] **Branding**: Nombre de tienda e imagen personalizable en sidebar
- [x] **Soft delete**: Productos y servicios se desactivan en lugar de eliminarse
- [x] **App de escritorio**: Electron con menu nativo y auto-inicio de API/Web

### Roadmap / TODO

- [ ] **Clientes CRM**: Historial de compras por cliente, datos de contacto
- [ ] **Reportes avanzados**: Graficos de ventas por dia/semana/mes, exportacion a Excel
- [ ] **Multi-sucursal**: Soporte para multiples puntos de venta
- [ ] **Sincronizacion cloud**: Backup y sync opcional a servidor remoto
- [ ] **Facturacion electronica**: Integracion con AFIP/SRI/SAT segun pais
- [ ] **Modo offline**: Cache local con sincronizacion al reconectar
- [ ] **Escaner automatico**: Auto-disparo sin Enter, debounce de lectura rapida
- [ ] **Temas oscuro/claro**: Toggle de tema en la app
- [ ] **Notificaciones push**: Alertas de stock bajo en tiempo real
- [ ] **App movil**: Version PWA o React Native para consultas rapidas

---

## Empaquetado Desktop (v1.0.0)

El empaquetado esta configurado en `apps/desktop/package.json` (bloque `build`) con **electron-builder**.

Comandos:

```bash
# macOS (genera .dmg)
npm run build:mac --workspace=apps/desktop

# Windows (genera instalador .exe NSIS)
npm run build:win --workspace=apps/desktop

# Output sin instalador (carpeta unpacked)
npm run build --workspace=apps/desktop
```

Salida de artefactos:
- `apps/desktop/dist/`

---

## Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## Licencia / License
MIT
