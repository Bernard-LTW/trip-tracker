'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import PROnboarding from './PROnboarding';

interface PRInfoWrapperProps {
  children: React.ReactNode;
  onOnboardingChange?: (isOnboarding: boolean) => void;
}

export default function PRInfoWrapper({ children, onOnboardingChange }: PRInfoWrapperProps) {
  const { user } = useAuth();
  const [hasPRInfo, setHasPRInfo] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPRInfo() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const hasInfo = await userService.hasPRinfo(user.uid);
        setHasPRInfo(hasInfo);
        onOnboardingChange?.(!hasInfo);
      } catch (error) {
        console.error('Error checking PR info:', error);
      } finally {
        setLoading(false);
      }
    }

    checkPRInfo();
  }, [user, onOnboardingChange]);

  if (!user || loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (hasPRInfo === false) {
    return <PROnboarding onComplete={() => {
      setHasPRInfo(true);
      onOnboardingChange?.(false);
    }} />;
  }

  return <>{children}</>;
} 