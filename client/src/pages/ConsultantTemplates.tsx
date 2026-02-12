import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Globe,
  Lock,
  FileText,
  TrendingUp,
} from "lucide-react";

export default function ConsultantTemplates() {
  const [, setLocation] = useLocation();
  const [showPublic, setShowPublic] = useState(false);

  const { data: myTemplates, refetch: refetchMy } = trpc.cdcTemplates.list.useQuery();
  const { data: publicTemplates, refetch: refetchPublic } = trpc.cdcTemplates.listPublic.useQuery();

  const deleteMutation = trpc.cdcTemplates.delete.useMutation({
    onSuccess: () => {
      alert("✅ Template supprimé");
      refetchMy();
    },
    onError: (error) => {
      alert(`❌ Erreur : ${error.message}`);
    },
  });

  const templates = showPublic ? publicTemplates : myTemplates;

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      web: "Site Web",
      mobile: "App Mobile",
      ecommerce: "E-commerce",
      saas: "SaaS",
      custom: "Personnalisé",
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      web: "bg-blue-100 text-blue-700",
      mobile: "bg-purple-100 text-purple-700",
      ecommerce: "bg-green-100 text-green-700",
      saas: "bg-orange-100 text-orange-700",
      custom: "bg-gray-100 text-gray-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Templates CDC</h1>
              <p className="text-sm text-slate-600">
                Créez et gérez vos modèles de cahiers des charges
              </p>
            </div>
            <Button
              onClick={() => setLocation("/consultant/templates/new")}
              className="bg-gradient-to-r from-[#d8232a] to-[#ff4d54]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau template
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setShowPublic(false)}
            variant={!showPublic ? "default" : "outline"}
          >
            Mes templates ({myTemplates?.length || 0})
          </Button>
          <Button
            onClick={() => setShowPublic(true)}
            variant={showPublic ? "default" : "outline"}
          >
            Templates publics ({publicTemplates?.length || 0})
          </Button>
        </div>

        {/* Templates Grid */}
        {!templates || templates.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {showPublic ? "Aucun template public" : "Aucun template créé"}
            </h3>
            <p className="text-slate-600 mb-6">
              {showPublic
                ? "Les templates partagés par d'autres consultants apparaîtront ici"
                : "Créez votre premier template pour commencer"}
            </p>
            {!showPublic && (
              <Button
                onClick={() => setLocation("/consultant/templates/new")}
                className="bg-gradient-to-r from-[#d8232a] to-[#ff4d54]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer un template
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900">{template.name}</h3>
                      {template.isPublic ? (
                        <Globe className="w-4 h-4 text-green-600" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {template.description || "Pas de description"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(template.category)}`}>
                    {getCategoryLabel(template.category)}
                  </span>
                  {template.tags && template.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {template.sections?.length || 0} sections
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {template.usageCount || 0} utilisations
                  </div>
                </div>

                <div className="flex gap-2">
                  {!showPublic && (
                    <>
                      <Button
                        onClick={() => setLocation(`/consultant/templates/edit/${template.id}`)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        onClick={() => {
                          if (confirm("Supprimer ce template ?")) {
                            deleteMutation.mutate({ id: template.id });
                          }
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {showPublic && (
                    <Button
                      onClick={() => {
                        alert("Fonctionnalité de duplication à venir !");
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Dupliquer
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
