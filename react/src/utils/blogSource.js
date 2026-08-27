// Maps the hostnames of the RSS feeds import:blogs pulls from to a clean display
// name. Falls back to a title-cased hostname for anything not in this list, so a
// new/unrecognized source still renders sensibly instead of a raw URL.
const KNOWN_SOURCES = {
  'fr.hespress.com': 'Hespress Français',
  'www.lavieeco.com': 'La Vie Éco',
  'www.lesiteinfo.com': 'LeSiteInfo',
  'leseco.ma': 'LesEco.ma',
}

export const getBlogSourceName = (externalSourceUrl) => {
  if (!externalSourceUrl) return null

  try {
    const hostname = new URL(externalSourceUrl).hostname
    if (KNOWN_SOURCES[hostname]) return KNOWN_SOURCES[hostname]

    return hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}
