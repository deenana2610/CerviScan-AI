export function cn(...classes: (string | boolean | undefined | null | Record<string, boolean>)[]): string {
  const result: string[] = [];
  for (const item of classes) {
    if (!item) continue;
    if (typeof item === 'string') {
      result.push(item);
    } else if (typeof item === 'object') {
      for (const [key, value] of Object.entries(item)) {
        if (value) result.push(key);
      }
    }
  }
  return result.join(' ');
}

/**
 * Masks patient's full name for HIPAA/PDPA compliance when Privacy Mode is active.
 * E.g., "Nurul Aisyah binti Razak" -> "N**** A***** b**** R****"
 */
export function maskName(fullName: string, isPrivacyActive: boolean): string {
  if (!isPrivacyActive || !fullName) return fullName;
  return fullName
    .split(' ')
    .map((word) => {
      if (word.length <= 1) return word;
      return word[0] + '*'.repeat(Math.min(word.length - 1, 5));
    })
    .join(' ');
}

/**
 * Masks Malaysian IC Number (MyKad: 12 digits, format: YYMMDD-PB-###G).
 * E.g., "880315-10-5432" -> "8803**-**-5432"
 */
export function maskIC(icNumber: string, isPrivacyActive: boolean): string {
  if (!isPrivacyActive || !icNumber) return icNumber;
  // Format typically: 880315-10-5432
  const cleaned = icNumber.trim();
  if (cleaned.length >= 12 && cleaned.includes('-')) {
    const parts = cleaned.split('-');
    if (parts.length === 3) {
      return `${parts[0].slice(0, 4)}**-**-${parts[2]}`;
    }
  }
  if (cleaned.length >= 8) {
    return `${cleaned.slice(0, 4)}****${cleaned.slice(-4)}`;
  }
  return '******-**-****';
}

export function getRiskBadgeClasses(risk: string): { bg: string; text: string; border: string; label: string; dot: string } {
  switch (risk) {
    case 'HIGH_RISK':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        label: 'High Risk / Positive',
        dot: 'bg-red-500',
      };
    case 'MODERATE_RISK':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        label: 'Moderate / Needs Review',
        dot: 'bg-amber-500',
      };
    case 'LOW_RISK':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        label: 'Low Risk / Normal',
        dot: 'bg-emerald-500',
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        label: 'Pending Validation',
        dot: 'bg-slate-400',
      };
  }
}

export function getStatusBadgeClasses(status: string): { bg: string; text: string; border: string } {
  switch (status) {
    case 'Requires Biopsy':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case 'Pending Validation':
      return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' };
    case 'Reviewed':
      return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
  }
}
