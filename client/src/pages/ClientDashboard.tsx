import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { 
  MessageSquare, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useLocation } from "wouter";
import { SEO } from "@/components/SEO";

const PHASES = [
  { id: 1, name: "Accueil & Contexte", description: "Comprenons ensemble votre vision" },
  { id: 2, name: "Exploration du Besoin", description: "Identifions vos vrais objectifs" },
  { id: 3, name: "Vision & Positionnement", description: "Définissons votre identité digitale" },
  { id: 4, name: "Écosystème", description: "Analysons votre environnement" },
  { id: 5, name: "Fonctionnalités & Priorités", description: "Structurons les fonctionnalités" },
  { id: 6, name: "Analyse Psychologique", description: "Comprenons votre profil décisionnel" },
  { id: 7, name: "Synthèse & Validation", description: "Finalisons votre cahier des charges" },
];

export default function ClientDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Récupérer les projets du client
  const { data: projects, isLoading } = trpc.projects.list.useQuery(
    undefined,
    { enabled: !!user }
  );

  const activeProject = projects?.find((p: any) => p.status !== 'completed');
  const completedProjects = projects?.filter((p: any) => p.status === 'completed') || [];

  // Calculer la progression
  const calculateProgress = (currentPhase: number) => {
    return Math.round((currentPhase / 7) * 100);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'En attente' },
      'in_progress': { color: 'bg-blue-100 text-blue-800', icon: TrendingUp, label: 'En cours' },
      'completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Terminé' },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Annulé' },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="h-4 w-4" />
        {badge.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Mon Espace Client - IMOTION Discovery Pro"
        description="Suivez l'avancement de votre projet digital en temps réel"
        noindex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663057702655/ngknnkGqmlCKLNcm.png" alt="IMOTION" className="h-24 w-auto" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Mon Espace Client</h1>
                  <p className="text-sm text-gray-600">Bienvenue, {user?.name || 'Client'}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setLocation('/')}
              >
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Projet actif */}
          {activeProject ? (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Projet en cours</h2>
              <Card className="p-6 glass-card">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {activeProject.title || 'Nouveau Projet'}
                    </h3>
                    <p className="text-gray-600 mb-4">Projet de transformation digitale</p>
                    {getStatusBadge(activeProject.status)}
                  </div>
                  <Button
                    onClick={() => setLocation(`/client/conversation/${activeProject.id}`)}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Continuer la conversation
                  </Button>
                </div>

                {/* Progression des phases */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Progression : Phase {activeProject.currentPhase || 1}/7
                    </span>
                    <span className="text-sm font-medium text-red-600">
                      {calculateProgress(activeProject.currentPhase || 1)}%
                    </span>
                  </div>
                  <Progress 
                    value={calculateProgress(activeProject.currentPhase || 1)} 
                    className="h-3"
                  />
                </div>

                {/* Liste des phases */}
                <div className="grid gap-3">
                  {PHASES.map((phase) => {
                    const isCompleted = (activeProject.currentPhase || 1) > phase.id;
                    const isCurrent = (activeProject.currentPhase || 1) === phase.id;
                    return (
                      <div
                        key={phase.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                          isCompleted
                            ? 'bg-green-50 border-green-200'
                            : isCurrent
                            ? 'bg-blue-50 border-blue-300 shadow-sm'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isCurrent
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : phase.id}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{phase.name}</h4>
                          <p className="text-sm text-gray-600">{phase.description}</p>
                        </div>
                        {isCurrent && (
                          <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                            En cours
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Documents générés */}
                {activeProject.currentPhase === 7 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-4">Documents disponibles</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="justify-start h-auto py-4"
                        onClick={() => {
                          // TODO: Télécharger le CDC
                        }}
                      >
                        <FileText className="h-5 w-5 mr-3 text-red-600" />
                        <div className="text-left">
                          <div className="font-semibold">Cahier des Charges</div>
                          <div className="text-xs text-gray-500">PDF • Prêt à télécharger</div>
                        </div>
                        <Download className="h-4 w-4 ml-auto" />
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start h-auto py-4"
                        onClick={() => {
                          // TODO: Télécharger le contrat
                        }}
                      >
                        <FileText className="h-5 w-5 mr-3 text-blue-600" />
                        <div className="text-left">
                          <div className="font-semibold">Contrat de Prestation</div>
                          <div className="text-xs text-gray-500">PDF • Prêt à télécharger</div>
                        </div>
                        <Download className="h-4 w-4 ml-auto" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <div className="mb-8">
              <Card className="p-12 text-center glass-card">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Aucun projet en cours
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Commencez votre parcours de découverte pour transformer votre idée en projet digital réussi
                  </p>
                  <Button
                    onClick={() => setLocation('/client/onboarding')}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    Démarrer un nouveau projet
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Projets terminés */}
          {completedProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Projets terminés</h2>
              <div className="grid gap-4">
                {completedProjects.map((project: any) => (
                  <Card key={project.id} className="p-6 glass-card hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {project.title || 'Projet'}
                          </h3>
                          {getStatusBadge(project.status)}
                        </div>
                        <p className="text-gray-600 mb-3">Projet de transformation digitale</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Terminé le {new Date(project.updatedAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Voir les détails du projet
                        }}
                      >
                        Voir les détails
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
