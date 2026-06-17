import Link from 'next/link';
import React from 'react';

export default function Button({ href, children, className }) {
  return (
    <Link href={href}>
      <button className={`font-medium p-3 w-full rounded-full ${className}`}>
        {children}
      </button>
    </Link>
  );
}
