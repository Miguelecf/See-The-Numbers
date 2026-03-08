import { Badge } from './ui/badge';

interface StatusBadgeProps {
  isActive: boolean;
}

export function StatusBadge({ isActive }: StatusBadgeProps) {
  return (
    <Badge variant={isActive ? 'success' : 'secondary'}>
      {isActive ? 'Activo' : 'Inactivo'}
    </Badge>
  );
}
