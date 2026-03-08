# Decisiones de Arquitectura

Este documento explica las decisiones técnicas y arquitectónicas clave del proyecto SeeTheNumbers.

---

## Arquitectura General

### Monorepo con npm workspaces

**Decisión:** Usar npm workspaces en lugar de Turborepo o Nx.

**Razón:**
- Para un MVP con solo 2 aplicaciones sin código compartido, npm workspaces es suficiente
- Menor complejidad y overhead de configuración
- Fácil de migrar a Turborepo/Nx más adelante si es necesario

---

## Backend (API)

### Modular Monolith

**Decisión:** Estructura modular por dominio en lugar de carpetas genéricas (controllers/, models/, etc.).

**Razón:**
- Cada módulo (`services`, `products`, `dashboard`, `insights`) es autónomo
- Fácil de navegar: todo lo relacionado con un dominio está en un solo lugar
- Preparado para extraer a microservicios si fuera necesario
- Evita el "spaghetti code" típico de proyectos Express mal estructurados

### Capas por módulo (Vertical Slices)

Cada módulo sigue esta estructura:

```
modules/<module>/
├── domain/            # Entidades y lógica de negocio pura
├── application/       # Casos de uso (orquestación)
├── infrastructure/    # Mongoose, repositorios, persistencia
└── presentation/      # Controllers, routes, DTOs
```

**Razón:**
- **domain:** Lógica de negocio pura, sin dependencias de frameworks. Fácilmente testeable.
- **application:** Casos de uso que orquestan la lógica. Separa "qué hace la app" de "cómo lo hace".
- **infrastructure:** Aísla Mongoose del resto. Facilita cambiar a otro ORM/DB.
- **presentation:** Separa HTTP/Express de la lógica. Controllers delgados.

### Repository Pattern

**Decisión:** Usar repositorios para acceder a MongoDB en lugar de llamar directamente a Mongoose.

**Razón:**
- Aísla la lógica de acceso a datos
- Facilita testing (mock del repositorio)
- Permite cambiar la implementación de persistencia sin afectar casos de uso

### Cálculos Derivados

**Decisión:** Nunca persistir `costTotal`, `profit`, `marginPercent` en la base de datos.

**Razón:**
- Estos valores se calculan siempre en la capa de dominio (`service.calculations.ts`)
- Evita inconsistencias si se actualiza un `costItem` y no se recalcula el total
- Mantiene la DB normalizada
- Los cálculos son baratos (O(n) donde n = número de cost items)

**Cómo funciona:**
1. Se obtiene la entidad desde el repositorio
2. Se enriquece con cálculos en la capa de aplicación antes de devolverla
3. El cliente recibe siempre datos consistentes

### Validación con Zod

**Decisión:** Usar Zod tanto en la API como en el frontend.

**Razón:**
- Type-safety: los tipos TypeScript se infieren automáticamente
- Runtime validation robusta
- Esquemas duplicados en API y frontend (no compartidos) porque:
  - Frontend: validación de formularios, UX
  - Backend: validación de entrada HTTP, seguridad
  - Evita acoplar ambas capas

### Error Handling

**Decisión:** Clases de error personalizadas (`AppError`, `NotFoundError`, etc.) y middleware centralizado.

**Razón:**
- Manejo consistente de errores en toda la API
- Respuestas HTTP claras y estructuradas
- Fácil logging y debugging

---

## Frontend (Web)

### Next.js App Router

**Decisión:** Usar App Router en lugar de Pages Router.

**Razón:**
- Server Components por defecto (mejor performance)
- Layouts anidados más ergonómicos
- Es la dirección futura de Next.js

### Estructura por Feature Modules

Similar al backend, el frontend está organizado por módulos:

```
modules/<module>/
├── api/           # Fetch wrappers
├── hooks/         # React Query hooks
├── schemas/       # Zod validation
├── types/         # TypeScript types
└── components/    # Componentes del módulo
```

**Razón:**
- Todo lo relacionado con "Services" está en un solo lugar
- Fácil de encontrar y modificar
- Escalable: agregar un módulo nuevo no afecta a los existentes

### TanStack Query (React Query)

**Decisión:** Usar TanStack Query para gestión de estado del servidor.

**Razón:**
- Cache inteligente out-of-the-box
- Invalidación automática de queries
- Loading, error states manejados elegantemente
- Mutaciones optimistas fáciles de implementar

### shadcn/ui

**Decisión:** Usar shadcn/ui en lugar de una librería de componentes tradicional.

**Razón:**
- No es una dependencia: los componentes se copian al proyecto
- Full control sobre estilos y comportamiento
- Basado en Radix UI (accesibilidad incluida)
- Tailwind CSS integration nativa

### CSS Variables para Theming

**Decisión:** Usar CSS custom properties en lugar de hardcodear colores en componentes.

**Razón:**
- Dark mode implementado con una sola línea: `<html class="dark">`
- Tokens semánticos (`--foreground`, `--background`, etc.)
- Fácil cambiar toda la paleta desde `globals.css`
- Mantenible a largo plazo

### Paleta Neutra Cálida

**Decisión:** Diseño visual basado en tonos beige/crema/marrones suaves en lugar de grises fríos.

