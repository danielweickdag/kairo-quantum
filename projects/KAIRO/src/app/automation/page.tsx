import React from 'react';
import AutomationDashboard from '@/components/automation/AutomationDashboard';
import WorkflowManager from '@/components/automation/WorkflowManager';
import AppLayout from '@/components/layouts/AppLayout';

export default function AutomationPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <WorkflowManager className="mb-6" />
        <AutomationDashboard />
      </div>
    </AppLayout>
  );
}