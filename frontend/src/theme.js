const BUSINESS_TYPES = [
  'barber',
  'salon',
  'spa',
  'tattoo',
  'massage',
  'fitness',
  'nails',
  'electrician',
  'plumber',
]

export function getAvailableBusinessTypes() {
  return BUSINESS_TYPES
}

export function getThemeClassFor(businessType) {
  const safe = (businessType || '').toLowerCase()
  return BUSINESS_TYPES.includes(safe) ? `theme-${safe}` : 'theme-default'
}

const STORAGE_KEY = 'bookyobiz_business_type'

export function loadSelectedBusinessType() {
  // Priority: URL ?type= > localStorage > default
  try {
    const sp = new URLSearchParams(window.location.search)
    const fromUrl = sp.get('type')
    if (fromUrl && BUSINESS_TYPES.includes(fromUrl.toLowerCase())) {
      return fromUrl.toLowerCase()
    }
    const v = localStorage.getItem(STORAGE_KEY)
    return v || 'barber'
  } catch (_) {
    return 'barber'
  }
}

export function saveSelectedBusinessType(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
    // Update URL query param without adding history entries
    const url = new URL(window.location.href)
    url.searchParams.set('type', value)
    window.history.replaceState({}, '', url)
  } catch (_) {
    // ignore
  }
}


