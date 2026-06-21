/**
 * Componente RadioGroup (Shadcn/ui adaptado).
 *
 * Grupo de radio buttons estilizados para las opciones de recepción
 * (opciones 1 a 4). Cada opción se renderiza como un label clickeable
 * con borde que cambia de estilo al seleccionarse.
 *
 * La lógica usa React Context para compartir el estado entre el grupo
 * y sus items. A diferencia del radio estándar, soporta deselección
 * (hacer click en el mismo item para limpiar la selección).
 *
 * El CSS usa `has-[:checked]` en lugar de `peer-checked` porque el
 * label es el contenedor del radio, no un elemento hermano.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ─── Contexto interno: comparte estado entre RadioGroup y RadioGroupItem ───

interface RadioGroupContextValue {
  /** Valor actualmente seleccionado */
  value: string
  /** Callback cuando cambia la selección (recibe el nuevo valor o '' si deselecciona) */
  onValueChange: (value: string) => void
  /** Nombre compartido para agrupar los radios nativamente */
  name: string
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null)

function useRadioGroup(): RadioGroupContextValue {
  const ctx = React.useContext(RadioGroupContext)
  if (!ctx) {
    throw new Error('RadioGroupItem debe usarse dentro de un RadioGroup')
  }
  return ctx
}

// ─── RadioGroup ───

interface RadioGroupProps {
  /** Valor actualmente seleccionado */
  value?: string
  /** Callback cuando cambia la selección */
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ value = '', onValueChange, className, children }, ref) => {
    // Generamos un nombre único y estable para este grupo (sirve para name del input)
    const nameRef = React.useRef(`radio-${Math.random().toString(36).slice(2, 9)}`)

    return (
      <RadioGroupContext.Provider
        value={{
          value,
          onValueChange: onValueChange ?? (() => {}),
          name: nameRef.current,
        }}
      >
        <div
          ref={ref}
          className={cn('grid gap-3', className)}
          role="radiogroup"
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'

// ─── RadioGroupItem ───

interface RadioGroupItemProps {
  /** Valor que representa este item */
  value: string
  /** ID para el label nativo (se genera automáticamente si no se pasa) */
  id?: string
  className?: string
  children?: React.ReactNode
}

function RadioGroupItem({ value, id, className, children }: RadioGroupItemProps) {
  const ctx = useRadioGroup()
  const isChecked = value === ctx.value
  const itemId = id ?? `${ctx.name}-${value}`

  /**
   * Maneja el click sobre el input radio.
   *
   * Como el label tiene htmlFor, el browser redirige el click al input.
   * Ahí manejamos la lógica de selección/deselección.
   *
   * No usamos onChange porque no se dispara al clickear el mismo radio
   * ya seleccionado (comportamiento nativo del type="radio").
   * onChange es un no-op solo para que React no se queje de tener un
   * input controlado sin onChange.
   */
  const handleInputClick = () => {
    if (isChecked) {
      ctx.onValueChange('')
    } else {
      ctx.onValueChange(value)
    }
  }

  return (
    <label
      htmlFor={itemId}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-lg border border-stone-200 p-4 transition-colors hover:border-stone-400 has-[:checked]:border-stone-900 has-[:checked]:bg-stone-50',
        className
      )}
    >
      {/* Círculo del radio button con indicador de selección */}
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-stone-400 has-[:checked]:border-stone-900 has-[:checked]:bg-stone-900">
        <input
          type="radio"
          name={ctx.name}
          value={value}
          id={itemId}
          checked={isChecked}
          onChange={() => {}}
          onClick={handleInputClick}
          className="peer sr-only"
        />
        {/* Punto blanco que aparece cuando está seleccionado */}
        <div className="hidden h-2.5 w-2.5 rounded-full bg-white peer-checked:block" />
      </div>
      <div className="flex-1">{children}</div>
    </label>
  )
}

export { RadioGroup, RadioGroupItem }
