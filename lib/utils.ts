export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatPoints(points: number): string {
  return new Intl.NumberFormat('pt-BR').format(points) + ' pts'
}

export function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pendente: 'Pendente',
    confirmado: 'Confirmado',
    preparando: 'Preparando',
    saiu: 'Saiu para entrega',
    entregue: 'Entregue',
    cancelado: 'Cancelado'
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pendente: 'text-yellow-600 bg-yellow-50',
    confirmado: 'text-blue-600 bg-blue-50',
    preparando: 'text-orange-600 bg-orange-50',
    saiu: 'text-purple-600 bg-purple-50',
    entregue: 'text-green-600 bg-green-50',
    cancelado: 'text-red-600 bg-red-50'
  }
  return colors[status] || 'text-gray-600 bg-gray-50'
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
