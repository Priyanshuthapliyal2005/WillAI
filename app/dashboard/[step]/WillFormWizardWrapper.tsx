"use client";

import { WillFormWizard } from '@/components/will-form-wizard';

interface WillFormWizardWrapperProps {
  currentStep: number;
  willId?: string;
  userId: string;
}

export default function WillFormWizardWrapper({ currentStep, willId, userId }: WillFormWizardWrapperProps) {
  return (
    <WillFormWizard currentStep={currentStep} willId={willId} userId={userId} />
  );
}
