import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  const verifyMutation = trpc.auth.verifyEmail.useMutation({
    onSuccess: () => {
      setStatus('success');
      // Redirect to home after 3 seconds
      setTimeout(() => {
        setLocation('/');
      }, 3000);
    },
    onError: () => {
      setStatus('error');
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate({ token });
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {status === 'verifying' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Mail className="w-16 h-16 text-[#d8232a]" />
                  <Loader2 className="w-6 h-6 text-[#d8232a] absolute -top-1 -right-1 animate-spin" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Vérification en cours...
              </h1>
              <p className="text-slate-600">
                Nous vérifions votre adresse email.
              </p>
            </>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
                  <CheckCircle2 className="w-16 h-16 text-green-500 relative" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Email vérifié avec succès !
              </h1>
              <p className="text-slate-600 mb-6">
                Votre compte est maintenant activé. Vous allez être redirigé automatiquement...
              </p>
              <Button
                onClick={() => setLocation('/')}
                className="bg-gradient-to-r from-[#d8232a] to-[#ff4d54] hover:shadow-lg hover:shadow-[#d8232a]/30 transition-all"
              >
                Accéder à la plateforme
              </Button>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
                  <XCircle className="w-16 h-16 text-red-500 relative" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Lien invalide ou expiré
              </h1>
              <p className="text-slate-600 mb-6">
                Ce lien de vérification n'est plus valide. Il a peut-être expiré ou a déjà été utilisé.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setLocation('/')}
                  variant="outline"
                  className="w-full"
                >
                  Retour à l'accueil
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-600">
          <p>
            Besoin d'aide ?{' '}
            <a
              href="mailto:contact@imotion-conseil.fr"
              className="text-[#d8232a] hover:underline font-medium"
            >
              Contactez-nous
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
