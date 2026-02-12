import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft, TrendingUp, DollarSign, Calendar, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

const PIPELINE_STAGES = [
  { id: "lead", label: "Lead", color: "bg-gray-500" },
  { id: "qualified", label: "Qualifié", color: "bg-blue-500" },
  { id: "quote_sent", label: "Devis envoyé", color: "bg-yellow-500" },
  { id: "negotiation", label: "Négociation", color: "bg-orange-500" },
  { id: "won", label: "Gagné", color: "bg-green-500" },
  { id: "lost", label: "Perdu", color: "bg-red-500" },
];

interface ProjectCardProps {
  project: any;
  isDragging?: boolean;
}

function ProjectCard({ project, isDragging }: ProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const urgencyColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-3"
    >
      <Card className="p-4 cursor-move hover:shadow-lg transition-shadow bg-white border-l-4 border-l-imotion-red">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-sm line-clamp-2">{project.title}</h4>
            <Badge className={`${urgencyColors[project.urgency as keyof typeof urgencyColors] || urgencyColors.medium} text-xs`}>
              {project.urgency === "high" ? "Urgent" : project.urgency === "medium" ? "Normal" : "Bas"}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <TrendingUp className="w-3 h-3" />
            <span>Score: {project.score}/5</span>
          </div>

          {project.estimatedValue && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <DollarSign className="w-3 h-3" />
              <span>{Number(project.estimatedValue).toLocaleString()}€</span>
            </div>
          )}

          {project.expectedClosingDate && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Calendar className="w-3 h-3" />
              <span>{new Date(project.expectedClosingDate).toLocaleDateString()}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-imotion-red to-imotion-orange h-1.5 rounded-full"
                style={{ width: `${(project.currentPhase / 7) * 100}%` }}
              />
            </div>
            <span className="text-gray-600">{project.currentPhase}/7</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PipelineColumn({ stage, projects }: { stage: typeof PIPELINE_STAGES[0]; projects: any[] }) {
  return (
    <div className="flex-1 min-w-[280px]">
      <div className="mb-3">
        <div className={`${stage.color} text-white px-4 py-2 rounded-lg flex items-center justify-between`}>
          <h3 className="font-semibold">{stage.label}</h3>
          <Badge className="bg-white/20 text-white">{projects.length}</Badge>
        </div>
      </div>

      <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[200px]">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function ConsultantPipeline() {
  const [, navigate] = useLocation();
  const [activeId, setActiveId] = useState<number | null>(null);

  const { data: allProjects = [], refetch } = trpc.projects.list.useQuery();
  const updatePipeline = trpc.crm.pipeline.updateStage.useMutation({
    onSuccess: () => refetch(),
  });
  const { data: stats } = trpc.crm.pipeline.stats.useQuery();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const projectId = active.id as number;
    const newStage = over.id as string;

    // Find the project being dragged
    const project = allProjects.find(p => p.id === projectId);
    
    if (project && project.pipelineStage !== newStage) {
      updatePipeline.mutate({
        projectId,
        stage: newStage as any,
      });
    }

    setActiveId(null);
  };

  const projectsByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.id] = allProjects.filter(p => p.pipelineStage === stage.id);
    return acc;
  }, {} as Record<string, any[]>);

  const activeProject = activeId ? allProjects.find(p => p.id === activeId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/consultant/dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pipeline de Vente</h1>
                <p className="text-sm text-gray-600">Glissez-déposez les projets entre les étapes</p>
              </div>
            </div>

            {stats && (
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-imotion-red">{stats.total}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.won}</div>
                  <div className="text-xs text-gray-600">Gagnés</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-imotion-red">
                    {stats.conversionRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">Conversion</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="container mx-auto px-6 py-6">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {PIPELINE_STAGES.map(stage => (
              <SortableContext
                key={stage.id}
                id={stage.id}
                items={projectsByStage[stage.id]?.map(p => p.id) || []}
                strategy={verticalListSortingStrategy}
              >
                <PipelineColumn
                  stage={stage}
                  projects={projectsByStage[stage.id] || []}
                />
              </SortableContext>
            ))}
          </div>

          <DragOverlay>
            {activeProject && (
              <ProjectCard project={activeProject} isDragging />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Help Text */}
      <div className="container mx-auto px-6 py-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Comment utiliser le pipeline ?</p>
              <p>Glissez et déposez les cartes de projet d'une colonne à l'autre pour mettre à jour leur statut. Les projets marqués comme "Gagné" ou "Perdu" seront automatiquement archivés.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
