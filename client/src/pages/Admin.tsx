import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  MoreVertical,
  ChevronRight,
  UserPlus,
  Briefcase,
  Mail,
  Award,
  Vote,
  MoreHorizontal,
  XCircle,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  RefreshCcw,
  Edit2,
  GraduationCap
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Member, ContactMessage, newsArticles, events as Event, ElectionCandidate, ThunderbirdApplication } from "@shared/schema";
import { Link, useLocation } from "wouter";

// Admin Dashboard Component
export default function AdminDashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("members");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: members = [], isLoading: membersLoading } = useQuery<Member[]>({
    queryKey: ["/api/members"],
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact/messages"],
  });

  const { data: candidates = [], isLoading: candidatesLoading } = useQuery<ElectionCandidate[]>({
    queryKey: ["/api/admin/candidates"],
  });

  const { data: thunderbirdApps = [], isLoading: thunderbirdLoading } = useQuery<ThunderbirdApplication[]>({
    queryKey: ["/api/admin/thunderbird"],
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      toast({ title: "Membre supprimé", description: "Le membre a été retiré avec succès." });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de supprimer le membre.", variant: "destructive" });
    }
  });

  const updateCandidateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await apiRequest("PATCH", `/api/admin/candidates/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/candidates"] });
      toast({ title: "Statut mis à jour", description: "Le statut du candidat a été modifié." });
    }
  });

  const exportToExcel = () => {
    const headers = ["Prénom", "Nom", "Email", "Téléphone", "Ville", "Tranche d'âge", "ID Membre", "Date Inscription"];
    const rows = members.map(m => [
      m.firstName, m.nomSpecifiqueUnique, m.email, m.phone, m.city, m.ageRange, m.membershipId, 
      m.createdAt ? new Date(m.createdAt).toLocaleString() : ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sayc_tchad_members_${new Date().toISOString().slice(0,10)}.csv`);
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
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar Overlay for mobile */}
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
          <div className="p-6">
            <h1 className="text-xl font-heading font-bold text-sidebar-foreground">Admin SAYC</h1>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <button 
              onClick={() => setActiveTab("members")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${activeTab === 'members' ? 'bg-primary text-primary-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}
            >
              <Users className="w-4 h-4" />
              Membres
            </button>
            <button 
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${activeTab === 'messages' ? 'bg-primary text-primary-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}
            >
              <MessageSquare className="w-4 h-4" />
              Messages
            </button>
            <button 
              onClick={() => setActiveTab("elections")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${activeTab === 'elections' ? 'bg-primary text-primary-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}
            >
              <Vote className="w-4 h-4" />
              Élections
            </button>
            <button 
              onClick={() => setActiveTab("thunderbird")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${activeTab === 'thunderbird' ? 'bg-primary text-primary-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}
            >
              <GraduationCap className="w-4 h-4" />
              Thunderbird
            </button>
          </nav>
          <div className="p-4 border-t border-sidebar-border">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-medium">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <header className="bg-background border-b h-16 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">Tableau de bord</h2>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <Badge variant="secondary" className="hidden sm:inline-flex">Tchad</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">Site Public</Button>
              </Link>
            </div>
          </header>

          <div className="p-6">
            {activeTab === "members" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-heading font-bold">Gestion des Membres</h1>
                    <p className="text-muted-foreground">Consultez et gérez la liste des adhérents.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button onClick={exportToExcel} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter CSV
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          placeholder="Rechercher par nom, email ou ID..." 
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Badge variant="outline" className="font-mono">{filteredMembers.length} Membres</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nom Complet</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Téléphone</TableHead>
                            <TableHead>Ville</TableHead>
                            <TableHead>ID Membre</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {membersLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                              <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></TableCell>
                              </TableRow>
                            ))
                          ) : filteredMembers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                Aucun membre trouvé.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredMembers.map((m) => (
                              <TableRow key={m.id} data-testid={`row-member-${m.id}`}>
                                <TableCell className="font-medium">{m.firstName} {m.nomSpecifiqueUnique}</TableCell>
                                <TableCell>{m.email}</TableCell>
                                <TableCell>{m.phone}</TableCell>
                                <TableCell>{m.city}</TableCell>
                                <TableCell><span className="font-mono text-xs">{m.membershipId}</span></TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => window.open(`/verifier/${m.membershipId}`, '_blank')}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Voir Badge
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Supprimer
                                          </DropdownMenuItem>
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
                                              onClick={() => deleteMemberMutation.mutate(m.id)}
                                              className="bg-destructive text-destructive-foreground"
                                            >
                                              Supprimer
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-6">
                 <div>
                    <h1 className="text-2xl font-heading font-bold">Messages de Contact</h1>
                    <p className="text-muted-foreground">Réponses aux demandes formulées sur le site.</p>
                  </div>
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Expéditeur</TableHead>
                          <TableHead>Sujet</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {messagesLoading ? (
                          <TableRow><TableCell colSpan={4} className="text-center py-8">Chargement...</TableCell></TableRow>
                        ) : messages.length === 0 ? (
                          <TableRow><TableCell colSpan={4} className="text-center py-8">Aucun message.</TableCell></TableRow>
                        ) : (
                          messages.map((msg) => (
                            <TableRow key={msg.id}>
                              <TableCell className="font-medium">{msg.firstName} {msg.nomSpecifiqueUnique}</TableCell>
                              <TableCell>{msg.subject}</TableCell>
                              <TableCell className="text-xs">{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ""}</TableCell>
                              <TableCell className="text-right">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">Lire</Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>{msg.subject}</DialogTitle>
                                      <DialogDescription>De: {msg.firstName} {msg.nomSpecifiqueUnique} ({msg.email})</DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4 border-t mt-4">
                                      {msg.message}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </Card>
              </div>
            )}

            {activeTab === "elections" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-heading font-bold">Candidatures Élections</h1>
                  <Badge className="bg-sayc-orange">{candidates.length} Candidats</Badge>
                </div>
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidat</TableHead>
                        <TableHead>Poste</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Votes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidatesLoading ? (
                        <TableRow><TableCell colSpan={5} className="text-center py-8">Chargement...</TableCell></TableRow>
                      ) : candidates.map(c => (
                        <TableRow key={c.id}>
                          <TableCell className="flex items-center gap-2">
                             <img src={c.photoUrl} className="w-8 h-8 rounded-full" />
                             {c.firstName} {c.nomSpecifiqueUnique}
                          </TableCell>
                          <TableCell>{c.role}</TableCell>
                          <TableCell>
                            <Badge variant={c.status === 'approved' ? 'default' : c.status === 'rejected' ? 'destructive' : 'outline'}>
                              {c.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold">{c.votesCount}</TableCell>
                          <TableCell className="text-right gap-2">
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               onClick={() => updateCandidateStatusMutation.mutate({ id: c.id, status: 'approved' })}
                               disabled={c.status === 'approved'}
                             >
                               Approuver
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-destructive"
                               onClick={() => updateCandidateStatusMutation.mutate({ id: c.id, status: 'rejected' })}
                               disabled={c.status === 'rejected'}
                             >
                               Refuser
                             </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
