'use client';
import { UserProvider } from '../context/UserContext';
import ThemeToggle from './ThemeToggle';

export default function ClientProvider({ children }) {
  return (
    <UserProvider>
      <ThemeToggle />
      {children}
    </UserProvider>
  );
}
