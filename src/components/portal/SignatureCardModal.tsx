import React from 'react';
import { EnrollmentRegistrationModal } from './EnrollmentRegistrationModal';
import { EnrollmentFormData } from '../../types/banking';

interface SignatureCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName?: string;
  onEnrollSuccess?: (newCustomerName: string, accountType: string, fullData?: EnrollmentFormData) => void;
  initialFormData?: EnrollmentFormData;
}

export const SignatureCardModal: React.FC<SignatureCardModalProps> = ({
  isOpen,
  onClose,
  customerName = 'Account Holder',
  onEnrollSuccess,
  initialFormData,
}) => {
  return (
    <EnrollmentRegistrationModal
      isOpen={isOpen}
      onClose={onClose}
      initialCustomerName={customerName}
      onEnrollSuccess={onEnrollSuccess}
      initialFormData={initialFormData}
    />
  );
};
