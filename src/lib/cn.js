/**
 * Tiny classnames combiner: cn('a', condition && 'b', 'c')
 */
export function cn(...args) {
  return args.filter(Boolean).join(' ');
}
