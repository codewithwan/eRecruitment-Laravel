import { usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

interface FlashProps {
  success?: string;
  error?: string;
  warning?: string;
}

const FlashMessage: React.FC = () => {
  const flash = (usePage().props as any).flash as FlashProps;

  useEffect(() => {
    if (flash.success) {
      Swal.fire({
        title: 'Sukses!',
        text: flash.success,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          // Redirect ke halaman application-history
          window.location.href = '/candidate/application-history';
        }
      });
    }

    if (flash.error) {
      Swal.fire({
        title: 'Perhatian!',
        text: flash.error,
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }

    if (flash.warning) {
      Swal.fire({
        title: 'Perhatian!',
        text: flash.warning,
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }, [flash]);

  return null;
};

export default FlashMessage;
