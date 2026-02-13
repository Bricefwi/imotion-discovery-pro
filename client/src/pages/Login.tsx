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

  const sendEmailCode = trpc.emailLogin.sendCode.useMutation();
  const verifyEmailCode = trpc.emailLogin.verifyCode.useMutation();

  // Récupérer le returnPath depuis l'URL
  const params = new URLSearchParams(window.location.search);
  const returnPath = params.get('returnPath') || '/';

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
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663057702655/ngknnkGqmlCKLNcm.png"
            alt="IMOTION"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900">Connexion</h1>
          <p className="text-gray-600">
            Accédez à votre espace IMOTION Discovery Pro
          </p>
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
