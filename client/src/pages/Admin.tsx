import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Plus, Pencil, Trash2, Lock, Shield } from "lucide-react";
import type { Opportunity, Partner, Training, NewsArticle, Event, Achievement, Member, ContactMessage, NewsletterSubscriber } from "@shared/schema";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const loginMutation = useMutation({
    mutationFn: async (pw: string) => {
      await apiRequest("POST", "/api/admin/login", { password: pw });
    },
    onSuccess: () => {
      onLogin();
      toast({ title: "Connecté", description: "Bienvenue dans le panneau d'administration" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Mot de passe incorrect", variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Shield className="h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold" data-testid="text-admin-title">Administration SAYC Tchad</h1>
          <p className="text-sm text-muted-foreground">Entrez le mot de passe administrateur</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginMutation.mutate(password);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder="Entrez le mot de passe"
                data-testid="input-admin-password"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loginMutation.isPending} data-testid="button-admin-login">
            {loginMutation.isPending ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function LoadingTable() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

type ResourceConfig = {
  key: string;
  label: string;
  fields: { name: string; label: string; type?: string; required?: boolean }[];
  columns: { key: string; label: string }[];
};

const resourceConfigs: ResourceConfig[] = [
  {
    key: "opportunities",
    label: "Opportunités",
    fields: [
      { name: "title", label: "Titre", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "category", label: "Catégorie", required: true },
      { name: "organization", label: "Organisation", required: true },
      { name: "deadline", label: "Date limite", required: true },
      { name: "location", label: "Lieu" },
      { name: "link", label: "Lien" },
    ],
    columns: [
      { key: "title", label: "Titre" },
      { key: "category", label: "Catégorie" },
      { key: "organization", label: "Organisation" },
      { key: "deadline", label: "Date limite" },
    ],
  },
  {
    key: "partners",
    label: "Partenaires",
    fields: [
      { name: "name", label: "Nom", required: true },
      { name: "logoUrl", label: "URL du logo" },
      { name: "websiteUrl", label: "Site web" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sortOrder", label: "Ordre", type: "number" },
    ],
    columns: [
      { key: "name", label: "Nom" },
      { key: "websiteUrl", label: "Site web" },
      { key: "sortOrder", label: "Ordre" },
    ],
  },
  {
    key: "trainings",
    label: "Formations",
    fields: [
      { name: "title", label: "Titre", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "provider", label: "Fournisseur", required: true },
      { name: "level", label: "Niveau" },
      { name: "duration", label: "Durée" },
      { name: "link", label: "Lien" },
      { name: "imageUrl", label: "URL de l'image" },
    ],
    columns: [
      { key: "title", label: "Titre" },
      { key: "provider", label: "Fournisseur" },
      { key: "level", label: "Niveau" },
      { key: "duration", label: "Durée" },
    ],
  },
  {
    key: "news",
    label: "Actualités",
    fields: [
      { name: "title", label: "Titre", required: true },
      { name: "excerpt", label: "Extrait", type: "textarea", required: true },
      { name: "content", label: "Contenu", type: "textarea" },
      { name: "category", label: "Catégorie", required: true },
      { name: "imageUrl", label: "URL de l'image" },
      { name: "publishedAt", label: "Date de publication", required: true },
    ],
    columns: [
      { key: "title", label: "Titre" },
      { key: "category", label: "Catégorie" },
      { key: "publishedAt", label: "Date" },
    ],
  },
  {
    key: "events",
    label: "Événements",
    fields: [
      { name: "title", label: "Titre", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "date", label: "Date", required: true },
      { name: "time", label: "Heure" },
      { name: "location", label: "Lieu" },
      { name: "type", label: "Type", required: true },
      { name: "registrationLink", label: "Lien d'inscription" },
    ],
    columns: [
      { key: "title", label: "Titre" },
      { key: "date", label: "Date" },
      { key: "type", label: "Type" },
      { key: "location", label: "Lieu" },
    ],
  },
  {
    key: "achievements",
    label: "Réalisations",
    fields: [
      { name: "title", label: "Titre", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "metricValue", label: "Valeur métrique", required: true },
      { name: "metricLabel", label: "Label métrique", required: true },
    ],
    columns: [
      { key: "title", label: "Titre" },
      { key: "metricValue", label: "Valeur" },
      { key: "metricLabel", label: "Label" },
    ],
  },
];

function ResourceForm({
  config,
  initialData,
  onSubmit,
  isPending,
}: {
  config: ResourceConfig;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  isPending: boolean;
}) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const d: Record<string, any> = {};
    config.fields.forEach((f) => {
      d[f.name] = initialData?.[f.name] ?? "";
    });
    return d;
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const cleaned: Record<string, any> = {};
        config.fields.forEach((f) => {
          const val = formData[f.name];
          if (f.type === "number") {
            cleaned[f.name] = val === "" ? 99 : Number(val);
          } else {
            cleaned[f.name] = val || (f.required ? "" : undefined);
          }
        });
        onSubmit(cleaned);
      }}
      className="space-y-4"
    >
      {config.fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={`field-${field.name}`}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {field.type === "textarea" ? (
            <Textarea
              id={`field-${field.name}`}
              value={formData[field.name] ?? ""}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              required={field.required}
              data-testid={`input-${field.name}`}
            />
          ) : (
            <Input
              id={`field-${field.name}`}
              type={field.type || "text"}
              value={formData[field.name] ?? ""}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              required={field.required}
              data-testid={`input-${field.name}`}
            />
          )}
        </div>
      ))}
      <Button type="submit" disabled={isPending} className="w-full" data-testid="button-submit-form">
        {isPending ? "Enregistrement..." : initialData ? "Mettre à jour" : "Créer"}
      </Button>
    </form>
  );
}

