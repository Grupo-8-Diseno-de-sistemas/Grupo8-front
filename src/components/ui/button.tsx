/**
 * Componente Button (Shadcn/ui).
 *
 * Botón con variantes predefinidas y tamaños. Usa forwardRef para
 * funcionar bien con herramientas de formularios y accesibilidad.
 *
 * Variantes:
 *   default → botón negro principal (fondo oscuro, texto blanco)
 *   destructive → rojo, para acciones destructivas
 *   outline → borde sutil, fondo transparente (el más usado en la app)
 *   secondary → gris claro
 *   ghost → sin bordes ni fondo, solo texto
 *   link → parece un link, no un botón
 *
 * Tamaños: default, sm, lg, icon
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
          {
            'bg-stone-900 text-stone-50 shadow hover:bg-stone-900/90':
              variant === 'default',
            'bg-red-600 text-stone-50 shadow-sm hover:bg-red-600/90':
              variant === 'destructive',
            'border border-stone-200 bg-white shadow-sm hover:bg-stone-100 hover:text-stone-900':
              variant === 'outline',
            'bg-stone-100 text-stone-900 shadow-sm hover:bg-stone-100/80':
              variant === 'secondary',
            'hover:bg-stone-100 hover:text-stone-900': variant === 'ghost',
            'text-stone-900 underline-offset-4 hover:underline': variant === 'link',
          },
          {
            'h-9 px-4 py-2': size === 'default',
            'h-8 rounded-md px-3 text-xs': size === 'sm',
            'h-10 rounded-md px-8': size === 'lg',
            'h-9 w-9': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
