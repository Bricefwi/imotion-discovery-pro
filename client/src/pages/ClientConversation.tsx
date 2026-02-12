import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Send, Bot, User, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

export default function ClientConversation() {
  const { user } = useAuth();
  const [, params] = useRoute("/client/conversation/:id");
  const [, setLocation] = useLocation();
  const projectId = params?.id ? parseInt(params.id) : null;

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: project, isLoading: projectLoading } = trpc.projects.getById.useQuery(
    { id: projectId! },
    { enabled: !!projectId }
  );

  const { data: messages, isLoading: messagesLoading, refetch: refetchMessages } = trpc.conversation.getHistory.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId }
  );

  const sendMessageMutation = trpc.conversation.sendMessage.useMutation({
    onSuccess: () => {
      setMessage("");
      refetchMessages();
    },
    onError: (error) => {
      toast.error("Erreur lors de l'envoi du message");
      console.error(error);
    },
  });

  const handleSendMessage = () => {
    if (!message.trim() || !projectId) return;
    sendMessageMutation.mutate({
      projectId,
      content: message.trim(),
    });
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Projet introuvable</p>
      </div>
    );
  }

  if (projectLoading || messagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner-imotion"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Projet introuvable</p>
      </div>
    );
  }

  const getPhaseLabel = (phase: number) => {
    const phases = [
      "Accueil & Mise en Confiance",
      "Exploration du Besoin",
      "Vision & Positionnement",
      "Écosystème & Intégrations",
      "Contraintes & Ressources",
      "Profil Décisionnel",
      "Synthèse & Validation"
    ];
    return phases[phase - 1] || `Phase ${phase}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/client/projects')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-sm text-gray-600">
                  Phase {project.currentPhase}/7 : {getPhaseLabel(project.currentPhase)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {project.score !== null && project.score > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Score :</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-3 h-3 rounded-full ${
                          star <= project.score! ? 'bg-[#d8232a]' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 progress-bar-imotion">
            <div
              className="progress-bar-fill-imotion"
              style={{ width: `${(project.currentPhase / 7) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="space-y-6">
            {messages?.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-gray-200' : 'gradient-imotion'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-5 h-5 text-gray-700" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <Card className={`flex-1 p-4 ${
                  msg.role === 'user' 
                    ? 'bg-white' 
                    : 'bg-gradient-to-r from-[#fed7aa] to-[#fef3c7]'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-sm">
                      {msg.role === 'user' ? 'Vous' : 'Consultant IMOTION'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <Streamdown>{msg.content}</Streamdown>
                  </div>
                </Card>
              </div>
            ))}

            {sendMessageMutation.isPending && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full gradient-imotion flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <Card className="flex-1 p-4 bg-gradient-to-r from-[#fed7aa] to-[#fef3c7]">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#d8232a]" />
                    <span className="text-sm text-gray-600">Le consultant réfléchit...</span>
                  </div>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t shadow-lg">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex gap-4">
            <Textarea
              placeholder="Écrivez votre réponse..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={sendMessageMutation.isPending}
              className="input-imotion resize-none"
              rows={3}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending}
              className="btn-imotion self-end"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Appuyez sur Entrée pour envoyer, Shift+Entrée pour un saut de ligne
          </p>
        </div>
      </div>
    </div>
  );
}
