import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, DollarSign, Clock, Target, Users, Calendar } from "lucide-react";
import { useLocation } from "wouter";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#d8232a", "#ff4d54", "#b01d23", "#ff6b6b", "#ff9999", "#ffcccc"];

export default function ConsultantAnalytics() {
  const [, navigate] = useLocation();
  const [selectedYear] = useState(new Date().getFullYear());
  const [selectedMonth] = useState(new Date().getMonth() + 1);

  const { data: pipelineStats } = trpc.crm.pipeline.stats.useQuery();
  const { data: monthlyRevenue } = trpc.crm.analytics.monthlyRevenue.useQuery({
    year: selectedYear,
    month: selectedMonth,
  });
  const { data: averageClosingTime } = trpc.crm.analytics.averageClosingTime.useQuery();
  const { data: allProjects = [] } = trpc.projects.list.useQuery();

  // Prepare data for charts
  const pipelineChartData = pipelineStats?.byStage.map((stage: any) => ({
    name: stage.stage === "lead" ? "Lead" :
          stage.stage === "qualified" ? "Qualifié" :
          stage.stage === "quote_sent" ? "Devis envoyé" :
          stage.stage === "negotiation" ? "Négociation" :
          stage.stage === "won" ? "Gagné" : "Perdu",
    count: Number(stage.count),
    value: Number(stage.totalValue || 0),
  })) || [];

  const urgencyDistribution = [
    { name: "Urgent", value: allProjects.filter(p => p.urgency === "high").length },
    { name: "Normal", value: allProjects.filter(p => p.urgency === "medium").length },
    { name: "Bas", value: allProjects.filter(p => p.urgency === "low").length },
  ];

  const complexityDistribution = [
    { name: "Simple", value: allProjects.filter(p => p.complexity === "simple").length },
    { name: "Moyen", value: allProjects.filter(p => p.complexity === "medium").length },
    { name: "Complexe", value: allProjects.filter(p => p.complexity === "complex").length },
  ];

  // Calculate monthly trends (last 6 months)
  const monthlyTrends = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString("fr-FR", { month: "short" });
    
    const monthProjects = allProjects.filter(p => {
      const projectDate = new Date(p.createdAt);
      return projectDate.getMonth() === date.getMonth() && 
             projectDate.getFullYear() === date.getFullYear();
    });

    monthlyTrends.push({
      month: monthName,
      leads: monthProjects.length,
      won: monthProjects.filter(p => p.pipelineStage === "won").length,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
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
              <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Analytique</h1>
              <p className="text-sm text-gray-600">Vue d'ensemble des performances commerciales</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-imotion-red to-imotion-orange text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">CA Prévisionnel</p>
                <p className="text-3xl font-bold mt-1">
                  {monthlyRevenue?.projected.toLocaleString()}€
                </p>
                <p className="text-xs opacity-75 mt-1">Ce mois-ci</p>
              </div>
              <DollarSign className="w-12 h-12 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">CA Réalisé</p>
                <p className="text-3xl font-bold mt-1">
                  {monthlyRevenue?.actual.toLocaleString()}€
                </p>
                <p className="text-xs opacity-75 mt-1">Ce mois-ci</p>
              </div>
              <Target className="w-12 h-12 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Taux de Conversion</p>
                <p className="text-3xl font-bold mt-1">
                  {pipelineStats?.conversionRate.toFixed(1)}%
                </p>
                <p className="text-xs opacity-75 mt-1">Global</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Temps Moyen</p>
                <p className="text-3xl font-bold mt-1">{averageClosingTime || 0}j</p>
                <p className="text-xs opacity-75 mt-1">Closing time</p>
              </div>
              <Clock className="w-12 h-12 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pipeline Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-imotion-red" />
              Distribution du Pipeline
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#d8232a" name="Nombre de projets" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Monthly Trends */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-imotion-red" />
              Évolution Mensuelle
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="leads" stroke="#d8232a" name="Nouveaux leads" strokeWidth={2} />
                <Line type="monotone" dataKey="won" stroke="#10b981" name="Projets gagnés" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Urgency Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Répartition par Urgence</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={urgencyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {urgencyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Complexity Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Répartition par Complexité</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complexityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {complexityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Pipeline Value Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-imotion-red" />
            Valeur par Étape du Pipeline
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value.toLocaleString()}€`} />
              <Legend />
              <Bar dataKey="value" fill="#ff4d54" name="Valeur totale (€)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Summary Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Statistiques Globales</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-imotion-red">{pipelineStats?.total || 0}</div>
              <div className="text-sm text-gray-600 mt-1">Total Projets</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{pipelineStats?.won || 0}</div>
              <div className="text-sm text-gray-600 mt-1">Gagnés</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{pipelineStats?.lost || 0}</div>
              <div className="text-sm text-gray-600 mt-1">Perdus</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {allProjects.filter(p => p.status === "active").length}
              </div>
              <div className="text-sm text-gray-600 mt-1">En Cours</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
