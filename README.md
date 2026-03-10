# SeeTheNumbers - Smart POS & Inventory System

[🇪🇸 Español](#-español) | [🇬🇧 English](#-english)

---

## 🇪🇸 Español

### 🚀 Tu negocio, bajo control.
**SeeTheNumbers** es un sistema de Punto de Venta (POS) de alto rendimiento diseñado específicamente para pequeños negocios (veterinarias, petshops, farmacias) que necesitan profesionalizar su gestión sin complicaciones.

A diferencia de las cajas registradoras tradicionales, SeeTheNumbers se enfoca en lo que realmente importa: **ver los números reales de tu negocio**.

#### ✨ Características Principales
- **Punto de Venta Inteligente**: Interfaz ultra rápida con soporte para lectores de códigos de barras y atajos de teclado (F2 para escanear, F9 para cobrar).
- **Control de Inventario Real**: Gestión de stock con historial de movimientos (entradas, salidas, ajustes) y alertas de stock bajo.
- **Cálculo de Márgenes Automático**: Define tus costos y deja que el sistema calcule tu rentabilidad real por cada producto o servicio vendido.
- **Importación Masiva Inteligente**: Sube miles de productos desde Excel/CSV con detección automática de SKUs duplicados y normalización de precios.
- **Facturación PDF**: Genera comprobantes profesionales al instante para tus clientes.
- **Local-First & Desktop Ready**: Ejecútalo localmente en tu PC sin depender 100% de la nube.

#### 🛠️ Stack Tecnológico
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui.
- **Estado del Servidor**: TanStack Query (React Query) para una UI fluida.
- **Backend**: Node.js & Express con arquitectura de **Modular Monolith**.
- **Base de Datos**: MongoDB (Mongoose) con validación robusta vía Zod.
- **Desktop**: Electron para una experiencia nativa de escritorio.

#### 🏗️ Arquitectura
El proyecto utiliza un patrón de **Vertical Slices** y arquitectura modular. Cada dominio (`products`, `sales`, `categories`, etc.) es independiente y contiene sus propias capas de:
1. **Domain**: Entidades y lógica de negocio pura.
2. **Application**: Casos de uso y orquestación.
3. **Infrastructure**: Repositorios y esquemas de base de datos.
4. **Presentation**: Controladores y rutas de la API.

---

### 📥 Cómo levantarlo (Setup)

#### Requisitos
- Node.js 18+
- MongoDB (Local o vía Docker)

#### Instalación rápida
```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd See-The-Numbers

# 2. Instalar dependencias
npm install

# 3. Levantar base de datos (si usas Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 4. Cargar datos de prueba (Opcional)
npm run seed

# 5. Iniciar el sistema (API + Web)
npm run dev
```

> 🖥️ **Modo Escritorio**: Para ejecutar la versión nativa de Electron: `npm run dev:desktop`

#### Comandos Útiles
- `npm run db:reset`: Limpia la base de datos (ideal para pruebas).
- `npm run seed`: Carga el catálogo de prueba con más de 170 productos.
- `npm run build`: Genera los bundles de producción.

---

## 🇬🇧 English

### 🚀 Your business, under control.
**SeeTheNumbers** is a high-performance Point of Sale (POS) system specifically designed for small businesses (veterinary clinics, pet shops, pharmacies) that need to professionalize their management without the hassle.

Unlike traditional cash registers, SeeTheNumbers focuses on what truly matters: **seeing your business's real numbers**.

#### ✨ Key Features
- **Smart POS**: Ultra-fast interface with barcode scanner support and keyboard shortcuts (F2 to scan, F9 to checkout).
- **Real Inventory Control**: Stock management with movement history (IN, OUT, ADJUSTMENT) and low-stock alerts.
- **Automatic Margin Calculation**: Set your costs and let the system calculate your real profitability for every product or service sold.
- **Smart Bulk Import**: Upload thousands of products from Excel/CSV with automatic duplicate SKU detection and price normalization.
- **PDF Invoicing**: Generate professional receipts instantly for your customers.
- **Local-First & Desktop Ready**: Run it locally on your PC without being 100% dependent on the cloud.

#### 🛠️ Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui.
- **Server State**: TanStack Query (React Query) for a seamless UI.
- **Backend**: Node.js & Express using a **Modular Monolith** architecture.
- **Database**: MongoDB (Mongoose) with robust validation via Zod.
- **Desktop**: Electron for a native desktop experience.

#### 🏗️ Architecture
The project follows a **Vertical Slices** pattern and modular architecture. Each domain (`products`, `sales`, `categories`, etc.) is independent and contains its own layers:
1. **Domain**: Entities and pure business logic.
2. **Application**: Use cases and orchestration.
3. **Infrastructure**: Repositories and database schemas.
4. **Presentation**: API controllers and routes.

---

### 📥 Getting Started (Setup)

#### Prerequisites
- Node.js 18+
- MongoDB (Local or via Docker)

#### Quick Installation
```bash
# 1. Clone the repository
git clone <repo-url>
cd See-The-Numbers

# 2. Install dependencies
npm install

# 3. Start database (if using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 4. Load dummy data (Optional)
npm run seed

# 5. Start the system (API + Web)
npm run dev
```

> 🖥️ **Desktop Mode**: To run the native Electron version: `npm run dev:desktop`

#### Useful Commands
- `npm run db:reset`: Clears the database (great for testing).
- `npm run seed`: Loads the test catalog with over 170 products.
- `npm run build`: Generates production bundles.

---

## 📄 License
MIT © 2026 SeeTheNumbers.
