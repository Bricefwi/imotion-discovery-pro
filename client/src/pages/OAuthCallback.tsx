/**
 * Page de callback OAuth (Google, Microsoft, Apple)
 * Gère le retour après l'authentification OAuth
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function OAuthCallback() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const handleCallback = trpc.oauth.handleCallback.useMutation();

  useEffect(() => {
    const processCallback = async () => {
      // Récupérer les paramètres de l'URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const errorParam = params.get('error');

      // Vérifier s'il y a une erreur OAuth
      if (errorParam) {
        setError(`Erreur d'authentification: ${errorParam}`);
        toast.error(`Erreur d'authentification: ${errorParam}`);
        setTimeout(() => setLocation('/login'), 3000);
        return;
      }

      // Vérifier que le code et le state sont présents
      if (!code || !state) {
        setError('Paramètres OAuth manquants');
        toast.error('Paramètres OAuth manquants');
        setTimeout(() => setLocation('/login'), 3000);
        return;
      }

      // Déterminer le provider depuis le path
      const pathParts = window.location.pathname.split('/');
      const provider = pathParts[pathParts.length - 1] as 'google' | 'microsoft' | 'apple';

      if (!['google', 'microsoft', 'apple'].includes(provider)) {
        setError('Provider OAuth invalide');
        toast.error('Provider OAuth invalide');
        setTimeout(() => setLocation('/login'), 3000);
        return;
      }

      try {
        // Appeler le backend pour finaliser l'authentification
        const result = await handleCallback.mutateAsync({
          provider,
          code,
          state,
          origin: window.location.origin,
        });

        if (result.success) {
          toast.success('Connexion réussie !');
          // Rediriger vers la page de retour
          setLocation(result.returnPath || '/');
        }
      } catch (error: any) {
        setError(error.message || 'Erreur lors de l\'authentification');
        toast.error(error.message || 'Erreur lors de l\'authentification');
        setTimeout(() => setLocation('/login'), 3000);
      }
    };

    processCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center space-y-4">
        <img
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663057702655/ngknnkGqmlCKLNcm.png"
          alt="IMOTION"
          className="h-16 mx-auto mb-8"
        />
        
        {error ? (
          <>
            <div className="text-red-600 text-xl font-semibold">
              ❌ {error}
            </div>
            <p className="text-gray-600">
              Redirection vers la page de connexion...
            </p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-600 text-lg">
              Finalisation de la connexion...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
