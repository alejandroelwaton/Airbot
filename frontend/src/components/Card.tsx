// src/components/Card.tsx
import type { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-gray-200 rounded-xl border-gray-300 border-1 m-5">
      {children}
    </div>
  );
}
