import Link from 'next/link';
import React from 'react';

export default function Button({ href, children, className }) {
  return (
    <Link href={href}>
      <button className={`font-medium mt-10 p-3 w-[500px] rounded-full ${className}`}>
        {children}
      </button>
    </Link>
  );
}
