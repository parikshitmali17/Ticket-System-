/** Category badge colors — meaning-based palette */
export const CATEGORY_STYLES = {
  // Blue — systems, tech, trust
  Technical: 'bg-blue-100 text-blue-800',
  // Amber/gold — money, invoices, value
  Billing: 'bg-amber-100 text-amber-800',
  // Violet — identity, access, personal security
  Account: 'bg-violet-100 text-violet-800',
  // Teal — neutral catch-all, calm how-to
  General: 'bg-teal-100 text-teal-800',
}

export const CATEGORIES = ['Technical', 'Billing', 'Account', 'General']

export function categoryBadgeClass(category) {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.General
}
