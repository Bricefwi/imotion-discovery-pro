import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye, Download, Loader2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface DocumentPreviewProps {
  projectId: number;
  documentType: "cdc" | "contract";
  onGenerate: (format: "pdf" | "word" | "both") => void;
  isGenerating?: boolean;
}

export function DocumentPreview({
  projectId,
  documentType,
  onGenerate,
  isGenerating = false,
}: DocumentPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "word" | "both">("pdf");

  const { data: preview, isLoading } = trpc.documents.previewDocument.useQuery(
    { projectId, type: documentType },
    { enabled: isOpen }
  );

  const handleGenerate = () => {
    onGenerate(selectedFormat);
    setIsOpen(false);
  };

  const getDocumentTitle = () => {
    return documentType === "cdc" ? "Cahier des Charges" : "Contrat Commercial";
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="mr-2"
      >
        <Eye className="w-4 h-4 mr-2" />
        Prévisualiser
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>
                Prévisualisation : {getDocumentTitle()}
              </DialogTitle>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#d8232a] animate-spin" />
              <p className="ml-3 text-slate-600">Génération de la prévisualisation...</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto border rounded-lg p-6 bg-white">
                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown>{preview?.markdown || ""}</ReactMarkdown>
                </div>
              </div>

              <DialogFooter className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    Format :
                    <select
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value as any)}
                      className="border rounded px-3 py-1"
                    >
                      <option value="pdf">PDF</option>
                      <option value="word">Word (.docx)</option>
                      <option value="both">PDF + Word</option>
                    </select>
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="outline"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-[#d8232a] to-[#ff4d54]"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Générer et télécharger
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
