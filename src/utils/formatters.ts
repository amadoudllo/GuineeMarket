export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'GNF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace('GNF', 'GNF');
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Il y a moins d\'une heure';
  if (diffInHours < 24) return `Il y a ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Il y a ${diffInDays}j`;
  
  return formatDate(date);
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    electronics: 'Électronique',
    clothing: 'Vêtements',
    vehicles: 'Véhicules',
    furniture: 'Meubles',
    services: 'Services'
  };
  return labels[category] || category;
};

export const getConditionLabel = (condition: string): string => {
  return condition === 'new' ? 'Neuf' : 'Occasion';
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Refusé',
    confirmed: 'Confirmé',
    delivered: 'Livré',
    cancelled: 'Annulé'
  };
  return labels[status] || status;
};