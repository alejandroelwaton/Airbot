// src/components/Card.tsx
import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="border border-border m-5 text-center rounded-lg text-foreground">
      {children}
      <div hidden>{title}</div>
    </div>
  );
}
