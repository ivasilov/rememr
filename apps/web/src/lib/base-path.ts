const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '')

export const getBasePath = () => {
  const base = trimSlashes(import.meta.env.BASE_URL)
  return base ? `/${base}` : ''
}

export const getPublicPath = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  return `${import.meta.env.BASE_URL}${normalizedPath}`
}

export const getPublicUrl = (path: string) =>
  new URL(getPublicPath(path), window.location.origin).toString()

export const getSafeReturnTo = (value: string | undefined) => {
  if (!value) {
    return '/bookmarks'
  }

  let returnUrl: URL

  try {
    returnUrl = new URL(value, window.location.origin)
  } catch {
    return '/bookmarks'
  }

  if (returnUrl.origin !== window.location.origin) {
    return '/bookmarks'
  }

  const returnTo = `${returnUrl.pathname}${returnUrl.search}${returnUrl.hash}`
  const basePath = getBasePath()
  if (
    basePath &&
    (returnTo === basePath || returnTo.startsWith(`${basePath}/`))
  ) {
    return returnTo.slice(basePath.length) || '/bookmarks'
  }

  return returnTo
}
