'use client';

import { Badge } from './ui/badge';
import { formatPercent } from '@/shared/utils/format-percent';
import { getServiceMarginLevel, getProductMarginLevel, getMarginColor } from '@/shared/utils/margin-utils';

interface MarginBadgeProps {
  margin: number;
  type: 'service' | 'product';
  className?: string;
}

export function MarginBadge({ margin, type, className }: MarginBadgeProps) {
  const level = type === 'service' ? getServiceMarginLevel(margin) : getProductMarginLevel(margin);
  const colorClass = getMarginColor(level);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass} ${className || ''}`}>
      {formatPercent(margin)}
    </span>
  );
}