**Razón:**
- Alineado con el público objetivo (pequeños negocios de servicios)
- Sensación cálida, profesional, no corporativa
- Diferenciación visual respecto a dashboards genéricos

---

## Decisiones de Negocio

### Cálculos en Tiempo Real

**Decisión:** Calcular métricas en cada request en lugar de almacenarlas.

**Razón:**
- Siempre reflejan el estado actual
- No hay jobs de recalculación periódicos
- Simplicidad de implementación

**Trade-off aceptado:** Si en el futuro hay cientos de miles de servicios/productos, podría ser necesario pre-calcular y cachear. Para un MVP de pequeño negocio, no es un problema.

### Insights Determinísticos

**Decisión:** Reglas de negocio simples en lugar de modelos de ML/IA.

**Razón:**
- El MVP debe ser entendible y predecible
- No requiere datos históricos ni training
- Fácil de ajustar (solo cambiar thresholds)
- Los insights son útiles desde el día 1

**Futuro:** Con datos históricos, se pueden agregar modelos predictivos (forecasting de demanda, detección de anomalías, etc.)

### Sin Autenticación en MVP

**Decisión:** No implementar auth ni multi-tenancy en esta versión.

**Razón:**
- Enfoque en valor de negocio primero
- Permite iterar más rápido
- Fácil de agregar después (JWT + guards en rutas)

---

## Decisiones Técnicas Específicas

### Formato de Moneda

**Decisión:** ARS (Peso Argentino) con formato `es-AR`.

**Razón:**
- El proyecto menciona AFIP (contexto argentino)
- `Intl.NumberFormat` hace que sea fácil cambiar a otra moneda/locale después

### Margen Badges

**Decisión:** Colores pastel (verde/amarillo/rojo) en lugar de colores saturados.

**Razón:**
- Más suaves visualmente, especialmente en modo claro
- Mantienen legibilidad en dark mode
- Alineados con la estética cálida del diseño

### Stock Handling

**Decisión:** Stock puede ser 0 (no bloqueado).

**Razón:**
- Un producto puede estar agotado pero seguir en catálogo
- `stockMinimum` es opcional: no todos los productos requieren reposición automática

---

## Trade-offs Conscientes

| Decisión | Trade-off |
|----------|-----------|
| Cálculos en tiempo real | Performance si hay muchos registros (aceptable para MVP) |
| Sin paginación | No escala a miles de items (se agregará después) |
| Schemas duplicados (API + frontend) | Más código, pero mejor separación de concerns |
| Sin soft-delete | Usar `isActive` en lugar de borrar (más simple, suficiente para MVP) |
| Sin tests | MVP prioriza funcionalidad. Tests se agregan en siguiente fase |

---

## Extensibilidad

### ¿Cómo agregar un nuevo módulo?

**Backend:**
1. Crear `apps/api/src/modules/new-module/`
2. Seguir estructura: `domain/`, `application/`, `infrastructure/`, `presentation/`
3. Registrar routes en `app.ts`

**Frontend:**
1. Crear `apps/web/src/modules/new-module/`
2. Seguir estructura: `api/`, `hooks/`, `schemas/`, `types/`, `components/`
3. Crear páginas en `apps/web/src/app/new-module/`

### ¿Cómo agregar autenticación?

1. Agregar módulo `auth` en API con JWT
2. Middleware de autenticación en rutas protegidas
3. Provider de auth en frontend
4. Guards en navegación de Next.js

### ¿Cómo hacer multi-tenant?

1. Agregar campo `businessId` a todas las colecciones
2. Filtrar queries por `businessId` en repositorios
3. Extraer `businessId` del JWT en middleware
4. Interfaz para cambiar de negocio

---

## Herramientas de Desarrollo

- **TypeScript strict mode:** Máxima type-safety
- **ESLint:** Code style consistency
- **Prettier:** (recomendado agregar)
- **Husky + lint-staged:** (recomendado agregar)

---

## Performance Considerations

### Backend
- Mongoose lean queries donde sea posible (`.lean()`)
- Índices en campos frecuentemente buscados (`name`, `isActive`)
- Proyecciones para evitar cargar campos innecesarios

### Frontend
- Server Components para páginas que no requieren interactividad
- Client Components solo donde se necesita estado o eventos
- TanStack Query cache evita llamadas redundantes
- Next.js Image optimization automática

---

## Seguridad

### Implementado
- Validación robusta con Zod
- Error handling sin exponer stack traces en producción
- CORS configurado

### Pendiente para Producción
- Rate limiting
- Helmet.js para headers de seguridad
- Input sanitization contra XSS/injection
- HTTPS en producción
- Auth + JWT con refresh tokens

---

## Conclusión

Esta arquitectura prioriza:
1. **Claridad:** Es fácil entender dónde está cada cosa
2. **Mantenibilidad:** Agregar features no rompe código existente
3. **Escalabilidad:** Preparado para crecer sin reescritura
4. **Pragmatismo:** No over-engineering, pero con bases sólidas

El MVP está listo para presentar a usuarios reales y validar el valor de negocio. Las mejoras técnicas (tests, auth, performance) se agregarán iterativamente basándose en feedback.
