export function formatCentimesToEuro(centimes: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(centimes / 100);
}

export function formatTimeAgo(dateIso: string): string {
  const diffSec = Math.floor((Date.now() - new Date(dateIso).getTime()) / 1000);
  if (diffSec < 60) return `Il y a ${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  return `Il y a ${diffHours}h`;
}

export function formatDateTimeFr(dateIso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'medium'
  }).format(new Date(dateIso));
}

export function getStatusBadgeColor(statut: string): { bg: string; text: string; border: string } {
  switch (statut) {
    case 'RECOLTEE':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };
    case 'EN_PREPARATION':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' };
    case 'PRETE':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'REMISE':
      return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' };
    case 'ANNULEE':
      return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' };
    case 'SYNCED':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'PENDING':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };
    case 'FAILED':
      return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' };
    default:
      return { bg: 'bg-slate-700/50', text: 'text-slate-300', border: 'border-slate-600' };
  }
}
