import { z } from 'zod'

export const normalizeName = (name: string): string => {
  return name.trim().replace(/\s+/g, ' ')
}

export const createFullNameValidation = (
  fieldName: string,
  maxLength: number = 50,
) => {
  return z
    .string({ message: `O ${fieldName} é obrigatório` })
    .min(1, `O ${fieldName} é obrigatório`)
    .max(maxLength, `O ${fieldName} deve ter no máximo ${maxLength} caracteres`)
    .transform(normalizeName)
    .refine((name) => {
      const words = name.split(' ').filter((word) => word.length > 0)
      return words.length >= 2
    }, `O ${fieldName} deve conter nome e sobrenome`)
    .refine((name) => {
      const words = name.split(' ').filter((word) => word.length > 0)
      return words.some((word) => word.length >= 3)
    }, `O ${fieldName} deve conter pelo menos um nome com 3 ou mais letras`)
}

export const createEntityNameValidation = (
  fieldName: string,
  maxLength: number = 100,
  minUsefulChars: number = 5,
) => {
  return z
    .string({ message: `O ${fieldName} é obrigatório` })
    .min(1, `O ${fieldName} é obrigatório`)
    .max(maxLength, `O ${fieldName} deve ter no máximo ${maxLength} caracteres`)
    .transform(normalizeName)
    .refine((name) => {
      const withoutSpaces = name.replace(/\s/g, '')
      return withoutSpaces.length >= minUsefulChars
    }, `O ${fieldName} deve ter no mínimo ${minUsefulChars} caracteres úteis`)
}

export const createEmailValidation = (
  fieldName: string,
  maxLength: number = 100,
) => {
  return z
    .string({ message: `O ${fieldName} é obrigatório` })
    .email(`O ${fieldName} é inválido`)
    .max(maxLength, `O ${fieldName} deve ter no máximo ${maxLength} caracteres`)
}
