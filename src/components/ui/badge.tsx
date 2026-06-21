/**
 * Componente Badge (Shadcn/ui extendido).
 *
 * Pequeña etiqueta para mostrar estados. Agregamos dos variantes que
 * no vienen en Shadcn/ui original: "success" (verde) y "warning" (ámbar),
 * que usamos mucho en la app para los estados de bolsines y documentos.
 *
 * Variantes:
 *   default → badge negro
 *   secondary → gris claro
 *   destructive → rojo
 *   outline → solo borde, transparente
 *   success → verde (custom, para estados "Recibido", "Aceptado")
 *   warning → ámbar (custom, para estados "Enviado", "Pendiente")
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }
>(({ className, variant = 'default', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2',
        {
          'border-transparent bg-stone-900 text-stone-50 shadow': variant === 'default',
          'border-transparent bg-stone-100 text-stone-900': variant === 'secondary',
          'border-transparent bg-red-600 text-stone-50 shadow': variant === 'destructive',
          'text-stone-950': variant === 'outline',
          'border-transparent bg-emerald-100 text-emerald-800': variant === 'success',
          'border-transparent bg-amber-100 text-amber-800': variant === 'warning',
        },
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = 'Badge'

export { Badge }
