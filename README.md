# PPAI Bolsines — CU 28: Registrar recepción de bolsín

Frontend del **Caso de Uso 28** del TPI de Diseño de Sistemas Informáticos 2026,
Grupo 8. Implementa el registro de recepción de bolsines entre comisiones médicas.

### Stack

- **Vite 6** + React 19 + TypeScript
- **Tailwind CSS v4** (con `@import 'tailwindcss'`)
- **Shadcn/ui** (componentes copiados: Card, Button, Input, Badge, etc.)
- **Zustand** para estado global (autenticación)
- **React Router v7** para navegación
- **Axios** (preparado, actualmente usa mock)

### Estructura del proyecto

```
src/
├── api/             # Servicios mock + adapter para backend real
│   └── mock/        # Datos y lógica mock (data.ts, mockService.ts)
├── components/
│   ├── layout/      # Header, Layout, AuthGuard
│   └── ui/          # Componentes Shadcn/ui (Card, Button, Input, etc.)
├── hooks/           # (preparado para custom hooks)
├── lib/             # Utilidades: cn() para clases Tailwind
├── pages/           # LoginPage, BuscarBolsinPage, DetalleBolsinPage
├── store/           # Zustand: authStore (token, usuario, login/logout)
└── types/           # Interfaces del dominio y constantes (OPCIONES_RECEPCION)
```

### Cómo correrlo

```bash
npm install
npm run dev         # Dev en http://localhost:5173
npm run build       # Build producción en dist/
npm run preview     # Servir build localmente
```

### Mock

Actualmente todo funciona con datos mock en `src/api/mock/`. Cuando el backend
esté listo, se reemplazan las funciones en `src/api/service.ts` por llamadas
axios. El proxy de Vite ya está configurado para redirigir `/api` a
`http://localhost:8080`.

### CU 28 — Flujo cubierto

1. **Login** del Encargado de Bolsines (EB)
2. **Búsqueda** de bolsines en estado "Enviado" para la CM del usuario
3. **Filtros** por número de precinto y/o CM de origen (persisten en la URL)
4. **Detalle** del bolsín: datos generales, remitos, documentación e historial
5. **Selección** de opción de recepción (1 a 4)
6. **Confirmación** previa al registro
7. **Registro** con actualización de estados en bolsín, remitos y documentación

### Flujos alternativos cubiertos

| Código | Situación | Manejo |
|--------|-----------|--------|
| **A1** | Precinto no encontrado | Mensaje de error específico + sugerencia de verificar el número |
| **A2** | CM origen no encontrada | Mensaje de error específico + sugerencia de verificar la selección |
| **A6** | Usuario cancela confirmación | Vuelve al detalle sin cambios, los estados no se modifican |

### Opciones de recepción

| Opción | Descripción | Estado resultante del bolsín |
|--------|-------------|------------------------------|
| 1 | Contenido igual al registrado | Recibido en CM destino |
| 2 | Documentación faltante | Recibido parcial |
| 3 | Documentación no correspondiente | Recibido con observaciones |
| 4 | Redirigir a otra área | Recibido - Pendiente redirección |

### Contrato API

`docs/openapi.yaml` — OpenAPI 3.0 con todos los endpoints y schemas del CU 28.
