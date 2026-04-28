export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    BODY_CARE: 'Body Care',
    DRY_HAIR: 'Dry Hair Care',
    CURLY_HAIR: 'Curly Hair',
    MASKS: 'Masks',
    SHAMPOOS: 'Shampoos',
    SECRET_BOX: 'Secret Boxes',
  }
  return labels[category] || category
}

export function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    BODY_CARE: 'from-rose-900 via-pink-800 to-rose-700',
    DRY_HAIR: 'from-amber-900 via-yellow-800 to-amber-600',
    CURLY_HAIR: 'from-purple-900 via-violet-800 to-purple-600',
    MASKS: 'from-red-900 via-rose-800 to-red-700',
    SHAMPOOS: 'from-teal-900 via-emerald-800 to-teal-600',
    SECRET_BOX: 'from-yellow-900 via-amber-700 to-yellow-500',
  }
  return gradients[category] || 'from-gray-900 to-gray-700'
}

export function getCategoryBg(category: string): string {
  const bgs: Record<string, string> = {
    BODY_CARE: '#8B1A4A',
    DRY_HAIR: '#8B6914',
    CURLY_HAIR: '#4A1A8B',
    MASKS: '#8B1A1A',
    SHAMPOOS: '#1A6B5A',
    SECRET_BOX: '#8B7314',
  }
  return bgs[category] || '#8B1A4A'
}

export function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    BODY_CARE: '🌸',
    DRY_HAIR: '✨',
    CURLY_HAIR: '🌀',
    MASKS: '🎭',
    SHAMPOOS: '💎',
    SECRET_BOX: '🎁',
  }
  return emojis[category] || '✨'
}
