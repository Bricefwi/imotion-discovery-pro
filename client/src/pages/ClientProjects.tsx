import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Plus, MessageSquare, FileText, ArrowRight, LogOut } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function ClientProjects() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: projects, isLoading, refetch } = trpc.projects.list.useQuery();
  const createProjectMutation = trpc.projects.create.useMutation({
    onSuccess: (project) => {
      toast.success("Projet créé avec succès !");
      setDialogOpen(false);
      setNewProjectTitle("");
      refetch();
      setLocation(`/client/conversation/${project.id}`);
    },
    onError: (error) => {
      toast.error("Erreur lors de la création du projet");
      console.error(error);
    },
  });

  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) {
      toast.error("Veuillez entrer un titre pour votre projet");
      return;
    }
    createProjectMutation.mutate({ title: newProjectTitle });
  };

  const getPhaseLabel = (phase: number) => {
    const phases = [
      "Accueil",
      "Exploration",
      "Vision",
      "Écosystème",
      "Contraintes",
      "Décisionnel",
      "Synthèse"
    ];
    return phases[phase - 1] || `Phase ${phase}`;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: "inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-[#fb923c] text-white",
      completed: "inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-[#d8232a] text-white",
      archived: "inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-800",
    };
    const labels = {
      active: "En cours",
      completed: "Terminé",
      archived: "Archivé",
    };
    return (
      <span className={badges[status as keyof typeof badges] || "inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-800"}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner-imotion"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663057702655/ngknnkGqmlCKLNcm.png" alt="IMOTION" className="h-24 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mes Projets</h1>
              <p className="text-sm text-gray-600">{user?.name || user?.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Create Project Button */}
        <div className="mb-8">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-imotion">
                <Plus className="w-5 h-5 mr-2" />
                Nouveau Projet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouveau projet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Titre du projet
                  </label>
                  <Input
                    placeholder="Ex: Refonte de mon site e-commerce"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateProject();
                    }}
                    className="input-imotion"
                  />
                </div>
                <Button
                  onClick={handleCreateProject}
                  disabled={createProjectMutation.isPending}
                  className="btn-imotion w-full"
                >
                  {createProjectMutation.isPending ? "Création..." : "Démarrer la conversation"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {!projects || projects.length === 0 ? (
          <Card className="card-imotion text-center py-16">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold mb-2">Aucun projet pour le moment</h3>
            <p className="text-gray-600 mb-6">
              Créez votre premier projet pour commencer la conversation avec notre consultant IA.
            </p>
            <Button className="btn-imotion" onClick={() => setDialogOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Créer mon premier projet
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="card-imotion cursor-pointer"
                onClick={() => setLocation(`/client/conversation/${project.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex-1">
                    {project.title}
                  </h3>
                  {getStatusBadge(project.status)}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    <span>Phase {project.currentPhase} : {getPhaseLabel(project.currentPhase)}</span>
                  </div>

                  {project.score !== null && project.score > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Score de qualification :</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`w-4 h-4 rounded-full ${
                              star <= project.score! ? 'bg-[#d8232a]' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="progress-bar-imotion">
                    <div
                      className="progress-bar-fill-imotion"
                      style={{ width: `${(project.currentPhase / 7) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-gray-500">
                    {new Date(project.updatedAt).toLocaleDateString('fr-FR')}
                  </span>
                  <Button variant="ghost" size="sm" className="text-[#d8232a] hover:text-[#b01d23]">
                    Continuer
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        {projects && projects.length > 0 && (
          <Card className="card-imotion mt-8 bg-gradient-to-r from-[#fed7aa] to-[#fef3c7]">
            <div className="flex items-start gap-4">
              <FileText className="w-8 h-8 text-[#d8232a] flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-2">Génération automatique de documents</h3>
                <p className="text-gray-700">
                  Une fois votre conversation terminée, un Cahier des Charges professionnel et une 
                  ébauche de contrat seront générés automatiquement aux formats Word et PDF.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
