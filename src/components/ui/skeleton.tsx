/**
 * Componente Skeleton (Shadcn/ui).
 *
 * Placeholder animado que se muestra mientras los datos cargan.
 * Usa una animación de "pulse" que va de opaco a semi-transparente.
 *
 * Se combina con otras clases de Tailwind para simular la forma
 * del contenido real (altura, ancho, border-radius). Por ejemplo:
 *   <Skeleton className="h-20 w-full rounded-xl" /> → simula una card
 *   <Skeleton className="h-8 w-64" /> → simula un título
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('animate-pulse rounded-md bg-stone-200/70', className)}
        {...props}
      />
    )
  }
)
Skeleton.displayName = 'Skeleton'

export { Skeleton }
