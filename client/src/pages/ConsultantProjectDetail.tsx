import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  MessageSquare,
  Clock,
  User,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { DocumentPreview } from "@/components/DocumentPreview";

export default function ConsultantProjectDetail() {
  const { user } = useAuth();
  const params = useParams();
  const projectId = params.id ? parseInt(params.id) : 0;
  const [, setLocation] = useLocation();
  const [newNote, setNewNote] = useState("");

  const { data: project, isLoading } = trpc.projects.getById.useQuery({ id: projectId });
  const { data: messages } = trpc.projects.list.useQuery();
  const { data: documents } = trpc.documents.list.useQuery({ projectId });
  const { data: notes } = trpc.consultant.getNotes.useQuery({ projectId });

  const addNoteMutation = trpc.consultant.addNote.useMutation({
    onSuccess: () => {
      toast.success("Note ajoutée avec succès");
      setNewNote("");
    }
  });

  const generateCDCMutation = trpc.documents.generateCDC.useMutation({
    onSuccess: () => {
      toast.success("CDC généré avec succès");
    }
  });

  const generateContractMutation = trpc.documents.generateContract.useMutation({
    onSuccess: () => {
      toast.success("Contrat généré avec succès");
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="spinner-imotion"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Projet introuvable</h2>
          <p className="text-gray-600 mb-6">Le projet demandé n'existe pas ou a été supprimé.</p>
          <Button onClick={() => setLocation('/consultant/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const pipelineStages = {
    'lead': { label: 'Lead', color: 'bg-gray-500' },
    'qualified': { label: 'Qualifié', color: 'bg-blue-500' },
    'quote_sent': { label: 'Devis envoyé', color: 'bg-yellow-500' },
    'negotiation': { label: 'Négociation', color: 'bg-orange-500' },
    'won': { label: 'Gagné', color: 'bg-green-500' },
    'lost': { label: 'Perdu', color: 'bg-red-500' },
  };

  const currentStage = pipelineStages[project.pipelineStage as keyof typeof pipelineStages] || pipelineStages.lead;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/consultant/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au dashboard
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Client</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Créé le {new Date(project.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>

            <Badge className={`${currentStage.color} text-white text-sm px-4 py-2`}>
              {currentStage.label}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistiques rapides */}
            <div className="grid md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#d8232a] to-[#ff4d54] flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Score</p>
                      <p className="text-xl font-bold text-gray-900">{project.budget || 0}/10</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#d8232a] to-[#ff4d54] flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Phase</p>
                      <p className="text-xl font-bold text-gray-900">{project.currentPhase}/7</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#d8232a] to-[#ff4d54] flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Budget</p>
                      <p className="text-xl font-bold text-gray-900">
                        {project.estimatedValue ? `${project.estimatedValue}€` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#d8232a] to-[#ff4d54] flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Urgence</p>
                      <p className="text-xl font-bold text-gray-900">{project.complexity || 0}/10</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Documents générés */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#d8232a]" />
                  Documents générés
                </h2>
                <div className="flex gap-2">
                  <DocumentPreview
                    projectId={projectId}
                    documentType="cdc"
                    onGenerate={(format) => generateCDCMutation.mutate({ projectId, format })}
                    isGenerating={generateCDCMutation.isPending}
                  />
                  <Button
                    onClick={() => generateCDCMutation.mutate({ projectId, format: 'both' })}
                    disabled={generateCDCMutation.isPending}
                    className="bg-gradient-to-r from-[#d8232a] to-[#ff4d54]"
                  >
                    {generateCDCMutation.isPending ? "Génération..." : "Générer CDC"}
                  </Button>
                  
                  <DocumentPreview
                    projectId={projectId}
                    documentType="contract"
                    onGenerate={(format) => generateContractMutation.mutate({ projectId, format })}
                    isGenerating={generateContractMutation.isPending}
                  />
                  <Button
                    onClick={() => generateContractMutation.mutate({ projectId, format: 'both' })}
                    disabled={generateContractMutation.isPending}
                    variant="outline"
                    className="border-[#d8232a] text-[#d8232a]"
                  >
                    {generateContractMutation.isPending ? "Génération..." : "Générer Contrat"}
                  </Button>
                </div>
              </div>

              {documents && documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#d8232a] to-[#ff4d54] flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {doc.type === 'cdc' ? 'Cahier des Charges' : 'Contrat'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(doc.createdAt).toLocaleDateString('fr-FR')} • {doc.format.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => window.open(doc.s3Url, '_blank')}
                        variant="ghost"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Aucun document généré pour le moment</p>
                  <p className="text-sm mt-2">Cliquez sur "Générer CDC" ou "Générer Contrat" pour commencer</p>
                </div>
              )}
            </Card>

            {/* Historique des conversations */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#d8232a]" />
                Historique des conversations
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages && messages.length > 0 ? (
                  messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-blue-50 ml-8' 
                          : 'bg-gray-50 mr-8'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm text-gray-900">
                          {msg.role === 'user' ? 'Client' : 'IA'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.createdAt).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">Aucune conversation pour le moment</p>
                )}
              </div>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Informations client */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#d8232a]" />
                Informations client
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Nom</p>
                      <p className="font-semibold text-gray-900">{'Non renseigné'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{'Non renseigné'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Téléphone</p>
                  <p className="font-semibold text-gray-900">{'Non renseigné'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Entreprise</p>
                  <p className="font-semibold text-gray-900">{'Non renseigné'}</p>
                </div>
              </div>
            </Card>

            {/* Données extraites */}
            {project.extractedData && (
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Données extraites</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(project.extractedData as Record<string, any>).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</p>
                      <p className="font-semibold text-gray-900">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Notes internes */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Notes internes</h3>
              <Textarea
                placeholder="Ajouter une note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="mb-3"
                rows={4}
              />
              <Button
                onClick={() => {
                  if (newNote.trim()) {
                    addNoteMutation.mutate({ projectId, content: newNote });
                  }
                }}
                disabled={!newNote.trim() || addNoteMutation.isPending}
                className="w-full bg-gradient-to-r from-[#d8232a] to-[#ff4d54]"
              >
                Ajouter la note
              </Button>

              {notes && notes.length > 0 && (
                <div className="mt-4 space-y-3">
                  {notes.map((note: any) => (
                    <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">{note.content}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
