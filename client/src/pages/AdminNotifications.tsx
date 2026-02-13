import { useState, useEffect } from "react";
import { useWebSocketEvent } from "@/hooks/useWebSocket";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, UserPlus, Check, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface UserRegistrationNotification {
  user: {
    id: number;
    name: string | null;
    email: string | null;
    role: string;
  };
  timestamp: Date;
}

export default function AdminNotifications() {
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState<UserRegistrationNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Listen to user registration events
  useWebSocketEvent<UserRegistrationNotification>('user:registered', (data) => {
    setNotifications(prev => [data, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show browser notification if permitted
    if (Notification.permission === "granted") {
      new Notification("Nouvelle inscription", {
        body: `${data.user.name || data.user.email} s'est inscrit(e)`,
        icon: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663057702655/ngknnkGqmlCKLNcm.png",
      });
    }
  });

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      visitor: "Visiteur",
      client: "Client",
      consultant: "Consultant",
      admin: "Administrateur",
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      visitor: "bg-gray-100 text-gray-700",
      client: "bg-blue-100 text-blue-700",
      consultant: "bg-purple-100 text-purple-700",
      admin: "bg-red-100 text-red-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setLocation("/consultant/dashboard")}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-6 h-6" />
                  Notifications d'inscription
                </h1>
                <p className="text-sm text-slate-600">
                  Suivez les nouvelles inscriptions en temps réel
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <Check className="w-4 h-4 mr-2" />
                Tout marquer comme lu ({unreadCount})
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Card */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-[#d8232a] to-[#ff4d54] text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Inscriptions aujourd'hui</h3>
              <p className="text-3xl font-bold">{notifications.length}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <UserPlus className="w-8 h-8" />
            </div>
          </div>
        </Card>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Aucune notification
            </h3>
            <p className="text-slate-600">
              Les nouvelles inscriptions apparaîtront ici en temps réel
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {notifications.map((notification, index) => (
                <motion.div
                  key={`${notification.user.id}-${notification.timestamp}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`p-4 ${index < unreadCount ? 'border-l-4 border-[#d8232a] bg-red-50' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="bg-gradient-to-br from-[#d8232a] to-[#ff4d54] p-3 rounded-full">
                          <UserPlus className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-900">
                              {notification.user.name || "Utilisateur sans nom"}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded ${getRoleColor(notification.user.role)}`}>
                              {getRoleLabel(notification.user.role)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">
                            {notification.user.email || "Email non renseigné"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          // Navigate to user profile or project
                          alert("Fonctionnalité à venir : voir le profil utilisateur");
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Voir le profil
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
