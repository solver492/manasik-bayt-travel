import { useEffect, useRef } from 'react';

interface AviasalesWidgetProps {
  scriptSrc: string;
  className?: string;
}

export function AviasalesWidget({ scriptSrc, className }: AviasalesWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear the container
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.charset = 'utf-8';

    containerRef.current.appendChild(script);

    return () => {
      // Cleanup if needed, though script tags are often tricky
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [scriptSrc]);

  return <div ref={containerRef} className={className} />;
}
