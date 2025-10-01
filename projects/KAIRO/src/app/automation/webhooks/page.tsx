import React from 'react';
import WebhookAutomation from '@/components/automation/WebhookAutomation';

const WebhookAutomationPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <WebhookAutomation />
    </div>
  );
};

export default WebhookAutomationPage;

export const metadata = {
  title: 'Webhook Automation - KAIRO',
  description: 'Automate payment events and subscription management with webhook automation rules',
};