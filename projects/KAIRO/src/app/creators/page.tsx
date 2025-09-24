import React from 'react';
import CreatorProfiles from '@/components/profiles/CreatorProfiles';
import AppLayout from '@/components/layouts/AppLayout';

export default function CreatorsPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <CreatorProfiles />
      </div>
    </AppLayout>
  );
}