import { cn } from '../../lib/cn.js';

/**
 * variant: 'primary' | 'secondary' | 'icon'
 * Always renders a real <button> (or <a> if `href` given) with a visible focus ring
 * and a minimum 44px tap target per Fitts's Law guidance.
 */
export function Button({ variant = 'primary', href, className, children, icon: Icon, ...props }) {
  const base =
    variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : 'icon-btn';

  const content = (
    <>
      {Icon && <Icon size={18} aria-hidden="true" />}
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} className={cn(base, className)} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={cn(base, className)} type={props.type || 'button'} {...props}>
      {content}
    </button>
  );
}
