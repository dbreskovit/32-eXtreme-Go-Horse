/**
 * Modo de apresentação: quando ligado, o app roda 100% no navegador,
 * com os dados persistidos em localStorage (sem backend).
 *
 * Liga por padrão. Para usar a API real (NestJS), defina VITE_MOCK=false no .env
 * ou rode `localStorage.setItem('fg_mock', 'off')` no console.
 */
export const USE_MOCK: boolean = (() => {
  const env = (import.meta.env.VITE_MOCK as string | undefined)?.toLowerCase()
  if (env === 'false' || env === 'off' || env === '0') return false

  try {
    const override = localStorage.getItem('fg_mock')
    if (override === 'off') return false
    if (override === 'on') return true
  } catch {
    /* SSR / sem localStorage */
  }
  return true
})()
