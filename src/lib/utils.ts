/**
 * Utilidad para combinar clases de Tailwind sin conflictos.
 *
 * clsx junta condicionalmente varias clases, y twMerge se encarga
 * de resolver conflictos cuando dos clases intentan modificar la
 * misma propiedad CSS (ej: "px-4" vs "px-6"). Sin twMerge, la
 * última clase gana siempre, pero con merge se resuelve bien.
 *
 * Es el estándar en proyectos con Shadcn/ui y Tailwind.
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
