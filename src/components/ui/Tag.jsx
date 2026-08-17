import { cn } from '../../lib/cn.js';

export function Tag({ children, active, as: Tag = 'span', className, ...props }) {
  return (
    <Tag
      className={cn(
        'tag-pill transition-colors',
        active && 'bg-crimson-500 text-ivory-100',
        Tag === 'button' && 'cursor-pointer hover:bg-crimson-200',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
