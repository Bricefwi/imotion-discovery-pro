import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { motion } from 'framer-motion';
import { Mail, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';


interface EmailVerificationGuardProps {
  children: ReactNode;
}

export function EmailVerificationGuard({ children }: EmailVerificationGuardProps) {
  const [location] = useLocation();

  const { data: user } = trpc.auth.me.useQuery();
  const { data: isVerified, isLoading } = trpc.auth.isEmailVerified.useQuery(undefined, {
    enabled: !!user,
  });

  const sendVerificationMutation = trpc.auth.sendVerificationEmail.useMutation({
    onSuccess: () => {
      alert('✅ Email envoyé ! Vérifiez votre boîte de réception.');
    },
    onError: () => {
      alert('❌ Erreur : Impossible d\'envoyer l\'email de vérification.');
    },
  });

  // Skip verification check for public routes
  const publicRoutes = ['/', '/verify-email'];
  const isPublicRoute = publicRoutes.some(route => location.startsWith(route));

  // If user is not logged in or on a public route, show children
  if (!user || isPublicRoute) {
    return <>{children}</>;
  }

  // Show loading while checking verification status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#d8232a] animate-spin" />
      </div>
    );
  }

  // If email is not verified, show verification prompt
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[#d8232a]/20 rounded-full blur-xl" />
                <Mail className="w-16 h-16 text-[#d8232a] relative" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
              Vérifiez votre email
            </h1>
            
            <p className="text-slate-600 text-center mb-6">
              Pour accéder à IMOTION Discovery Pro, vous devez d'abord vérifier votre adresse email.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Email envoyé à :</p>
                  <p className="text-blue-700">{user.email}</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 text-center mb-6">
              Cliquez sur le lien dans l'email que nous vous avons envoyé pour activer votre compte.
            </p>

            <Button
              onClick={() => sendVerificationMutation.mutate()}
              disabled={sendVerificationMutation.isPending}
              className="w-full bg-gradient-to-r from-[#d8232a] to-[#ff4d54] hover:shadow-lg hover:shadow-[#d8232a]/30 transition-all"
            >
              {sendVerificationMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Renvoyer l\'email de vérification'
              )}
            </Button>

            <div className="mt-6 text-center text-sm text-slate-500">
              <p>
                Vous n'avez pas reçu l'email ?{' '}
                <button
                  onClick={() => sendVerificationMutation.mutate()}
                  className="text-[#d8232a] hover:underline font-medium"
                  disabled={sendVerificationMutation.isPending}
                >
                  Renvoyer
                </button>
              </p>
            </div>
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

  // Email is verified, show children
  return <>{children}</>;
}
