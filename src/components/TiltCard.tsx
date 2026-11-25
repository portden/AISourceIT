import { useRef, useState, type MouseEvent, type ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 4.5,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>(
    'perspective(1100px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)'
  );

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.innerWidth < 768)
    ) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const rotY = (px - 0.5) * maxTilt * 2;
    const rotX = (0.5 - py) * maxTilt * 2;

    setTransform(
      `perspective(1100px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(
        2
      )}deg) translate3d(0, -4px, 0)`
    );
  };

  const handleMouseLeave = () => {
    setTransform(
      'perspective(1100px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)'
    );
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
      className={`tilt-card-inner ${className}`}
    >
      {children}
    </div>
  );
}
