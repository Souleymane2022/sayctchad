import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Plus, Pencil, Trash2, Lock, Shield, Download, Loader2, AlertCircle } from "lucide-react";
import { MemberCard } from "@/components/MemberCard";
import type { Opportunity, Partner, Training, NewsArticle, Event, Achievement, Member, ContactMessage, NewsletterSubscriber, ThunderbirdApplication, ElectionCandidate } from "@shared/schema";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (pw: string) => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      return data;
    },
    onSuccess: () => {
      setErrorMessage("");
      setIsLocked(false);
      onLogin();
      toast({ title: "Connecte", description: "Bienvenue dans le panneau d'administration" });
    },
    onError: (err: any) => {
      setPassword("");
      const message = err?.error || "Mot de passe incorrect";
      setErrorMessage(message);

      if (err?.lockedUntil) {
        setIsLocked(true);
        const updateTimer = () => {
          const remaining = err.lockedUntil - Date.now();
          if (remaining <= 0) {
            setIsLocked(false);
            setErrorMessage("");
            setLockTimer("");
            return;
          }
          const mins = Math.floor(remaining / 60000);
          const secs = Math.floor((remaining % 60000) / 1000);
          setLockTimer(`${mins}:${secs.toString().padStart(2, "0")}`);
          setTimeout(updateTimer, 1000);
        };
        updateTimer();
      }
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
        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-sm text-destructive text-center" data-testid="text-login-error">
            {errorMessage}
            {isLocked && lockTimer && (
              <p className="mt-1 font-mono font-semibold">{lockTimer}</p>
            )}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLocked) loginMutation.mutate(password);
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
                disabled={isLocked}
                data-testid="input-admin-password"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loginMutation.isPending || isLocked} data-testid="button-admin-login">
            {isLocked ? "Verrouille" : loginMutation.isPending ? "Connexion..." : "Se connecter"}
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

  const exportToExcel = () => {
    const headers = ["Prénom", "Nom", "Email", "Téléphone", "Ville", "Tranche d'âge", "ID Membre", "Date Inscription"];
    const rows = members.map(m => [
      m.firstName, m.lastName, m.email, m.phone, m.city, m.ageRange, m.membershipId, 
      m.createdAt ? new Date(m.createdAt).toLocaleString() : ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Membres_SAYC_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return <LoadingTable />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold" data-testid="text-title-members">Membres ({members.length})</h2>
        <Button variant="outline" onClick={exportToExcel} disabled={members.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Exporter Excel (CSV)
        </Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Tranche d'âge</TableHead>
              <TableHead>ID Membre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">Aucun membre</TableCell>
              </TableRow>
            ) : (
              members.map((m) => (
                <TableRow key={m.id} data-testid={`row-member-${m.id}`}>
                  <TableCell className="font-medium">{m.firstName} {m.lastName}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.phone}</TableCell>
                  <TableCell>{m.city}</TableCell>
                  <TableCell>{m.ageRange}</TableCell>
                  <TableCell className="font-mono text-xs">{m.membershipId}</TableCell>
                  <TableCell>{m.createdAt ? new Date(m.createdAt).toLocaleDateString("fr-FR") : ""}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Voir Carte</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl border-none p-0 bg-transparent shadow-none shadow-transparent">
                        <DialogHeader className="hidden">
                          <DialogTitle>Carte de Membre - {m.firstName}</DialogTitle>
                        </DialogHeader>
                        <MemberCard member={m} />
                      </DialogContent>
                    </Dialog>
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

function ThunderbirdApplicationsTab() {
  const { data: applications = [], isLoading } = useQuery<ThunderbirdApplication[]>({
    queryKey: ["/api/admin", "thunderbird-applications"],
    queryFn: async () => {
      const res = await fetch("/api/admin/thunderbird-applications", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const exportToExcel = () => {
    const headers = [
      "Nom Complet", "Email", "Téléphone", "Sexe", "Date de Naissance",
      "Ville", "Niveau Étude", "Institution", "Domaine", "Niveau Anglais",
      "Expérience En Ligne", "Détails Expérience", "Parcours", "Motivation",
      "Attentes", "Impact Communautaire", "Idée Projet", "Prêt Online",
      "Prêt Cohorte", "Disponibilité", "Source", "Date Inscription"
    ];

    const rows = applications.map(app => [
      app.fullName, app.email, app.phone, app.gender, app.dateOfBirth,
      app.city, app.educationLevel, app.schoolOrUniversity, app.fieldOfStudy, app.englishLevel,
      app.hasOnlineExperience ? "Oui" : "Non", app.experienceFields?.join("; "), app.targetPathway, app.motivation,
      app.expectations, app.communityImpact, app.projectIdea, app.readyForOnline ? "Oui" : "Non",
      app.readyForCohort ? "Oui" : "Non", app.timeCommitment, app.discoverySource, app.createdAt ? new Date(app.createdAt).toLocaleString() : ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Candidatures_Thunderbird_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return <LoadingTable />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold" data-testid="text-title-thunderbird">
          Candidatures Thunderbird ({applications.length})
        </h2>
        <Button variant="outline" onClick={exportToExcel} disabled={applications.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Exporter Excel (CSV)
        </Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom Complet</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Niveau d'anglais</TableHead>
              <TableHead>Parcours</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">Aucune candidature</TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app.id} data-testid={`row-thunderbird-${app.id}`}>
                  <TableCell className="font-medium">{app.fullName}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.phone}</TableCell>
                  <TableCell>{app.city}</TableCell>
                  <TableCell>{app.englishLevel}</TableCell>
                  <TableCell>{app.targetPathway}</TableCell>
                  <TableCell>{app.createdAt ? new Date(app.createdAt).toLocaleDateString("fr-FR") : ""}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Détails</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Détails de la candidature - {app.fullName}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Sexe</Label>
                            <p className="text-sm font-medium">{app.gender}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Date de naissance</Label>
                            <p className="text-sm font-medium">{app.dateOfBirth}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Niveau d'étude</Label>
                            <p className="text-sm font-medium">{app.educationLevel}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Institution/École</Label>
                            <p className="text-sm font-medium">{app.schoolOrUniversity}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Domaine d'étude</Label>
                            <p className="text-sm font-medium">{app.fieldOfStudy}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Expérience formations en ligne</Label>
                            <p className="text-sm font-medium">{app.hasOnlineExperience ? "Oui" : "Non"}</p>
                          </div>
                          <div className="col-span-1 md:col-span-2 space-y-1">
                            <Label className="text-xs text-muted-foreground">Champs d'expérience (si applicable)</Label>
                            <p className="text-sm font-medium">{app.experienceFields?.length ? app.experienceFields.join(", ") : "Aucun"}</p>
                          </div>
                          <div className="col-span-1 md:col-span-2 space-y-1">
                            <Label className="text-xs text-muted-foreground">Motivation</Label>
                            <p className="text-sm font-medium border p-2 rounded bg-muted/30">{app.motivation}</p>
                          </div>
                          <div className="col-span-1 md:col-span-2 space-y-1">
                            <Label className="text-xs text-muted-foreground">Attentes</Label>
                            <p className="text-sm font-medium border p-2 rounded bg-muted/30">{app.expectations}</p>
                          </div>
                          <div className="col-span-1 md:col-span-2 space-y-1">
                            <Label className="text-xs text-muted-foreground">Impact communautaire</Label>
                            <p className="text-sm font-medium border p-2 rounded bg-muted/30">{app.communityImpact}</p>
                          </div>
                          <div className="col-span-1 md:col-span-2 space-y-1">
                            <Label className="text-xs text-muted-foreground">Idée de projet numérique</Label>
                            <p className="text-sm font-medium border p-2 rounded bg-muted/30">{app.projectIdea}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Prêt pour formation en ligne ?</Label>
                            <p className="text-sm font-medium">{app.readyForOnline ? "Oui" : "Non"}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Prêt pour travail en cohorte ?</Label>
                            <p className="text-sm font-medium">{app.readyForCohort ? "Oui" : "Non"}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Disponibilité (h/semaine)</Label>
                            <p className="text-sm font-medium">{app.timeCommitment}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Source de découverte</Label>
                            <p className="text-sm font-medium">{app.discoverySource}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Cohorte / Session</Label>
                            <p className="text-sm font-medium">{app.cohort}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Statut administratif</Label>
                            <Badge variant={app.status === "pending" ? "outline" : "default"}>
                              {app.status}
                            </Badge>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
            <TabsTrigger value="thunderbird" data-testid="tab-thunderbird">Candidatures Thunderbird</TabsTrigger>
            <TabsTrigger value="elections" data-testid="tab-elections">Candidatures Élections</TabsTrigger>
            <TabsTrigger value="members" data-testid="tab-members">Membres</TabsTrigger>
            <TabsTrigger value="messages" data-testid="tab-messages">Messages</TabsTrigger>
            <TabsTrigger value="newsletter" data-testid="tab-newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="mass-email" data-testid="tab-mass-email">Email en Masse</TabsTrigger>
          </TabsList>

          {resourceConfigs.map((config) => (
            <TabsContent key={config.key} value={config.key}>
              <ResourceTab config={config} />
            </TabsContent>
          ))}

          <TabsContent value="thunderbird">
            <ThunderbirdApplicationsTab />
          </TabsContent>
          <TabsContent value="elections">
            <ElectionCandidatesTab />
          </TabsContent>
          <TabsContent value="members">
            <MembersTab />
          </TabsContent>
          <TabsContent value="messages">
            <MessagesTab />
          </TabsContent>
          <TabsContent value="newsletter">
            <NewsletterTab />
          </TabsContent>
          <TabsContent value="mass-email">
            <MassEmailTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ElectionCandidatesTab() {
  const { toast } = useToast();
  const { data: candidates = [], isLoading } = useQuery<(ElectionCandidate)[]>({
    queryKey: ["/api/admin/elections/candidates"],
    queryFn: async () => {
      const res = await fetch("/api/admin/elections/candidates", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/admin/elections/candidates/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/elections/candidates"] });
      toast({ title: "Statut mis à jour" });
    },
    onError: (error: Error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) return <LoadingTable />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Candidatures Élections ({candidates.length})</h2>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidat</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">Aucune candidature</TableCell>
              </TableRow>
            ) : (
              candidates.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <img src={c.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      {c.firstName} {c.lastName}
                    </div>
                  </TableCell>
                  <TableCell>{c.role}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "approved" ? "default" : c.status === "rejected" ? "destructive" : "outline"}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{c.votesCount}</TableCell>
                  <TableCell>{c.createdAt ? new Date(c.createdAt).toLocaleDateString("fr-FR") : ""}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Détails</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Dossier de Candidature - {c.firstName} {c.lastName}</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="col-span-2 flex justify-center py-4">
                                <img src={c.photoUrl} alt="" className="w-32 h-32 rounded-2xl object-cover border" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Poste</Label>
                              <p className="font-bold">{c.role}</p>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Email</Label>
                              <p>{c.email}</p>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">CV (Lien)</Label>
                              <a href={c.cvUrl} target="_blank" className="text-blue-600 hover:underline block truncate">Voir le CV</a>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Motivation (Lien)</Label>
                              <a href={c.motivationUrl} target="_blank" className="text-blue-600 hover:underline block truncate">Voir la motivation</a>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Vidéo (Lien)</Label>
                              <a href={c.videoUrl || "#"} target="_blank" className="text-blue-600 hover:underline block truncate">Voir la vidéo</a>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Vision/Programme (Lien)</Label>
                              <a href={c.programUrl || "#"} target="_blank" className="text-blue-600 hover:underline block truncate">Voir le programme</a>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 border-t pt-4">
                            <Button variant="outline" className="text-destructive" onClick={() => updateStatusMutation.mutate({ id: c.id, status: "rejected" })}>Rejeter</Button>
                            <Button className="bg-sayc-teal hover:bg-sayc-teal/90" onClick={() => updateStatusMutation.mutate({ id: c.id, status: "approved" })}>Approuver</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
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

function MassEmailTab() {
  const { toast } = useToast();
  const [target, setTarget] = useState("members");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [includeSada, setIncludeSada] = useState(true);

  const massEmailMutation = useMutation({
    mutationFn: async (data: { target: string; subject: string; message: string; includeSada: boolean }) => {
      const res = await apiRequest("POST", "/api/admin/mass-email", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Emails envoyés", description: `${data.sent} emails ont été envoyés avec succès.` });
      setSubject("");
      setMessage("");
    },
    onError: (error: Error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Envoi d'Email en Masse</h2>
        <p className="text-sm text-muted-foreground">Envoyez une communication officielle à un groupe ciblé de contacts.</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Groupe Cible</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              <option value="members">Tous les Membres</option>
              <option value="thunderbird">Candidats Thunderbird</option>
              <option value="elections_candidates">Candidats Élections</option>
              <option value="newsletter">Abonnés Newsletter</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Objet de l'email</Label>
            <Input 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Mise à jour importante sur les activités du SAYC"
            />
          </div>

          <div className="space-y-2">
            <Label>Message (Texte simple ou paragraphes)</Label>
            <Textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message ici..."
              className="min-h-[200px]"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="include-sada" 
              checked={includeSada} 
              onCheckedChange={setIncludeSada} 
            />
            <Label htmlFor="include-sada">Inclure la bannière SADA (Promotion des formations)</Label>
          </div>

          <Button 
            className="w-full h-12 bg-sayc-teal hover:bg-sayc-teal/90"
            onClick={() => massEmailMutation.mutate({ target, subject, message, includeSada })}
            disabled={massEmailMutation.isPending || !subject || !message}
          >
            {massEmailMutation.isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours...</>
            ) : (
              "Envoyer les emails"
            )}
          </Button>
        </CardContent>
      </Card>
      
      <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold uppercase">
          <AlertCircle className="w-4 h-4" /> Note Importante
        </div>
        <p>L'envoi peut prendre quelques minutes selon le nombre de destinataires. Un délai de sécurité est appliqué entre chaque email pour éviter d'être marqué comme spam.</p>
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
