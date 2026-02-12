import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  GripVertical,
  Eye,
  Sparkles,
} from "lucide-react";

interface TemplateSection {
  id: string;
  title: string;
  content: string;
  order: number;
  required: boolean;
  variables: string[];
}

export default function ConsultantTemplateEditor() {
  const { id } = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const isEditMode = !!id;

  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateCategory, setTemplateCategory] = useState<"web" | "mobile" | "ecommerce" | "saas" | "custom">("web");
  const [sections, setSections] = useState<TemplateSection[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Load template if editing
  const { data: existingTemplate } = trpc.cdcTemplates.getById.useQuery(
    { id: parseInt(id || "0") },
    { enabled: isEditMode }
  );

  useEffect(() => {
    if (existingTemplate) {
      setTemplateName(existingTemplate.name);
      setTemplateDescription(existingTemplate.description || "");
      setTemplateCategory(existingTemplate.category);
      setSections(existingTemplate.sections || []);
      setIsPublic(existingTemplate.isPublic || false);
      setTags(existingTemplate.tags || []);
    }
  }, [existingTemplate]);

  const createMutation = trpc.cdcTemplates.create.useMutation({
    onSuccess: () => {
      alert("✅ Template créé avec succès !");
      setLocation("/consultant/templates");
    },
    onError: (error) => {
      alert(`❌ Erreur : ${error.message}`);
    },
  });

  const updateMutation = trpc.cdcTemplates.update.useMutation({
    onSuccess: () => {
      alert("✅ Template mis à jour avec succès !");
      setLocation("/consultant/templates");
    },
    onError: (error) => {
      alert(`❌ Erreur : ${error.message}`);
    },
  });

  const addSection = () => {
    const newSection: TemplateSection = {
      id: `section-${Date.now()}`,
      title: "Nouvelle section",
      content: "Contenu de la section...",
      order: sections.length,
      required: false,
      variables: [],
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, updates: Partial<TemplateSection>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const moveSection = (id: string, direction: "up" | "down") => {
    const index = sections.findIndex(s => s.id === id);
    if (index === -1) return;
    
    if (direction === "up" && index > 0) {
      const newSections = [...sections];
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
      newSections.forEach((s, i) => s.order = i);
      setSections(newSections);
    } else if (direction === "down" && index < sections.length - 1) {
      const newSections = [...sections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      newSections.forEach((s, i) => s.order = i);
      setSections(newSections);
    }
  };

  const extractVariables = (content: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = content.matchAll(regex);
    return Array.from(matches, m => `{{${m[1]}}}`);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      alert("⚠️ Veuillez donner un nom au template");
      return;
    }

    if (sections.length === 0) {
      alert("⚠️ Ajoutez au moins une section");
      return;
    }

    // Update variables for each section
    const sectionsWithVariables = sections.map(s => ({
      ...s,
      variables: extractVariables(s.content),
    }));

    const templateData = {
      name: templateName,
      description: templateDescription,
      category: templateCategory,
      sections: sectionsWithVariables,
      isPublic,
      tags,
    };

    if (isEditMode) {
      updateMutation.mutate({ id: parseInt(id!), ...templateData });
    } else {
      createMutation.mutate(templateData);
    }
  };

  const renderPreview = () => {
    const sampleData: Record<string, string> = {
      "{{client_name}}": "ACME Corporation",
      "{{budget}}": "50 000€",
      "{{deadline}}": "3 mois",
      "{{project_type}}": "Site e-commerce",
      "{{consultant_name}}": "Jean Dupont",
      "{{date}}": new Date().toLocaleDateString("fr-FR"),
    };

    return (
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{templateName}</h1>
        <p className="text-slate-600 mb-8">{templateDescription}</p>
        
        {sections.map((section, index) => {
          let content = section.content;
          Object.entries(sampleData).forEach(([variable, value]) => {
            content = content.replace(new RegExp(variable, 'g'), value);
          });

          return (
            <div key={section.id} className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                {index + 1}. {section.title}
              </h2>
              <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {content}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Prévisualisation</h1>
            <Button
              onClick={() => setShowPreview(false)}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'édition
            </Button>
          </div>
          {renderPreview()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/consultant/templates")}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-slate-900">
              {isEditMode ? "Modifier le template" : "Nouveau template CDC"}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
            >
              <Eye className="w-4 h-4 mr-2" />
              Prévisualiser
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-gradient-to-r from-[#d8232a] to-[#ff4d54]"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left: Template Settings */}
          <div className="col-span-1 space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold text-slate-900 mb-4">Paramètres</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Nom du template *
                  </label>
                  <Input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Ex: CDC Site E-commerce"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Description
                  </label>
                  <Textarea
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Décrivez ce template..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Catégorie *
                  </label>
                  <Select value={templateCategory} onValueChange={(v: any) => setTemplateCategory(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Site Web</SelectItem>
                      <SelectItem value="mobile">Application Mobile</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="isPublic" className="text-sm text-slate-700">
                    Partager avec les autres consultants
                  </label>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                      placeholder="Ajouter un tag"
                    />
                    <Button onClick={addTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)}>
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Variables disponibles :</p>
                  <ul className="space-y-1 text-xs">
                    <li><code>{'{{client_name}}'}</code> - Nom du client</li>
                    <li><code>{'{{budget}}'}</code> - Budget du projet</li>
                    <li><code>{'{{deadline}}'}</code> - Délai</li>
                    <li><code>{'{{project_type}}'}</code> - Type de projet</li>
                    <li><code>{'{{consultant_name}}'}</code> - Votre nom</li>
                    <li><code>{'{{date}}'}</code> - Date actuelle</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Sections Editor */}
          <div className="col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-900">Sections du template</h3>
              <Button onClick={addSection} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une section
              </Button>
            </div>

            {sections.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-slate-500 mb-4">Aucune section ajoutée</p>
                <Button onClick={addSection}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer la première section
                </Button>
              </Card>
            )}

            {sections.map((section, index) => (
              <Card key={section.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 mt-2">
                    <button
                      onClick={() => moveSection(section.id, "up")}
                      disabled={index === 0}
                      className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <GripVertical className="w-5 h-5 text-slate-400" />
                    <button
                      onClick={() => moveSection(section.id, "down")}
                      disabled={index === sections.length - 1}
                      className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={section.title}
                        onChange={(e) => updateSection(section.id, { title: e.target.value })}
                        placeholder="Titre de la section"
                        className="flex-1"
                      />
                      <Button
                        onClick={() => deleteSection(section.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <Textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, { content: e.target.value })}
                      placeholder="Contenu de la section... Utilisez {{variable}} pour les données dynamiques"
                      rows={6}
                      className="font-mono text-sm"
                    />

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`required-${section.id}`}
                        checked={section.required}
                        onChange={(e) => updateSection(section.id, { required: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor={`required-${section.id}`} className="text-sm text-slate-700">
                        Section obligatoire
                      </label>
                    </div>

                    {extractVariables(section.content).length > 0 && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                        <strong>Variables détectées :</strong>{" "}
                        {extractVariables(section.content).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
