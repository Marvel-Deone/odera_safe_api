export function formatPhoneNumber(
  phone: string,
): string {
  const cleaned =
    phone.replace(/\s+/g, '')

  if (
    cleaned.startsWith('0')
  ) {
    return `234${cleaned.slice(1)}`
  }

  if (
    cleaned.startsWith('+234')
  ) {
    return cleaned.replace(
      '+',
      '',
    )
  }

  return cleaned
}