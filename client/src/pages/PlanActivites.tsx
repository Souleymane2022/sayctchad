import { useState, useMemo } from "react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Users,
  Zap,
  GraduationCap,
  Rocket,
  FileText,
  Upload,
  Building2,
  Shield,
  Heart,
  Info,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Network,
  Cpu,
  HelpCircle,
  ExternalLink,
  Download
} from "lucide-react";

// Map type → icon component
const activityTypeIcons: Record<string, any> = {
  Forum: Users,
  Hackathon: Zap,
  Bootcamp: GraduationCap,
  Projet: Rocket,
};

const activityTypeColors: Record<string, { card: string; badge: string }> = {
  Forum: {
    card: "text-blue-500 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  Hackathon: {
    card: "text-purple-500 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/50",
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  Bootcamp: {
    card: "text-green-500 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50",
    badge: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  Projet: {
    card: "text-orange-500 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
};

type PlanActivity = {
  id: string;
  month: string;
  title: string;
  type: string;
  description: string;
  date: string;
  target: string;
  documentUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
};

export default function PlanActivites() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("plan");

  // Form State for Report Submission
  const [reportTitle, setReportTitle] = useState("");
  const [reportType, setReportType] = useState("activity");
  const [reportDesc, setReportDesc] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // SEO metadata
  const seoData = useMemo(() => ({
    title: "Plan Semestriel des Activités | SAYC Tchad",
    description: "Découvrez notre plan semestriel (Forums, Hackathons, Bootcamps, Projets), notre alignement avec la stratégie nationale numérique du Tchad et soutenez nos besoins logistiques.",
    path: "/plan-activites"
  }), []);

  // Fetch activities from API
  const { data: planActivities = [], isLoading: activitiesLoading } = useQuery<PlanActivity[]>({
    queryKey: ["/api/plan-activities"],
    queryFn: async () => {
      const res = await fetch("/api/plan-activities");
      if (!res.ok) throw new Error("Failed to fetch activities");
      return res.json();
    },
  });

  // Group activities by month
  const monthlyActivities = useMemo(() => {
    const grouped: Record<string, PlanActivity[]> = {};
    planActivities.forEach(act => {
      if (!grouped[act.month]) grouped[act.month] = [];
      grouped[act.month].push(act);
    });
    return Object.entries(grouped).map(([month, activities]) => ({ month, activities }));
  }, [planActivities]);

  // National Strategies
  const strategies = [
    {
      title: "Plan Stratégique Numérique (PSN 2030)",
      icon: Cpu,
      desc: "SAYC Tchad contribue à la vulgarisation des objectifs du PSN 2030 en formant la jeunesse tchadienne aux compétences clés pour l'économie numérique.",
      focus: "Cloud Computing, Développement Logiciel, Entrepreneuriat Tech."
    },
    {
      title: "Stratégie Nationale de Cybersécurité",
      icon: Shield,
      desc: "Nous organisons des ateliers de sensibilisation à l'hygiène numérique, à la protection des données personnelles et à la prévention des cyber-menaces pour les jeunes.",
      focus: "Formations en sécurité web, webinaires, charte du jeune cybercitoyen."
    },
    {
      title: "Inclusion Numérique des Jeunes",
      icon: Users,
      desc: "Réduire la fracture numérique en rendant la technologie accessible aux jeunes filles, aux étudiants défavorisés et en décentralisant nos activités hors de N'Djamena.",
      focus: "Formations gratuites, partenariats avec les universités publiques."
    },
    {
      title: "Blueprints de Smart Africa Alliance",
      icon: Network,
      desc: "Aligner nos plans d'action sur les référentiels de Smart Africa pour harmoniser les politiques d'innovation technologique à l'échelle du continent.",
      focus: "Intégration régionale, entrepreneuriat panafricain, leadership féminin."
    }
  ];

  // Material Needs
  const materialNeeds = [
    {
      title: "Siège Physique & Bureau Permanent",
      icon: Building2,
      desc: "Un espace dédié à N'Djamena pour installer le secrétariat de SAYC Tchad, accueillir nos membres, et héberger les réunions stratégiques du comité.",
      priority: "Urgente",
      spec: "Espace bureau, salle de réunion, électricité stable."
    },
    {
      title: "Équipements Technologiques",
      icon: Cpu,
      desc: "Ordinateurs portables de développement, écrans de projection pour les ateliers et un abonnement Internet haut débit par satellite (Starlink) pour assurer les formations connectées.",
      priority: "Très Élevée",
      spec: "10 PC portables, 1 Kit Starlink, 1 Vidéoprojecteur."
    },
    {
      title: "Énergie Solaire & Climatisation",
      icon: Zap,
      desc: "Pour parer aux coupures d'électricité récurrentes à N'Djamena et assurer des conditions de travail et de formation optimales en période de forte chaleur.",
      priority: "Élevée",
      spec: "Système de plaques solaires et batteries de secours, climatisation de bureau."
    },
    {
      title: "Fonds Opérationnels de Lancement",
      icon: FileText,
      desc: "Budget initial pour financer la logistique, la communication des événements, la logistique de démarrage et le transport des formateurs bénévoles.",
      priority: "Moyenne",
      spec: "Frais de lancement, affiches, hébergement d'outils numériques."
    }
  ];

  // File Upload Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle || !reportDesc) {
      toast({
        variant: "destructive",
        title: "Champs incomplets",
        description: "Veuillez remplir le titre et la description."
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    try {
      let fileData: string | undefined;
      let fileName: string | undefined;
      let fileSize: number | undefined;

      if (selectedFile) {
        setUploadProgress(40);
        fileData = await fileToBase64(selectedFile);
        fileName = selectedFile.name;
        fileSize = selectedFile.size;
      }

      setUploadProgress(70);

      const res = await fetch("/api/activity-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: reportTitle,
          type: reportType,
          description: reportDesc,
          submittedBy: submittedBy || undefined,
          fileName,
          fileData,
          fileSize,
        }),
      });

      setUploadProgress(100);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de la soumission");
      }

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setReportTitle("");
        setReportDesc("");
        setSubmittedBy("");
        setSelectedFile(null);
        toast({
          title: "Rapport soumis avec succès !",
          description: `Votre rapport "${reportTitle}" a été transmis au comité SAYC Tchad pour validation.`
        });
      }, 500);

    } catch (err: any) {
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de la soumission."
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        path={seoData.path}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-sidebar via-sidebar to-sidebar/95 text-sidebar-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-accent/30 rounded-full animate-pulse" />
          <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-sayc-teal/30 rounded-full" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-accent/20 text-accent border-accent/30">
              <Calendar className="w-3 h-3 mr-1.5" />
              Planification Stratégique
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Plan Semestriel des <span className="text-accent">Activités</span>
            </h1>
            <p className="text-lg text-sidebar-foreground/80 leading-relaxed">
              Consultez la feuille de route du chapitre national SAYC Tchad pour le second semestre 2026.
              Découvrez comment nous contribuons activement aux politiques numériques de la nation et rejoignez nos efforts.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Main Content Dashboard */}
      <section className="py-12 bg-muted/20 flex-1">
        <div className="container mx-auto px-4 md:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-3xl bg-background border shadow-sm">
                <TabsTrigger value="plan" className="text-sm font-medium gap-2">
                  <Calendar className="w-4 h-4" />
                  Activités S2 2026
                </TabsTrigger>
                <TabsTrigger value="strategy" className="text-sm font-medium gap-2">
                  <Shield className="w-4 h-4" />
                  Gouvernance & Stratégie
                </TabsTrigger>
                <TabsTrigger value="needs" className="text-sm font-medium gap-2">
                  <Building2 className="w-4 h-4" />
                  Nos Besoins
                </TabsTrigger>
                <TabsTrigger value="submit" className="text-sm font-medium gap-2">
                  <Upload className="w-4 h-4" />
                  Soumettre un Rapport
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: Plan Semestriel */}
            <TabsContent value="plan" className="space-y-8">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center md:text-left space-y-2">
                  <h2 className="text-2xl md:text-3xl font-heading font-bold">Calendrier des Activités</h2>
                  <p className="text-muted-foreground">Découvrez notre programmation articulée autour de nos 4 piliers d'action : Forums, Hackathons, Bootcamps et Projets.</p>
                </div>

                {/* Loading skeleton */}
                {activitiesLoading && (
                  <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-40 w-full rounded-xl" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {!activitiesLoading && planActivities.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">Aucune activité planifiée pour le moment.</p>
                    <p className="text-sm">L'équipe SAYC Tchad prépare le calendrier. Revenez bientôt !</p>
                  </div>
                )}

                {/* Timeline display */}
                {!activitiesLoading && monthlyActivities.length > 0 && (
                  <div className="relative border-l-2 border-primary/20 pl-6 ml-4 space-y-12">
                    {monthlyActivities.map((monthData, idx) => (
                      <div key={idx} className="relative group">
                        {/* Timeline dot */}
                        <span className="absolute -left-[35px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-background border-2 border-primary group-hover:bg-primary transition-colors">
                          <span className="w-2 h-2 rounded-full bg-primary group-hover:bg-background" />
                        </span>

                        {/* Month label */}
                        <Badge variant="outline" className="mb-4 text-sm font-semibold bg-background shadow-sm border-primary/30">
                          {monthData.month}
                        </Badge>

                        {/* Activities cards */}
                        <div className="grid gap-6">
                          {monthData.activities.map((act, actIdx) => {
                            const colors = activityTypeColors[act.type] || activityTypeColors["Projet"];
                            const IconComp = activityTypeIcons[act.type] || Rocket;
                            return (
                              <Card key={actIdx} className="hover-elevate transition-all border-l-4 border-l-primary/60">
                                <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${colors.card}`}>
                                      <IconComp className="w-6 h-6" />
                                    </div>
                                    <div>
                                      <CardTitle className="font-heading text-lg md:text-xl font-bold">{act.title}</CardTitle>
                                      <CardDescription className="flex items-center gap-1.5 mt-1">
                                        <Badge className={colors.badge} variant="secondary">
                                          {act.type}
                                        </Badge>
                                        {act.documentUrl && (
                                          <Badge variant="outline" className="text-xs gap-1 border-primary/30 text-primary">
                                            <FileText className="w-3 h-3" /> Document disponible
                                          </Badge>
                                        )}
                                      </CardDescription>
                                    </div>
                                  </div>
                                  {act.documentUrl && (
                                    <a href={act.documentUrl} target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="outline" className="gap-1.5 text-xs shrink-0">
                                        <Download className="w-3.5 h-3.5" />
                                        Voir le document
                                      </Button>
                                    </a>
                                  )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                    {act.description}
                                  </p>
                                  <div className="grid md:grid-cols-2 gap-4 pt-2 border-t text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-primary" />
                                      <span>Période : <strong>{act.date}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Users className="w-4 h-4 text-primary" />
                                      <span>Cible : <strong>{act.target}</strong></span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 2: Governance & National Strategy */}
            <TabsContent value="strategy" className="space-y-8">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-heading font-bold">Gouvernance et Politique Numérique</h2>
                  <p className="text-muted-foreground">
                    SAYC Tchad n'est pas seulement une association, c'est un chapitre jeunesse officiel œuvrant pour l'alignement des actions du pays avec la politique continentale de Smart Africa.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {strategies.map((strat, idx) => {
                    const IconComp = strat.icon;
                    return (
                      <Card key={idx} className="hover-elevate transition-all border border-muted bg-card">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                          <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                            <IconComp className="w-6 h-6" />
                          </div>
                          <CardTitle className="font-heading text-lg font-bold">{strat.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {strat.desc}
                          </p>
                          <div className="text-xs bg-muted/50 p-2.5 rounded-lg border border-muted-foreground/15">
                            <strong className="text-foreground">Focalisation :</strong> {strat.focus}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card className="bg-primary/5 border-primary/20 mt-8">
                  <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Info className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="font-heading font-bold text-lg text-primary">Un Chapitre de Gouvernance Nationale</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Le Smart Africa Youth Chapter Tchad travaille main dans la main avec l'ADETIC, le Ministère du Développement Numérique et de la Digitalisation, et d'autres instances réglementaires pour porter la voix de la jeunesse tchadienne dans les futures orientations technologiques nationales.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TAB 3: Material Needs */}
            <TabsContent value="needs" className="space-y-8">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-heading font-bold">Nos Besoins d'Installation</h2>
                  <p className="text-muted-foreground">
                    Le chapitre venant d'être officiellement installé au Tchad, nous faisons appel à nos partenaires gouvernementaux, privés, et de la société civile pour soutenir notre démarrage logistique.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {materialNeeds.map((need, idx) => {
                    const IconComp = need.icon;
                    return (
                      <Card key={idx} className="flex flex-col justify-between hover-elevate transition-all border border-muted bg-card">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <IconComp className="w-6 h-6" />
                            </div>
                            <Badge variant={need.priority === "Urgente" ? "destructive" : "secondary"} className="text-xs">
                              Priorité : {need.priority}
                            </Badge>
                          </div>
                          <CardTitle className="font-heading text-lg font-bold mt-4">{need.title}</CardTitle>
                          <CardDescription className="text-sm leading-relaxed mt-2">
                            {need.desc}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-4">
                          <div className="text-xs bg-muted/65 p-2.5 rounded-lg border">
                            <strong>Spécification :</strong> {need.spec}
                          </div>
                          <Link href="/contact">
                            <Button className="w-full text-xs font-semibold gap-1.5" variant="outline">
                              Soutenir cette initiative
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: Submit Reports */}
            <TabsContent value="submit" className="space-y-8">
              <div className="max-w-xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-heading font-bold">Soumettre un Rapport ou Activité</h2>
                  <p className="text-muted-foreground">
                    Membres du comité ou partenaires externes, transmettez vos comptes rendus, propositions de projets ou résumés d'activités directement en ligne.
                  </p>
                </div>

                <Card className="border shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-heading">Formulaire de Dépôt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitReport} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="title">Titre du document / de l'activité <span className="text-destructive">*</span></Label>
                        <Input
                          id="title"
                          placeholder="Ex: Rapport d'activité Bootcamp Septembre 2026"
                          value={reportTitle}
                          onChange={(e) => setReportTitle(e.target.value)}
                          disabled={isUploading}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">Type de document</Label>
                        <select
                          id="type"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={reportType}
                          onChange={(e) => setReportType(e.target.value)}
                          disabled={isUploading}
                        >
                          <option value="activity">Rapport d'activité</option>
                          <option value="project">Proposition de Projet</option>
                          <option value="event">Résumé d'événement</option>
                          <option value="governance">Note de Gouvernance</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="submittedBy">Votre email (optionnel)</Label>
                        <Input
                          id="submittedBy"
                          type="email"
                          placeholder="votre@email.com"
                          value={submittedBy}
                          onChange={(e) => setSubmittedBy(e.target.value)}
                          disabled={isUploading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="desc">Description / Résumé succinct <span className="text-destructive">*</span></Label>
                        <Textarea
                          id="desc"
                          placeholder="Décrivez brièvement le contenu ou les points clés du document..."
                          value={reportDesc}
                          onChange={(e) => setReportDesc(e.target.value)}
                          disabled={isUploading}
                          rows={4}
                          required
                        />
                      </div>

                      {/* File Upload Area */}
                      <div className="space-y-2">
                        <Label>Fichier (PDF, DOCX, ZIP - Max 10MB) — optionnel</Label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"
                          }`}
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => document.getElementById("fileInput")?.click()}
                        >
                          <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            accept=".pdf,.docx,.doc,.zip,.rar"
                            onChange={handleFileChange}
                            disabled={isUploading}
                          />
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground/60 mb-2" />
                          {selectedFile ? (
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-foreground flex items-center justify-center gap-1.5">
                                <Paperclip className="w-4 h-4 text-primary" />
                                {selectedFile.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Glissez et déposez votre fichier ici, ou cliquez pour parcourir</p>
                              <p className="text-xs text-muted-foreground">Formats acceptés : PDF, Word, Archive ZIP</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress bar when uploading */}
                      {isUploading && (
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between text-xs">
                            <span>Transmission en cours...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}

                      <Button type="submit" className="w-full py-6 font-bold" disabled={isUploading}>
                        {isUploading ? "Transmission en cours..." : "Soumettre le document"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground flex gap-3">
                  <Info className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                  <p>Vos données sont transmises de manière sécurisée au comité SAYC Tchad. Un accusé de réception vous sera envoyé si vous fournissez votre email.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
