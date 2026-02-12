/**
 * Page de connexion avec OAuth (Google, Microsoft, Apple) et email avec code
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Login() {
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingCode, setIsLoadingCode] = useState(false);

  const getConfiguredProviders = trpc.oauth.getConfiguredProviders.useQuery();
  const sendEmailCode = trpc.emailLogin.sendCode.useMutation();
  const verifyEmailCode = trpc.emailLogin.verifyCode.useMutation();
  const getOAuthUrl = trpc.oauth.getAuthUrl.useMutation();

  // Récupérer le returnPath depuis l'URL
  const params = new URLSearchParams(window.location.search);
  const returnPath = params.get('returnPath') || '/';

  /**
   * Connexion OAuth (Google, Microsoft, Apple)
   */
  const handleOAuthLogin = async (provider: 'google' | 'microsoft' | 'apple') => {
    try {
      const result = await getOAuthUrl.mutateAsync({
        provider,
        origin: window.location.origin,
        returnPath,
      });

      // Rediriger vers l'URL d'authentification OAuth
      window.location.href = result.authUrl;
    } catch (error: any) {
      toast.error(error.message || `Erreur lors de la connexion ${provider}`);
    }
  };

  /**
   * Envoi du code par email
   */
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    setIsLoadingEmail(true);

    try {
      await sendEmailCode.mutateAsync({
        email,
        origin: window.location.origin,
      });

      setCodeSent(true);
      toast.success('Code envoyé ! Vérifiez votre boîte email.');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setIsLoadingEmail(false);
    }
  };

  /**
   * Vérification du code et connexion
   */
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || code.length !== 6) {
      toast.error('Veuillez entrer le code à 6 chiffres');
      return;
    }

    setIsLoadingCode(true);

    try {
      const result = await verifyEmailCode.mutateAsync({
        email,
        code,
      });

      if (result.success) {
        toast.success('Connexion réussie !');
        // Rediriger vers la page de retour
        setLocation(result.returnPath || returnPath);
      }
    } catch (error: any) {
      toast.error(error.message || 'Code invalide ou expiré');
    } finally {
      setIsLoadingCode(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo et titre */}
        <div className="text-center space-y-2">
          <img
            src="/logo-imotion.png"
            alt="IMOTION"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900">Connexion</h1>
          <p className="text-gray-600">
            Accédez à votre espace IMOTION Discovery Pro
          </p>
        </div>

        {/* Connexion OAuth */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">Connexion rapide</CardTitle>
            <CardDescription>
              Connectez-vous avec votre compte existant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Google */}
            {getConfiguredProviders.data?.google && (
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => handleOAuthLogin('google')}
                disabled={getOAuthUrl.isPending}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuer avec Google
              </Button>
            )}

            {/* Microsoft */}
            {getConfiguredProviders.data?.microsoft && (
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => handleOAuthLogin('microsoft')}
                disabled={getOAuthUrl.isPending}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M1 1h10v10H1z" />
                  <path fill="#00a4ef" d="M13 1h10v10H13z" />
                  <path fill="#7fba00" d="M1 13h10v10H1z" />
                  <path fill="#ffb900" d="M13 13h10v10H13z" />
                </svg>
                Continuer avec Microsoft
              </Button>
            )}

            {/* Apple */}
            {getConfiguredProviders.data?.apple && (
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => handleOAuthLogin('apple')}
                disabled={getOAuthUrl.isPending}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continuer avec Apple
              </Button>
            )}

            {!getConfiguredProviders.data?.google &&
              !getConfiguredProviders.data?.microsoft &&
              !getConfiguredProviders.data?.apple && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Aucun provider OAuth configuré
                </p>
              )}
          </CardContent>
        </Card>

        {/* Séparateur */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-100 text-gray-600">OU</span>
          </div>
        </div>

        {/* Connexion par email */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">Connexion par email</CardTitle>
            <CardDescription>
              Recevez un code de connexion par email
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!codeSent ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoadingEmail}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full btn-imotion"
                  disabled={isLoadingEmail}
                >
                  {isLoadingEmail ? 'Envoi en cours...' : 'Recevoir le code'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code de vérification</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                    disabled={isLoadingCode}
                    className="text-center text-2xl tracking-widest"
                  />
                  <p className="text-sm text-gray-600">
                    Code envoyé à <strong>{email}</strong>
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full btn-imotion"
                  disabled={isLoadingCode || code.length !== 6}
                >
                  {isLoadingCode ? 'Vérification...' : 'Se connecter'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setCodeSent(false);
                    setCode('');
                  }}
                >
                  Modifier l'email
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Lien vers la page d'accueil */}
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setLocation('/')}
            className="text-gray-600"
          >
            ← Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
