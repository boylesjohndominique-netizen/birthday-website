import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function Modal({ isOpen, onClose, title, children, labelledBy }) {
  const panelRef = useRef(null);
  const triggerRef = useRef(document.activeElement);

  useEffect(() => {
    if (!isOpen) return;
    triggerRef.current = document.activeElement;
    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll(FOCUSABLE);
    focusables?.[0]?.focus();

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && focusables?.length) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      triggerRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-oxblood-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="surface-card w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="icon-btn absolute top-3 right-3"
        >
          <X size={20} aria-hidden="true" />
        </button>
        {title && (
          <h2 id={labelledBy} className="text-2xl font-display font-semibold text-oxblood-700 pr-8 mb-3">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
