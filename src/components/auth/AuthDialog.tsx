import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthDialog = ({ isOpen, onClose, initialMode = 'login' }: AuthDialogProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  const handleClose = () => {
    onClose();
    // Reset to login mode when dialog closes
    setTimeout(() => setMode('login'), 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-none shadow-none">
        {mode === 'login' ? (
          <LoginForm
            onSwitchToRegister={() => setMode('register')}
            onClose={handleClose}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => setMode('login')}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};