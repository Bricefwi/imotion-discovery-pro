import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  BarChart3,
  FolderOpen,
  Bell,
  LogOut,
  MessageSquare,
  TrendingUp,
  Clock,
  AlertCircle,
  Kanban,
} from "lucide-react";
import { useLocation } from "wouter";

export default function ConsultantDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const { data: projects, isLoading: projectsLoading } = trpc.projects.list.useQuery();
  const { data: stats, isLoading: statsLoading } = trpc.projects.stats.useQuery();
  const { data: consultantStats } = trpc.notifications.stats.useQuery();

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

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      high: "text-red-600 bg-red-50",
      medium: "text-orange-600 bg-orange-50",
      low: "text-green-600 bg-green-50",
    };
    return colors[urgency as keyof typeof colors] || "text-gray-600 bg-gray-50";
  };

  const getUrgencyLabel = (urgency: string) => {
    const labels = {
      high: "Urgent",
      medium: "Moyen",
      low: "Faible",
    };
    return labels[urgency as keyof typeof labels] || urgency;
  };

  if (projectsLoading || statsLoading) {
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
            <img src="/logo-imotion.png" alt="IMOTION" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard Consultant</h1>
              <p className="text-sm text-gray-600">{user?.name || user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/consultant/pipeline')}
            >
              <Kanban className="w-4 h-4 mr-2" />
              Pipeline
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation('/consultant/analytics')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation('/consultant/notifications')}
              className="relative"
            >
              <Bell className="w-4 h-4" />
              {consultantStats && consultantStats.unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#d8232a] text-white text-xs rounded-full flex items-center justify-center">
                  {consultantStats.unreadNotifications}
                </span>
              )}
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="card-imotion">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Projets</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total || 0}</p>
              </div>
              <FolderOpen className="w-12 h-12 text-[#d8232a] opacity-20" />
            </div>
          </Card>

          <Card className="card-imotion">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Projets Actifs</p>
                <p className="text-3xl font-bold text-[#d8232a]">{stats?.active || 0}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-[#d8232a] opacity-20" />
            </div>
          </Card>

          <Card className="card-imotion">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Terminés</p>
                <p className="text-3xl font-bold text-green-600">{stats?.completed || 0}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </Card>

          <Card className="card-imotion">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Notifications</p>
                <p className="text-3xl font-bold text-[#fb923c]">
                  {consultantStats?.unreadNotifications || 0}
                </p>
              </div>
              <Bell className="w-12 h-12 text-[#fb923c] opacity-20" />
            </div>
          </Card>
        </div>

        {/* Projects Table */}
        <Card className="card-imotion">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tous les Projets</h2>
          </div>

          {!projects || projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Aucun projet pour le moment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Projet</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Client</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Phase</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Urgence</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Dernière MAJ</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{project.title}</div>
                        {project.budget && (
                          <div className="text-sm text-gray-500">{project.budget}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        Client #{project.clientId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{project.currentPhase}/7</span>
                          <span className="text-xs text-gray-500">
                            {getPhaseLabel(project.currentPhase)}
                          </span>
                        </div>
                        <div className="progress-bar-imotion mt-1">
                          <div
                            className="progress-bar-fill-imotion"
                            style={{ width: `${(project.currentPhase / 7) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className={`w-3 h-3 rounded-full ${
                                star <= (project.score || 0) ? 'bg-[#d8232a]' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(project.urgency || 'low')}`}>
                          {project.urgency === 'high' && <AlertCircle className="w-3 h-3" />}
                          {project.urgency === 'medium' && <Clock className="w-3 h-3" />}
                          {getUrgencyLabel(project.urgency || 'low')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                          project.status === 'active' ? 'bg-[#fb923c] text-white' :
                          project.status === 'completed' ? 'bg-[#d8232a] text-white' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {project.status === 'active' ? 'En cours' :
                           project.status === 'completed' ? 'Terminé' : 'Archivé'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(project.updatedAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLocation(`/consultant/project/${project.id}`)}
                          className="text-[#d8232a] hover:text-[#b01d23]"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
