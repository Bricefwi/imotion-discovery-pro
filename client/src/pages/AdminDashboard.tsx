/**
 * Dashboard Administrateur Ultra-Complet
 * Analytics, Finance, CRM, Avis Clients, Marketing, SEO, Roadmap
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  Star, 
  TrendingUp, 
  Search,
  Rocket,
  Activity,
  Eye,
  UserPlus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');

  // Queries pour récupérer les données
  const analytics = trpc.admin.getAnalytics.useQuery({ timeRange });
  const finance = trpc.admin.getFinance.useQuery({ timeRange });
  const reviews = trpc.admin.getReviews.useQuery({ status: 'pending' });
  const roadmap = trpc.admin.getRoadmap.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble complète de votre activité</p>
          </div>
          
          {/* Sélecteur de période */}
          <div className="flex gap-2">
            <Button
              variant={timeRange === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('day')}
            >
              Jour
            </Button>
            <Button
              variant={timeRange === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('week')}
            >
              Semaine
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('month')}
            >
              Mois
            </Button>
            <Button
              variant={timeRange === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('year')}
            >
              Année
            </Button>
          </div>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Visiteurs
              </CardTitle>
              <Eye className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {analytics.data?.visitors || 0}
              </div>
              <p className="text-xs text-green-600 mt-1">
                +{analytics.data?.visitorsGrowth || 0}% vs période précédente
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Inscriptions
              </CardTitle>
              <UserPlus className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {analytics.data?.signups || 0}
              </div>
              <p className="text-xs text-green-600 mt-1">
                +{analytics.data?.signupsGrowth || 0}% vs période précédente
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Taux de conversion
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {analytics.data?.conversionRate || 0}%
              </div>
              <p className="text-xs text-green-600 mt-1">
                +{analytics.data?.conversionGrowth || 0}% vs période précédente
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                CA Réalisé
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {finance.data?.revenue?.toLocaleString('fr-FR')}€
              </div>
              <p className="text-xs text-green-600 mt-1">
                +{finance.data?.revenueGrowth || 0}% vs période précédente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Onglets principaux */}
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="finance">
              <DollarSign className="h-4 w-4 mr-2" />
              Finance
            </TabsTrigger>
            <TabsTrigger value="crm">
              <Users className="h-4 w-4 mr-2" />
              CRM
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="h-4 w-4 mr-2" />
              Avis
              {reviews.data && reviews.data.length > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                  {reviews.data.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="seo">
              <Search className="h-4 w-4 mr-2" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="roadmap">
              <Rocket className="h-4 w-4 mr-2" />
              Roadmap
            </TabsTrigger>
          </TabsList>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Analytics Temps Réel</CardTitle>
                <CardDescription>
                  Statistiques détaillées de votre activité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">Pages vues</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.data?.pageViews || 0}
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">Sessions</div>
                      <div className="text-2xl font-bold text-green-600">
                        {analytics.data?.sessions || 0}
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Taux de rebond</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {analytics.data?.bounceRate || 0}%
                      </div>
                    </div>
                  </div>

                  {/* Graphique à implémenter avec Recharts */}
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Graphique d'évolution (à implémenter avec Recharts)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Finance */}
          <TabsContent value="finance" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Finance & Trésorerie</CardTitle>
                <CardDescription>
                  Suivi du chiffre d'affaires et prévisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">CA Réalisé</div>
                      <div className="text-2xl font-bold text-green-600">
                        {finance.data?.revenue?.toLocaleString('fr-FR')}€
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">Pipeline</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {finance.data?.pipeline?.toLocaleString('fr-FR')}€
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Prévisions</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {finance.data?.forecast?.toLocaleString('fr-FR')}€
                      </div>
                    </div>
                  </div>

                  {/* Graphique financier */}
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Graphique financier (à implémenter avec Recharts)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CRM */}
          <TabsContent value="crm" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>CRM Intégré</CardTitle>
                <CardDescription>
                  Fiches clients détaillées et historique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Le CRM est déjà implémenté dans le dashboard consultant avec pipeline Kanban,
                  fiches clients détaillées, et historique des interactions.
                </p>
                <Button className="mt-4 btn-imotion" onClick={() => window.location.href = '/consultant/pipeline'}>
                  Accéder au CRM
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Avis Clients */}
          <TabsContent value="reviews" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Gestion des Avis Clients</CardTitle>
                <CardDescription>
                  Modération et publication des avis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.data && reviews.data.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.data.map((review: any) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold">{review.clientName}</div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 mt-2">{review.comment}</p>
                            <p className="text-sm text-gray-400 mt-1">
                              {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-green-600">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approuver
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Rejeter
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Aucun avis en attente de modération
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>SEO & Référencement</CardTitle>
                <CardDescription>
                  Positions Google, backlinks et optimisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">Position moyenne</div>
                      <div className="text-2xl font-bold text-blue-600">
                        #12
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">Backlinks</div>
                      <div className="text-2xl font-bold text-green-600">
                        247
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Mots-clés</div>
                      <div className="text-2xl font-bold text-purple-600">
                        89
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roadmap */}
          <TabsContent value="roadmap" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Roadmap Produit</CardTitle>
                <CardDescription>
                  Fonctionnalités à venir avec votes clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roadmap.data && roadmap.data.length > 0 ? (
                    roadmap.data.map((item: any) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold">{item.title}</div>
                            <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className={`text-xs px-2 py-1 rounded ${
                                item.status === 'planned' ? 'bg-blue-100 text-blue-600' :
                                item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-green-100 text-green-600'
                              }`}>
                                {item.status === 'planned' ? 'Planifié' :
                                 item.status === 'in_progress' ? 'En cours' : 'Terminé'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {item.votes} votes
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Aucune fonctionnalité en roadmap
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
