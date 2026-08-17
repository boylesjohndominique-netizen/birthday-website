import { cn } from '../../lib/cn.js';

export function Card({ as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag className={cn('surface-card p-5', className)} {...props}>
      {children}
    </Tag>
  );
}