function ResourceTab({ config }: { config: ResourceConfig }) {
  const { toast } = useToast();
  const [editItem, setEditItem] = useState<Record<string, any> | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { data: items = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin", config.key],
    queryFn: async () => {
      const res = await fetch(`/api/admin/${config.key}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await apiRequest("PUT", `/api/admin/${config.key}/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin", config.key] });
      toast({ title: "Statut mis à jour" });
    },
    onError: () => {
      toast({ title: "Erreur", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/${config.key}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin", config.key] });
      toast({ title: "Élément supprimé" });
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      await apiRequest("POST", `/api/${config.key}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin", config.key] });
      setAddOpen(false);
      toast({ title: "Élément créé avec succès" });
    },
    onError: () => {
      toast({ title: "Erreur lors de la création", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, any> }) => {
      await apiRequest("PUT", `/api/admin/${config.key}/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin", config.key] });
      setEditOpen(false);
      setEditItem(null);
      toast({ title: "Élément mis à jour avec succès" });
    },
    onError: () => {
      toast({ title: "Erreur lors de la mise à jour", variant: "destructive" });
    },
  });

  if (isLoading) return <LoadingTable />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold" data-testid={`text-title-${config.key}`}>
          {config.label} ({items.length})
        </h2>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid={`button-add-${config.key}`}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter - {config.label}</DialogTitle>
            </DialogHeader>
            <ResourceForm
              config={config}
              onSubmit={(data) => createMutation.mutate(data)}
              isPending={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setEditItem(null); }}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier - {config.label}</DialogTitle>
          </DialogHeader>
          {editItem && (
            <ResourceForm
              config={config}
              initialData={editItem}
              onSubmit={(data) => updateMutation.mutate({ id: editItem.id, data })}
              isPending={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={config.columns.length + 2} className="text-center text-muted-foreground py-8">
                  Aucun élément
                </TableCell>
              </TableRow>
            ) : (
              items.map((item: any) => (
                <TableRow key={item.id} data-testid={`row-${config.key}-${item.id}`}>
                  {config.columns.map((col) => (
                    <TableCell key={col.key} className="max-w-[200px] truncate">
                      {String(item[col.key] ?? "")}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.isActive}
                        onCheckedChange={(checked) => toggleMutation.mutate({ id: item.id, isActive: checked })}
                        data-testid={`switch-active-${item.id}`}
                      />
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => { setEditItem(item); setEditOpen(true); }}
                        data-testid={`button-edit-${item.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" data-testid={`button-delete-${item.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(item.id)}
                              data-testid={`button-confirm-delete-${item.id}`}
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MembersTab() {
  const { data: members = [], isLoading } = useQuery<Member[]>({
    queryKey: ["/api/admin", "members"],
    queryFn: async () => {
      const res = await fetch("/api/admin/members", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (isLoading) return <LoadingTable />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold" data-testid="text-title-members">Membres ({members.length})</h2>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Tranche d'âge</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">Aucun membre</TableCell>
              </TableRow>
            ) : (
              members.map((m) => (
                <TableRow key={m.id} data-testid={`row-member-${m.id}`}>
                  <TableCell>{m.firstName} {m.lastName}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.phone}</TableCell>
                  <TableCell>{m.city}</TableCell>
                  <TableCell>{m.ageRange}</TableCell>
                  <TableCell>{m.createdAt ? new Date(m.createdAt).toLocaleDateString("fr-FR") : ""}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MessagesTab() {
  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin", "contact"],
    queryFn: async () => {
      const res = await fetch("/api/admin/contact", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (isLoading) return <LoadingTable />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold" data-testid="text-title-messages">Messages ({messages.length})</h2>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Aucun message</TableCell>
              </TableRow>
            ) : (
              messages.map((msg) => (
                <TableRow key={msg.id} data-testid={`row-message-${msg.id}`}>
                  <TableCell>{msg.firstName} {msg.lastName}</TableCell>
                  <TableCell>{msg.email}</TableCell>
                  <TableCell>{msg.subject}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{msg.message}</TableCell>
                  <TableCell>{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString("fr-FR") : ""}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function NewsletterTab() {
  const { data: subscribers = [], isLoading } = useQuery<NewsletterSubscriber[]>({
    queryKey: ["/api/admin", "newsletter"],
    queryFn: async () => {
      const res = await fetch("/api/admin/newsletter", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (isLoading) return <LoadingTable />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold" data-testid="text-title-newsletter">Newsletter ({subscribers.length})</h2>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Date d'inscription</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground py-8">Aucun abonné</TableCell>
              </TableRow>
            ) : (
              subscribers.map((sub) => (
                <TableRow key={sub.id} data-testid={`row-subscriber-${sub.id}`}>
                  <TableCell>{sub.email}</TableCell>
                  <TableCell>{sub.createdAt ? new Date(sub.createdAt).toLocaleDateString("fr-FR") : ""}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { toast } = useToast();
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      onLogout();
      toast({ title: "Déconnecté" });
    },
  });

  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-2 py-4 px-4">
          <div>
            <h1 className="text-xl font-bold" data-testid="text-dashboard-title">Administration SAYC Tchad</h1>
            <p className="text-sm text-muted-foreground">Gérer le contenu du site</p>
          </div>
          <Button variant="outline" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending} data-testid="button-admin-logout">
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>
      <div className="container mx-auto py-6 px-4">
        <Tabs defaultValue="opportunities">
          <TabsList className="flex flex-wrap gap-1 h-auto mb-6">
            <TabsTrigger value="opportunities" data-testid="tab-opportunities">Opportunités</TabsTrigger>
            <TabsTrigger value="partners" data-testid="tab-partners">Partenaires</TabsTrigger>
            <TabsTrigger value="trainings" data-testid="tab-trainings">Formations</TabsTrigger>
            <TabsTrigger value="news" data-testid="tab-news">Actualités</TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-events">Événements</TabsTrigger>
            <TabsTrigger value="achievements" data-testid="tab-achievements">Réalisations</TabsTrigger>
            <TabsTrigger value="members" data-testid="tab-members">Membres</TabsTrigger>
            <TabsTrigger value="messages" data-testid="tab-messages">Messages</TabsTrigger>
            <TabsTrigger value="newsletter" data-testid="tab-newsletter">Newsletter</TabsTrigger>
          </TabsList>

          {resourceConfigs.map((config) => (
            <TabsContent key={config.key} value={config.key}>
              <ResourceTab config={config} />
            </TabsContent>
          ))}

          <TabsContent value="members">
            <MembersTab />
          </TabsContent>
          <TabsContent value="messages">
            <MessagesTab />
          </TabsContent>
          <TabsContent value="newsletter">
            <NewsletterTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  const { } = useQuery({
    queryKey: ["/api/admin/check"],
    queryFn: async () => {
      const res = await fetch("/api/admin/check", { credentials: "include" });
      const data = await res.json();
      setIsAuthenticated(data.isAdmin);
      setChecking(false);
      return data;
    },
  });

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-64 w-96" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />;
}
