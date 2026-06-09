export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function formatPoints(points: number): string {
  return new Intl.NumberFormat('pt-BR').format(points) + ' pts'
}

export function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pendente: 'Aguardando confirmação',
    confirmado: 'Confirmado',
    preparando: 'Preparando',
    saiu: 'Saiu para entrega',
    saiu_para_entrega: 'Saiu para entrega',
    entregue: 'Entregue',
    cancelado: 'Cancelado',
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pendente: '#B5581E',
    confirmado: '#2563EB',
    preparando: '#D97706',
    saiu: '#7C3AED',
    saiu_para_entrega: '#7C3AED',
    entregue: '#5C7A2C',
    cancelado: '#8B2323',
  }
  return map[status] || '#6B6B6B'
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateString))
}

export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(dateString))
}

// ─── TIER SYSTEM ────────────────────────────────────────────
export type Tier = { name: string; color: string; bg: string; icon: string; min: number; max: number; multiplier: number; next: number | null }

export const TIERS: Tier[] = [
  { name: 'Bronze',   color: '#CD7F32', bg: 'rgba(205,127,50,0.12)',  icon: '🥉', min: 0,     max: 4999,  multiplier: 1.0, next: 5000  },
  { name: 'Prata',    color: '#9E9E9E', bg: 'rgba(158,158,158,0.12)', icon: '🥈', min: 5000,  max: 14999, multiplier: 1.25, next: 15000 },
  { name: 'Ouro',     color: '#FFD700', bg: 'rgba(255,215,0,0.12)',   icon: '🥇', min: 15000, max: 29999, multiplier: 1.5,  next: 30000 },
  { name: 'Diamante', color: '#00BFFF', bg: 'rgba(0,191,255,0.12)',   icon: '💎', min: 30000, max: Infinity, multiplier: 2.0, next: null },
]

export function getTier(points: number): Tier {
  return TIERS.find(t => points >= t.min && points <= t.max) || TIERS[0]
}

export function getTierProgress(points: number): number {
  const tier = getTier(points)
  if (!tier.next) return 100
  const range = tier.next - tier.min
  const progress = points - tier.min
  return Math.min(Math.round((progress / range) * 100), 100)
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
