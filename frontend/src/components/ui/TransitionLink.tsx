"use client";

import React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useTransitionContext } from "@/components/RouteTransitionProvider";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export function TransitionLink({ children, href, className, ...props }: TransitionLinkProps) {
  const router = useRouter();
  const { startTransition } = useTransitionContext();

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    
    // Munculkan loading screen secara INSTAN
    startTransition();

    // Tunggu sedikit saja agar animasi render di browser, lalu pindah halaman
    setTimeout(() => {
      router.push(href.toString());
    }, 50);
  };

  return (
    <Link href={href} onClick={handleTransition} className={className} {...props}>
      {children}
    </Link>
  );
}
