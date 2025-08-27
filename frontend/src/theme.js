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
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v || 'barber'
  } catch (_) {
    return 'barber'
  }
}

export function saveSelectedBusinessType(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch (_) {
    // ignore
  }
}


