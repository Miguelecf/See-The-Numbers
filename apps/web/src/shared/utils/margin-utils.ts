export type MarginLevel = 'high' | 'medium' | 'low' | 'negative';

const SERVICE_HIGH_THRESHOLD = 40;
const SERVICE_MEDIUM_THRESHOLD = 20;
const PRODUCT_HIGH_THRESHOLD = 25;
const PRODUCT_MEDIUM_THRESHOLD = 10;

export const getServiceMarginLevel = (margin: number): MarginLevel => {
  if (margin < 0) return 'negative';
  if (margin >= SERVICE_HIGH_THRESHOLD) return 'high';
  if (margin >= SERVICE_MEDIUM_THRESHOLD) return 'medium';
  return 'low';
};

export const getProductMarginLevel = (margin: number): MarginLevel => {
  if (margin < 0) return 'negative';
  if (margin >= PRODUCT_HIGH_THRESHOLD) return 'high';
  if (margin >= PRODUCT_MEDIUM_THRESHOLD) return 'medium';
  return 'low';
};

export const getMarginColor = (level: MarginLevel): string => {
  switch (level) {
    case 'high':
      return 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30';
    case 'medium':
      return 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30';
    case 'low':
      return 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30';
    case 'negative':
      return 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30';
  }
};
