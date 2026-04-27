import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Plus, Pencil, Trash2, Lock, Shield, Download, Loader2, AlertCircle, Search, XCircle, Mail, Award, Users, Database, Sparkles, FileDown } from "lucide-react";
import { MemberCard } from "@/components/MemberCard";
import { processAndWatermark } from "@/lib/imageUtils";
import type { Opportunity, Partner, Training, NewsArticle, Event, Achievement, Member, ContactMessage, NewsletterSubscriber, ThunderbirdApplication, ElectionCandidate, AwsRestartApplication } from "@shared/schema";

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
      { name: "imageUrl", label: "Image à la une", type: "image-single" },
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
      { name: "imageUrl", label: "Image à la une", type: "image-single" },
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
      { name: "imageUrls", label: "Images (Multi)", type: "image-multi" },
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
      { name: "imageUrl", label: "Image à la une", type: "image-single" },
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

function SingleImageUpload({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void 
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const processed = await processAndWatermark(file);
      onChange(processed);
    } catch (error) {
      toast({ 
        title: "Erreur lors du traitement", 
        description: "Impossible d'ajouter l'image.", 
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
      e.target.value = ""; 
    }
  };

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative group w-full aspect-video border rounded-md overflow-hidden bg-muted max-w-sm mx-auto">
          <img src={value} className="w-full h-full object-cover" alt="Preview" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors max-w-sm mx-auto">
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Plus className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-2 font-medium">Capture "A la une" (Filigrane auto)</span>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
        </label>
      )}
    </div>
  );
}

