export function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export function getNumber(formData: FormData, key: string): number | undefined {
  const value = formData.get(key);
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }
  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
}
