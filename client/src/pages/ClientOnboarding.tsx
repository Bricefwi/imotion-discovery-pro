import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Building2, User, Briefcase, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

const TOTAL_STEPS = 4;

export default function ClientOnboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Company Identification
    siret: "",
    siren: "",
    companyName: "",
    legalForm: "",
    sector: "",
    subSector: "",
    // Step 2: Company Size & Details
    employeeCount: "" as "" | "1" | "2-10" | "11-50" | "51-200" | "201-500" | "500+",
    annualRevenue: "" as "" | "<100k" | "100k-500k" | "500k-1M" | "1M-5M" | "5M-10M" | "10M+",
    foundedYear: undefined as number | undefined,
    website: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    // Step 3: Your Role
    firstName: "",
    lastName: "",
    jobTitle: "",
    department: "",
    seniority: "" as "" | "<1year" | "1-3years" | "3-5years" | "5-10years" | "10+years",
    isDecisionMaker: false,
    decisionLevel: "" as "" | "final" | "influencer" | "recommender" | "user",
    // Step 4: Additional Context
    companyDescription: "",
    mainProducts: "",
    targetMarket: "",
    competitors: [] as string[],
  });

  const createProfile = trpc.clientProfile.create.useMutation({
    onSuccess: () => {
      toast.success("Profil créé avec succès !");
      setLocation("/client/projects");
    },
    onError: (error: any) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Filter out empty strings and convert to undefined
      const cleanedData: any = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          cleanedData[key] = value;
        }
      });
      await createProfile.mutateAsync(cleanedData);
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.img
            src="/logoImotion.png"
            alt="IMOTION"
            className="h-16 mx-auto mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <h1 className="text-4xl font-bold text-white mb-2">
            Bienvenue chez IMOTION
          </h1>
          <p className="text-zinc-400 text-lg">
            Complétez votre profil pour démarrer votre projet
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-zinc-400">
              Étape {currentStep} sur {TOTAL_STEPS}
            </span>
            <span className="text-sm text-zinc-400">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800 p-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-[#d8232a] to-[#ff4d54] rounded-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Identification de votre entreprise
                    </h2>
                    <p className="text-zinc-400">
                      Informations légales et administratives
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="siret" className="text-white">
                        SIRET <span className="text-zinc-500">(optionnel)</span>
                      </Label>
                      <Input
                        id="siret"
                        value={formData.siret}
                        onChange={(e) => handleInputChange("siret", e.target.value)}
                        placeholder="123 456 789 00012"
                        className="bg-zinc-800/50 border-zinc-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="siren" className="text-white">
                        SIREN <span className="text-zinc-500">(optionnel)</span>
                      </Label>
                      <Input
                        id="siren"
                        value={formData.siren}
                        onChange={(e) => handleInputChange("siren", e.target.value)}
                        placeholder="123 456 789"
                        className="bg-zinc-800/50 border-zinc-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="companyName" className="text-white">
                      Raison sociale <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      placeholder="Nom de votre entreprise"
                      required
                      className="bg-zinc-800/50 border-zinc-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="legalForm" className="text-white">
                        Forme juridique
                      </Label>
                      <Select
                        value={formData.legalForm}
                        onValueChange={(value) => handleInputChange("legalForm", value)}
                      >
                        <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SARL">SARL</SelectItem>
                          <SelectItem value="SAS">SAS</SelectItem>
                          <SelectItem value="SA">SA</SelectItem>
                          <SelectItem value="EURL">EURL</SelectItem>
                          <SelectItem value="SCI">SCI</SelectItem>
                          <SelectItem value="Auto-entrepreneur">Auto-entrepreneur</SelectItem>
                          <SelectItem value="Association">Association</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="sector" className="text-white">
                        Secteur d'activité
                      </Label>
                      <Input
                        id="sector"
                        value={formData.sector}
                        onChange={(e) => handleInputChange("sector", e.target.value)}
                        placeholder="Ex: E-commerce, Santé..."
                        className="bg-zinc-800/50 border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-[#d8232a] to-[#ff4d54] rounded-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Taille et coordonnées
                    </h2>
                    <p className="text-zinc-400">
                      Informations sur votre entreprise
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employeeCount" className="text-white">
                        Effectif
                      </Label>
                      <Select
                        value={formData.employeeCount}
                        onValueChange={(value) => handleInputChange("employeeCount", value)}
                      >
                        <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 (Solo)</SelectItem>
                          <SelectItem value="2-10">2-10</SelectItem>
                          <SelectItem value="11-50">11-50</SelectItem>
                          <SelectItem value="51-200">51-200</SelectItem>
                          <SelectItem value="201-500">201-500</SelectItem>
                          <SelectItem value="500+">500+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="annualRevenue" className="text-white">
                        Chiffre d'affaires annuel
                      </Label>
                      <Select
                        value={formData.annualRevenue}
                        onValueChange={(value) => handleInputChange("annualRevenue", value)}
                      >
                        <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<100k">{"< 100k €"}</SelectItem>
                          <SelectItem value="100k-500k">100k - 500k €</SelectItem>
                          <SelectItem value="500k-1M">500k - 1M €</SelectItem>
                          <SelectItem value="1M-5M">1M - 5M €</SelectItem>
                          <SelectItem value="5M-10M">5M - 10M €</SelectItem>
                          <SelectItem value="10M+">{"> 10M €"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="website" className="text-white">
                        Site web
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        placeholder="https://www.exemple.fr"
                        className="bg-zinc-800/50 border-zinc-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white">
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+33 1 23 45 67 89"
                        className="bg-zinc-800/50 border-zinc-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-white">
                      Adresse
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Numéro et nom de rue"
                      className="bg-zinc-800/50 border-zinc-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="postalCode" className="text-white">
                        Code postal
                      </Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        placeholder="75001"
                        className="bg-zinc-800/50 border-zinc-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city" className="text-white">
                        Ville
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Paris"
                        className="bg-zinc-800/50 border-zinc-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-white">
                        Pays
                      </Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        className="bg-zinc-800/50 border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-[#d8232a] to-[#ff4d54] rounded-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Votre rôle dans l'entreprise
                    </h2>
                    <p className="text-zinc-400">
                      Qui êtes-vous et quelle est votre fonction ?
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white">
                        Prénom <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                        className="bg-zinc-800/50 border-zinc-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white">
                        Nom <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                        className="bg-zinc-800/50 border-zinc-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="jobTitle" className="text-white">
                      Fonction / Poste <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                      placeholder="Ex: Directeur Marketing, CEO..."
                      required
                      className="bg-zinc-800/50 border-zinc-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department" className="text-white">
                        Département
                      </Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        placeholder="Ex: Marketing, IT..."
                        className="bg-zinc-800/50 border-zinc-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seniority" className="text-white">
                        Ancienneté dans l'entreprise
                      </Label>
                      <Select
                        value={formData.seniority}
                        onValueChange={(value) => handleInputChange("seniority", value)}
                      >
                        <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<1year">{"< 1 an"}</SelectItem>
                          <SelectItem value="1-3years">1-3 ans</SelectItem>
                          <SelectItem value="3-5years">3-5 ans</SelectItem>
                          <SelectItem value="5-10years">5-10 ans</SelectItem>
                          <SelectItem value="10+years">{"> 10 ans"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="decisionLevel" className="text-white">
                      Niveau de décision
                    </Label>
                    <Select
                      value={formData.decisionLevel}
                      onValueChange={(value) => {
                        handleInputChange("decisionLevel", value);
                        handleInputChange("isDecisionMaker", value === "final");
                      }}
                    >
                      <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="final">Décisionnaire final</SelectItem>
                        <SelectItem value="influencer">Influenceur</SelectItem>
                        <SelectItem value="recommender">Recommandeur</SelectItem>
                        <SelectItem value="user">Utilisateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-[#d8232a] to-[#ff4d54] rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Contexte additionnel
                    </h2>
                    <p className="text-zinc-400">
                      Aidez-nous à mieux comprendre votre entreprise
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyDescription" className="text-white">
                      Description de votre entreprise
                    </Label>
                    <Textarea
                      id="companyDescription"
                      value={formData.companyDescription}
                      onChange={(e) => handleInputChange("companyDescription", e.target.value)}
                      placeholder="Décrivez votre activité, votre mission, vos valeurs..."
                      rows={4}
                      className="bg-zinc-800/50 border-zinc-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mainProducts" className="text-white">
                      Produits / Services principaux
                    </Label>
                    <Textarea
                      id="mainProducts"
                      value={formData.mainProducts}
                      onChange={(e) => handleInputChange("mainProducts", e.target.value)}
                      placeholder="Quels sont vos produits ou services phares ?"
                      rows={3}
                      className="bg-zinc-800/50 border-zinc-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetMarket" className="text-white">
                      Marché cible
                    </Label>
                    <Textarea
                      id="targetMarket"
                      value={formData.targetMarket}
                      onChange={(e) => handleInputChange("targetMarket", e.target.value)}
                      placeholder="Qui sont vos clients ? B2B, B2C, secteurs spécifiques..."
                      rows={3}
                      className="bg-zinc-800/50 border-zinc-700 text-white"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
              className="border-zinc-700 text-white hover:bg-zinc-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-[#d8232a] to-[#ff4d54] hover:opacity-90 text-white"
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createProfile.isPending}
                className="bg-gradient-to-r from-[#d8232a] to-[#ff4d54] hover:opacity-90 text-white"
              >
                {createProfile.isPending ? "Création..." : "Terminer"}
                <CheckCircle2 className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          Vos données sont sécurisées et confidentielles
        </p>
      </motion.div>
    </div>
  );
}