function MultiImageUpload({ 
  value, 
  onChange 
}: { 
  value: string[]; 
  onChange: (value: string[]) => void 
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (value.length + files.length > 4) {
      toast({ 
        title: "Trop d'images", 
        description: "Vous ne pouvez pas ajouter plus de 4 images par article pour garantir la publication.", 
        variant: "destructive" 
      });
      return;
    }

    setIsProcessing(true);
    try {
      const newImages = await Promise.all(
        files.map(file => processAndWatermark(file))
      );
      onChange([...value, ...newImages]);
    } catch (error) {
      toast({ 
        title: "Erreur lors du traitement", 
        description: "Impossible d'ajouter certaines images.", 
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
      e.target.value = ""; // Reset input
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {(value || []).map((src, idx) => (
          <div key={idx} className="relative group aspect-square border rounded-md overflow-hidden bg-muted">
            <img src={src} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        ))}
        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Plus className="h-6 w-6 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-1 text-center px-1">Ajouter des images (Filigrane auto)</span>
            </>
          )}
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
        </label>
      </div>
    </div>
  );
}

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
      d[f.name] = initialData?.[f.name] ?? (f.type === "image-multi" ? [] : "");
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
            cleaned[f.name] = val || (f.required ? "" : (f.type === "image-multi" ? [] : undefined));
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
          ) : field.type === "image-multi" ? (
            <MultiImageUpload
              value={formData[field.name] || []}
              onChange={(newVal) => setFormData({ ...formData, [field.name]: newVal })}
            />
          ) : field.type === "image-single" ? (
            <SingleImageUpload
              value={formData[field.name] || ""}
              onChange={(newVal) => setFormData({ ...formData, [field.name]: newVal })}
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
          ) }
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
              <DialogDescription>
                Remplissez les informations ci-dessous pour ajouter un nouvel élément à {config.label}.
              </DialogDescription>
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
            <DialogDescription>
              Modifiez les informations ci-dessous pour mettre à jour cet élément de {config.label}.
            </DialogDescription>
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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");

  const { data: members = [], isLoading } = useQuery<Member[]>({
    queryKey: ["/api/admin", "members"],
    queryFn: async () => {
      const res = await fetch("/api/admin/members", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin", "members"] });
      toast({ title: "Membre supprimé" });
    },
    onError: (error: any) => {
      const details = error.details ? ` (${error.details})` : "";
      toast({ 
        title: "Erreur", 
        description: `${error.message}${details}`, 
        variant: "destructive" 
      });
    },
  });

  const generateIdsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/members/generate-ids");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin", "members"] });
      toast({ 
        title: "Génération terminée", 
        description: `${data.count} IDs de membres ont été générés.` 
      });
    },
    onError: (error: any) => {
      const details = error.details ? ` (${error.details})` : "";
      toast({ 
        title: "Erreur", 
        description: `${error.message}${details}`, 
        variant: "destructive" 
      });
    },
  });

  const sendVotingInfoMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/members/send-voting-info");
      return res.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "Envoi terminé", 
        description: `${data.sent} emails personnalisés ont été envoyés.` 
      });
    },
    onError: (error: any) => {
      const details = error.details ? ` (${error.details})` : "";
      toast({ 
        title: "Erreur d'envoi", 
        description: `${error.message}${details}`, 
        variant: "destructive" 
      });
    },
  });

  const exportToExcel = () => {
    const headers = ["Prénom", "Nom", "Email", "Téléphone", "Ville", "Tranche d'âge", "ID Membre", "Date Inscription"];
    const rows = members.map(m => [
      m.firstName, m.nomSpecifiqueUnique, m.email, m.phone, m.city, m.ageRange, m.membershipId, 
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

  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nomSpecifiqueUnique?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.membershipId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = cityFilter === "all" || m.city === cityFilter;
    const matchesAge = ageFilter === "all" || m.ageRange === ageFilter;

    return matchesSearch && matchesCity && matchesAge;
  });

  const cities = Array.from(new Set(members.map(m => m.city).filter(Boolean)));
  const ageRangesSet = Array.from(new Set(members.map(m => m.ageRange).filter(Boolean)));

  if (isLoading) return <LoadingTable />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold" data-testid="text-title-members">Membres ({filteredMembers.length} / {members.length})</h2>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (confirm("Voulez-vous envoyer les infos de vote personnalisées à TOUS les membres ? Cela enverra un email individuel avec leur ID membre.")) {
                sendVotingInfoMutation.mutate();
              }
            }} 
            disabled={sendVotingInfoMutation.isPending}
            className="text-xs border-blue-500/50 hover:bg-blue-500/10 text-blue-600 h-8 px-2 sm:h-9 sm:px-3"
            title="Envoyer Infos Vote"
          >
            {sendVotingInfoMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-0 sm:mr-2" /> : <Mail className="h-4 w-4 mr-0 sm:mr-2" />}
            <span className="hidden sm:inline">Envoyer Infos Vote</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => generateIdsMutation.mutate()} 
            disabled={generateIdsMutation.isPending}
            className="text-xs border-sayc-teal/50 hover:bg-sayc-teal/10 h-8 px-2 sm:h-9 sm:px-3"
            title="Générer les IDs manquants"
          >
            {generateIdsMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-0 sm:mr-2" /> : <Shield className="h-4 w-4 mr-0 sm:mr-2" />}
            <span className="hidden sm:inline">Générer les IDs</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToExcel} 
            disabled={filteredMembers.length === 0}
            className="h-8 px-2 sm:h-9 sm:px-3"
            title="Exporter Excel (CSV)"
          >
            <Download className="h-4 w-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="space-y-1">
          <Label className="text-xs">Rechercher</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Nom, email, ID..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Ville</Label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="all">Toutes les villes</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Tranche d'âge</Label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
          >
            <option value="all">Tous les âges</option>
            {ageRangesSet.map(age => <option key={age} value={age}>{age}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <Button 
            variant="ghost" 
            className="text-xs w-full" 
            onClick={() => {
              setSearchTerm("");
              setCityFilter("all");
              setAgeFilter("all");
            }}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed">
            <p className="text-muted-foreground">Aucun membre trouvé</p>
          </div>
        ) : (
          filteredMembers.map((m) => (
            <Card key={m.id} className="overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{m.firstName} {m.nomSpecifiqueUnique}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{m.membershipId}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{m.city}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Email</p>
                    <p className="truncate">{m.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Téléphone</p>
                    <p>{m.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Âge</p>
                    <p>{m.ageRange}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Inscription</p>
                    <p>{m.createdAt ? new Date(m.createdAt).toLocaleDateString("fr-FR") : "-"}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">Carte</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl border-none p-0 bg-transparent shadow-none w-[95vw]">
                      <MemberCard member={m} />
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[90vw] rounded-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Supprimer {m.firstName} ?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-destructive"
                          onClick={() => deleteMemberMutation.mutate(m.id)}
                        >
                          Oui
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
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
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                  <p>Aucun membre trouvé {searchTerm || cityFilter !== "all" || ageFilter !== "all" ? "avec ces filtres" : ""}</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((m) => (
                <TableRow key={m.id} data-testid={`row-member-${m.id}`}>
                  <TableCell className="font-medium">{m.firstName} {m.nomSpecifiqueUnique}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.phone}</TableCell>
                  <TableCell>{m.city}</TableCell>
                  <TableCell>{m.ageRange}</TableCell>
                  <TableCell className="font-mono text-xs">{m.membershipId}</TableCell>
                  <TableCell>{m.createdAt ? new Date(m.createdAt).toLocaleDateString("fr-FR") : ""}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Carte</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl border-none p-0 bg-transparent shadow-none shadow-transparent">
                          <DialogHeader className="hidden">
                            <DialogTitle>Carte de Membre - {m.firstName}</DialogTitle>
                          </DialogHeader>
                          <MemberCard member={m} />
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le membre ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. Toutes les données de <strong>{m.firstName} {m.nomSpecifiqueUnique}</strong> seront supprimées de la base de données.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deleteMemberMutation.mutate(m.id)}
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">Aucun message</TableCell>
              </TableRow>
            ) : (
              messages.map((msg) => (
                <MessageRow key={msg.id} msg={msg} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MessageRow({ msg }: { msg: ContactMessage }) {
  const [replyText, setReplyText] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();

  const replyMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(`/api/admin/contact/${msg.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "Réponse envoyée avec succès." });
      setReplyText("");
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  return (
    <TableRow data-testid={`row-message-${msg.id}`}>
      <TableCell>{msg.firstName} {msg.nomSpecifiqueUnique}</TableCell>
      <TableCell>{msg.email}</TableCell>
      <TableCell>{msg.subject}</TableCell>
      <TableCell className="max-w-[200px] truncate">{msg.message}</TableCell>
      <TableCell>{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString("fr-FR") : ""}</TableCell>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Voir & Répondre</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Message de {msg.firstName} {msg.nomSpecifiqueUnique}</DialogTitle>
              <p className="text-xs text-muted-foreground">{msg.email} - {msg.createdAt ? new Date(msg.createdAt).toLocaleString("fr-FR") : ""}</p>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Sujet</Label>
                <p className="font-bold">{msg.subject}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Message</Label>
                <div className="text-sm bg-muted/30 p-4 rounded-lg border whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto">
                  {msg.message}
                </div>
              </div>

              <div className="border-t pt-4 space-y-3 bg-sayc-teal/5 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-sayc-teal">
                  <Mail className="h-4 w-4" />
                  <Label className="font-bold">Envoyer une réponse par Email</Label>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Votre réponse sera envoyée directement à <strong>{msg.email}</strong> via le serveur SMTP de SAYC.
                </p>
                <Textarea 
                  placeholder="Tapez votre réponse ici..." 
                  className="min-h-[150px] bg-white"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <Button 
                  className="w-full bg-sayc-teal hover:bg-sayc-teal/90 text-white font-bold" 
                  disabled={!replyText.trim() || replyMutation.isPending}
                  onClick={() => replyMutation.mutate(replyText)}
                >
                  {replyMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : "Envoyer la réponse"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
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

function AwsRestartApplicationsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: applications = [], isLoading } = useQuery<AwsRestartApplication[]>({
    queryKey: ["/api/admin", "aws-restart-applications"],
    queryFn: async () => {
      const res = await fetch("/api/admin/aws-restart-applications", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = cityFilter === "all" || app.city === cityFilter;
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesCity && matchesStatus;
  });

  const cities = Array.from(new Set(applications.map(a => a.city).filter(Boolean)));
  const statuses = Array.from(new Set(applications.map(a => a.status).filter(Boolean)));

  const exportToExcel = () => {
    const headers = [
      "Nom Complet", "Email", "Téléphone", "Sexe", "Date de Naissance",
      "Ville", "Statut Professionnel", "Handicap", "Engagement Temps Plein",
      "Motivation", "Cohorte", "Statut Admin", "Date Inscription"
    ];

    const rows = applications.map(app => [
      app.fullName, app.email, app.phone, app.gender, app.dateOfBirth,
      app.city, app.professionalStatus, app.hasDisability, app.fullTimeCommitment ? "Oui" : "Non",
      app.motivation, app.cohort, app.status, app.createdAt ? new Date(app.createdAt).toLocaleString() : ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Candidatures_AWS_reStart_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return <LoadingTable />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF9900] rounded-lg flex items-center justify-center shadow-sm">
             <span className="text-white font-black text-xs">AWS</span>
          </div>
          <h2 className="text-lg font-semibold">
            Candidatures AWS re/Start ({filteredApps.length} / {applications.length})
          </h2>
        </div>
        <Button variant="outline" onClick={exportToExcel} disabled={filteredApps.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Exporter Excel (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground uppercase font-bold">Rechercher</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Nom ou email..." 
              className="pl-8 h-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground uppercase font-bold">Ville</Label>
          <select 
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="all">Toutes les villes</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground uppercase font-bold">Statut</Label>
          <select 
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs w-full h-9" 
            onClick={() => {
              setSearchTerm("");
              setCityFilter("all");
              setStatusFilter("all");
            }}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom Complet</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Statut Pro</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">Aucune candidature trouvée</TableCell>
              </TableRow>
            ) : (
              filteredApps.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.fullName}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.phone}</TableCell>
                  <TableCell>{app.city}</TableCell>
                  <TableCell className="text-xs">{app.professionalStatus}</TableCell>
                  <TableCell>
                    <Badge variant={app.status === "pending" ? "outline" : "default"}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{app.createdAt ? new Date(app.createdAt).toLocaleDateString("fr-FR") : ""}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Détails</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Détails AWS re/Start - {app.fullName}</DialogTitle>
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
                            <Label className="text-xs text-muted-foreground">Ville de résidence</Label>
                            <p className="text-sm font-medium">{app.city}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Handicap</Label>
                            <p className="text-sm font-medium">{app.hasDisability}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Engagement plein temps (12 sem)</Label>
                            <p className="text-sm font-medium">{app.fullTimeCommitment ? "Oui" : "Non"}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Cohorte</Label>
                            <p className="text-sm font-medium">{app.cohort}</p>
                          </div>
                          <div className="col-span-1 md:col-span-2 space-y-1 pt-2">
                             <Label className="text-xs text-muted-foreground font-bold">Motivation pour le Cloud & AWS</Label>
                             <div className="text-sm bg-muted/30 p-4 rounded-lg border whitespace-pre-wrap leading-relaxed">
                               {app.motivation}
                             </div>
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

function ThunderbirdApplicationsTab() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [pathwayFilter, setPathwayFilter] = useState("all");

  const { data: applications = [], isLoading } = useQuery<ThunderbirdApplication[]>({
    queryKey: ["/api/admin", "thunderbird-applications"],
    queryFn: async () => {
      const res = await fetch("/api/admin/thunderbird-applications", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = cityFilter === "all" || app.city === cityFilter;
    const matchesPathway = pathwayFilter === "all" || app.targetPathway === pathwayFilter;

    return matchesSearch && matchesCity && matchesPathway;
  });

  const cities = Array.from(new Set(applications.map(a => a.city).filter(Boolean)));
  const pathways = Array.from(new Set(applications.map(a => a.targetPathway).filter(Boolean)));

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
          Candidatures Thunderbird ({filteredApps.length} / {applications.length})
        </h2>
        <Button variant="outline" onClick={exportToExcel} disabled={filteredApps.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Exporter Excel (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground uppercase font-bold">Rechercher</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Nom ou email..." 
              className="pl-8 h-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground uppercase font-bold">Ville</Label>
          <select 
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="all">Toutes les villes</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground uppercase font-bold">Parcours</Label>
          <select 
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={pathwayFilter}
            onChange={(e) => setPathwayFilter(e.target.value)}
          >
            <option value="all">Tous les parcours</option>
            {pathways.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs w-full h-9" 
            onClick={() => {
              setSearchTerm("");
              setCityFilter("all");
              setPathwayFilter("all");
            }}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
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
            {filteredApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">Aucune candidature trouvée</TableCell>
              </TableRow>
            ) : (
              filteredApps.map((app) => (
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
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-4 py-4 px-4">
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-xl font-bold line-clamp-1" data-testid="text-dashboard-title">Administration SAYC</h1>
            <p className="text-xs text-muted-foreground">Gestion du portail</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/branding">
              <Button variant="outline" size="sm" className="gap-2 border-sayc-teal hover:bg-sayc-teal/10 text-sayc-teal">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Creative Studio (Branding)</span>
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending} data-testid="button-admin-logout">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-6 px-4">
        <Tabs defaultValue="opportunities">
          <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            <TabsList className="flex min-w-max md:min-w-0 md:flex-wrap gap-1 h-auto mb-2 md:mb-6 bg-transparent border-none p-0">
              <TabsTrigger value="opportunities" className="data-[state=active]:bg-sayc-teal data-[state=active]:text-white border">Opportunités</TabsTrigger>
              <TabsTrigger value="partners" className="border">Partenaires</TabsTrigger>
              <TabsTrigger value="trainings" className="border">Formations</TabsTrigger>
              <TabsTrigger value="news" className="border">Actualités</TabsTrigger>
              <TabsTrigger value="events" className="border">Événements</TabsTrigger>
              <TabsTrigger value="achievements" className="border">Réalisations</TabsTrigger>
              <TabsTrigger value="aws-restart" className="border text-orange-600 font-bold">AWS</TabsTrigger>
              <TabsTrigger value="thunderbird" className="border">T-Bird</TabsTrigger>
              <TabsTrigger value="elections" className="border">Élections</TabsTrigger>
              <TabsTrigger value="members" className="border">Membres</TabsTrigger>
              <TabsTrigger value="messages" className="border">Messages</TabsTrigger>
              <TabsTrigger value="newsletter" className="border">Newsletter</TabsTrigger>
              <TabsTrigger value="mass-email" className="border text-blue-600">Email Hub</TabsTrigger>
            </TabsList>
          </div>

          {resourceConfigs.map((config) => (
            <TabsContent key={config.key} value={config.key}>
              <ResourceTab config={config} />
            </TabsContent>
          ))}

          <TabsContent value="aws-restart">
            <AwsRestartApplicationsTab />
          </TabsContent>
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

function ElectionVotesHistory() {
  const { data: votes = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/elections/votes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/elections/votes", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch votes");
      return res.json();
    },
  });

  const exportVotesPDF = (role: string) => {
    const doc: any = new jsPDF();
    const filteredVotes = votes.filter(v => v.role === role);
    const dateStr = new Date().toLocaleDateString("fr-FR");

    doc.setFontSize(20);
    doc.text("SAYC TCHAD - ÉLECTIONS 2026", 14, 22);
    doc.setFontSize(14);
    doc.text(`Procès-Verbal d'Audit - Poste: ${role}`, 14, 32);
    doc.setFontSize(10);
    doc.text(`Généré le: ${dateStr}`, 14, 40);
    doc.text(`Nombre total de suffrages exprimés: ${filteredVotes.length}`, 14, 46);

    const tableData = filteredVotes.map(v => [
      v.voterId,
      `${v.candidateFirstName} ${v.candidateLastName}`,
      new Date(v.createdAt).toLocaleString("fr-FR")
    ]);

    doc.autoTable({
      startY: 55,
      head: [['Votant (ID - Email)', 'Candidat Choisi', 'Date & Heure']],
      body: tableData,
      headStyles: { fillStyle: [30, 58, 138] }, // #1e3a8a
      alternateRowStyles: { fillStyle: [241, 245, 249] },
    });

    doc.save(`Archive_Audit_SAYC_${role.replace(/\s+/g, '_')}.pdf`);
  };

  if (isLoading) return <LoadingTable />;

  const uniqueRoles = Array.from(new Set(votes.map(v => v.role)));

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Award className="w-5 h-5 text-sayc-teal" /> Registre détaillé des votes
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {uniqueRoles.map(role => (
            <Button 
              key={role} 
              variant="outline" 
              size="sm" 
              className="border-sayc-teal/50 hover:bg-sayc-teal/10"
              onClick={() => exportVotesPDF(role)}
            >
              <FileDown className="w-4 h-4 mr-2" /> PDF: {role}
            </Button>
          ))}
        </div>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Votant (ID - Email)</TableHead>
              <TableHead>Candidat Choisi</TableHead>
              <TableHead>Poste Électif</TableHead>
              <TableHead>Date et Heure du Vote</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {votes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">Aucun vote enregistré pour le moment.</TableCell>
              </TableRow>
            ) : (
              votes.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono text-xs">{v.voterId}</TableCell>
                  <TableCell className="font-medium text-[#1e3a8a]">{v.candidateFirstName} {v.candidateLastName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-50">{v.role}</Badge>
                  </TableCell>
                  <TableCell>{new Date(v.createdAt).toLocaleString("fr-FR")}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ElectionCandidatesTab() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: candidates = [], isLoading, error } = useQuery<(ElectionCandidate)[]>({
    queryKey: ["/api/admin/elections/candidates"],
    queryFn: async () => {
      const res = await fetch("/api/admin/elections/candidates", { credentials: "include" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || "Failed to fetch candidates");
      }
      return res.json();
    },
    retry: 1,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/admin/elections/candidates/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/elections/candidates"] });
      toast({ title: "Statut mis à jour" });
    },
    onError: (error: any) => {
      const details = error.details ? ` (${error.details})` : "";
      toast({ 
        title: "Erreur", 
        description: `${error.message}${details}`, 
        variant: "destructive" 
      });
    },
  });

  if (isLoading) return <LoadingTable />;

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/10 border border-destructive/20 rounded-xl space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
        <h3 className="text-xl font-bold text-destructive">Erreur de chargement</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {(error as Error).message}. Veuillez vérifier que la migration de base de données a été appliquée.
        </p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/elections/candidates"] })}>
          Réessayer
        </Button>
      </div>
    );
  }

  // Calculate stats
  const roles = ["Leader Adjoint", "Secteur Privé", "Académique", "Inclusion"];
  const stats = roles.map(role => {
    const roleCandidates = candidates.filter(c => c.role === role);
    const sorted = [...roleCandidates].sort((a, b) => (b.votesCount || 0) - (a.votesCount || 0));
    return {
      role,
      totalVotes: roleCandidates.reduce((acc, curr) => acc + (curr.votesCount || 0), 0),
      leader: sorted[0] || null,
      count: roleCandidates.length
    };
  });

  return (
    <Tabs defaultValue="candidates" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-[#1e3a8a]">{t("admin.elections.title")}</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <TabsList>
            <TabsTrigger value="candidates">Candidats</TabsTrigger>
            <TabsTrigger value="votes">Historique des Votes</TabsTrigger>
          </TabsList>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {t("admin.elections.total_applications", { count: candidates.length })}
          </Badge>
        </div>
      </div>

      <TabsContent value="candidates" className="space-y-8">
      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.role} className="border-none shadow-sm bg-slate-50/50">
            <CardContent className="pt-6 space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{s.role}</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-[#1e3a8a]">{s.totalVotes}</p>
                  <p className="text-[10px] text-muted-foreground">{t("admin.elections.votes_expressed")}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{s.count}</p>
                  <p className="text-[10px] text-muted-foreground">{t("admin.elections.candidate_label")}</p>
                </div>
              </div>
              {s.leader && s.totalVotes > 0 && (
                <div className="pt-2 border-t flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-sayc-teal/10 text-sayc-teal flex items-center justify-center">
                    <Award className="w-3 h-3" />
                  </div>
                  <p className="text-[11px] font-medium truncate">En tête: {s.leader.firstName}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-sayc-teal" /> {t("admin.elections.detailed_list")}
        </h3>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.elections.columns.candidate")}</TableHead>
                <TableHead>{t("admin.elections.columns.role")}</TableHead>
                <TableHead>{t("admin.elections.columns.email")}</TableHead>
                <TableHead>{t("admin.elections.columns.status")}</TableHead>
                <TableHead>{t("admin.elections.columns.votes")}</TableHead>
                <TableHead>{t("admin.elections.columns.date")}</TableHead>
                <TableHead>{t("admin.elections.columns.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">{t("admin.elections.no_entries")}</TableCell>
                </TableRow>
              ) : (
                candidates.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <img src={c.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                        {c.firstName} {c.nomSpecifiqueUnique}
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
                            <Button variant="outline" size="sm">{t("admin.elections.details")}</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{t("admin.elections.dialog_title")} - {c.firstName} {c.nomSpecifiqueUnique}</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                              <div className="col-span-2 flex justify-center py-4">
                                  <img src={c.photoUrl} alt="" className="w-32 h-32 rounded-2xl object-cover border" />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">{t("admin.elections.post")}</Label>
                                <p className="font-bold">{c.role}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">{t("admin.elections.columns.email")}</Label>
                                <p>{c.email}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">{t("admin.elections.columns.votes")}</Label>
                                <p className="font-bold text-sayc-teal">{c.votesCount}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">{t("admin.elections.cv")}</Label>
                                <a href={c.cvUrl} target="_blank" className="text-blue-600 hover:underline block truncate">{t("admin.elections.see")}</a>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">{t("admin.elections.motivation")}</Label>
                                <a href={c.motivationUrl} target="_blank" className="text-blue-600 hover:underline block truncate">{t("admin.elections.see")}</a>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">{t("admin.elections.video")}</Label>
                                <a href={c.videoUrl || "#"} target="_blank" className="text-blue-600 hover:underline block truncate">{t("admin.elections.see")}</a>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">{t("admin.elections.program")}</Label>
                                <a href={c.programUrl || "#"} target="_blank" className="text-blue-600 hover:underline block truncate">{t("admin.elections.see")}</a>
                              </div>
                              {c.linkedInUrl && (
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">LinkedIn</Label>
                                  <a href={c.linkedInUrl} target="_blank" className="text-blue-600 hover:underline block truncate">{t("admin.elections.see")}</a>
                                </div>
                              )}
                              {c.facebookUrl && (
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">Facebook</Label>
                                  <a href={c.facebookUrl} target="_blank" className="text-blue-600 hover:underline block truncate">{t("admin.elections.see")}</a>
                                </div>
                              )}
                              {c.twitterUrl && (
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">Twitter / X</Label>
                                  <a href={c.twitterUrl} target="_blank" className="text-blue-600 hover:underline block truncate">{t("admin.elections.see")}</a>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-end gap-2 border-t pt-4">
                              <Button variant="outline" className="text-destructive" onClick={() => updateStatusMutation.mutate({ id: c.id, status: "rejected" })}>{t("admin.elections.reject")}</Button>
                              <Button className="bg-sayc-teal hover:bg-sayc-teal/90" onClick={() => updateStatusMutation.mutate({ id: c.id, status: "approved" })}>{t("admin.elections.approve")}</Button>
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
      </TabsContent>
      <TabsContent value="votes">
        <ElectionVotesHistory />
      </TabsContent>
    </Tabs>
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
    onError: (error: any) => {
      const details = error.details ? ` (${error.details})` : "";
      toast({ 
        title: "Erreur", 
        description: `${error.message}${details}`, 
        variant: "destructive" 
      });
    },
  });

  const debugSmtpMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("GET", "/api/admin/debug-smtp");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "SMTP OK", description: "La connexion au serveur Gmail est opérationnelle." });
      } else {
        toast({ 
          title: "Erreur SMTP", 
          description: data.error || "Problème de configuration", 
          variant: "destructive" 
        });
      }
    },
    onError: (error: Error) => {
      toast({ title: "Erreur de diagnostic", description: error.message, variant: "destructive" });
    },
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Envoi d'Email en Masse</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => debugSmtpMutation.mutate()}
            disabled={debugSmtpMutation.isPending}
            className="text-xs text-muted-foreground hover:text-sayc-teal"
          >
            {debugSmtpMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Shield className="h-3 w-3 mr-1" />}
            Tester la connexion SMTP
          </Button>
        </div>
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
