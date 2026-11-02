import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertAwsRestartApplicationSchema, type InsertAwsRestartApplication } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Cloud, Send, CheckCircle2, Laptop, Target, Zap, ShieldCheck, Briefcase,
    Video, Youtube, Calendar, Clock, Globe, Award, Landmark, GraduationCap,
    FileText, Users, PhoneCall, Rocket, ArrowRight, Terminal, Database, Network, Lock,
} from "lucide-react";

const CURRENT_COHORT = "N'Djamena 2026";

const sessionFacts = [
    { icon: Users, label: "Places", value: "25", note: "Jeunes de 18 à 35 ans, sélection sur mérite" },
    { icon: Clock, label: "Durée", value: "12 semaines", note: "420 heures, 5 jours / semaine" },
    { icon: Globe, label: "Format", value: "Présentiel", note: "À N'Djamena, avec labs AWS en ligne" },
    { icon: Award, label: "Coût", value: "Gratuit", note: "Examen de certification pris en charge" },
];

const curriculum = [
    { icon: Terminal, label: "Linux & Scripting (Python, Bash)" },
    { icon: Network, label: "Réseaux & Infrastructure" },
    { icon: Lock, label: "Sécurité du Cloud" },
    { icon: Database, label: "Bases de données" },
    { icon: Cloud, label: "Fondamentaux AWS, architecture & automatisation" },
    { icon: Briefcase, label: "Employabilité : CV, entretiens, portfolio" },
];

const selectionSteps = [
    {
        icon: FileText,
        title: "1. Candidature en ligne",
        description: "Remplissez le formulaire ci-dessous et joignez votre vidéo de présentation d'une minute (lien YouTube).",
    },
    {
        icon: Users,
        title: "2. Présélection",
        description: "Un comité examine les dossiers selon une grille publiée : motivation, conformité au public cible et vidéo de présentation.",
    },
    {
        icon: PhoneCall,
        title: "3. Validation finale",
        description: "Les candidats présélectionnés sont contactés pour confirmation, et la liste finale est validée avec l'Ambassade des États-Unis.",
    },
    {
        icon: Rocket,
        title: "4. Intégration à la cohorte",
        description: "Les 25 candidats retenus rejoignent le bootcamp à N'Djamena et reçoivent leurs accès aux labs AWS.",
    },
];

const timeline = [
    { period: "Octobre 2026", event: "Sélection des 25 apprenants et lancement officiel du programme" },
    { period: "Novembre 2026 – Janvier 2027", event: "Bootcamp AWS re/Start de 12 semaines (420 h) + ateliers d'employabilité" },
    { period: "Janvier 2027", event: "Examen de certification AWS Certified Cloud Practitioner" },
    { period: "Février – Juillet 2027", event: "Parcours AWS Associate (6 mois) + mentorat par des alumni des programmes d'échange américains" },
    { period: "Août 2027", event: "Demo Day devant les employeurs (télécoms, banques, fintechs, organisations internationales)" },
    { period: "Septembre 2027", event: "Cérémonie de certification avec l'Ambassade des États-Unis" },
];

export default function AwsRestartProgram() {
    const { toast } = useToast();
    const form = useForm<InsertAwsRestartApplication>({
        resolver: zodResolver(insertAwsRestartApplicationSchema),
        defaultValues: {
            fullName: "",
            gender: "",
            dateOfBirth: "",
            city: "N'Djamena",
            phone: "",
            email: "",
            professionalStatus: "",
            hasDisability: "",
            motivation: "",
            videoUrl: "",
            fullTimeCommitment: false,
            status: "pending",
            cohort: CURRENT_COHORT,
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: InsertAwsRestartApplication) => {
            const res = await apiRequest("POST", "/api/aws-restart-applications", data);
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: "Candidature envoyée !",
                description: "Merci de votre intérêt. Votre profil sera examiné prochainement.",
            });
            form.reset();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur de soumission",
                description: error.message || "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: InsertAwsRestartApplication) => {
        mutation.mutate(data);
    };

    return (
        <div className="flex flex-col min-h-screen font-sans">
            <SEOHead
                title="Chad Cloud Talent — AWS re/Start N'Djamena | SAYC Tchad"
                description="Première cohorte AWS re/Start au Tchad : bootcamp gratuit de 12 semaines (420 h) à N'Djamena pour 25 jeunes, avec certification AWS Cloud Practitioner. Financé par l'Ambassade des États-Unis. Candidatures ouvertes."
                path="/programmes/aws-restart"
            />

            {/* Hero Section */}
            <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar to-sidebar/95 text-sidebar-foreground overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent border border-accent/30 mb-6">
                        <Cloud className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Chad Cloud Talent — AWS re/Start {CURRENT_COHORT}</span>
                    </div>
                    <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Devenez Spécialiste <br/>
                        <span className="text-accent underline decoration-2 underline-offset-8">Cloud Junior</span>
                    </h1>
                    <p className="text-xl text-sidebar-foreground/80 max-w-3xl mx-auto leading-relaxed mb-8">
                        La première cohorte AWS re/Start du Tchad : un bootcamp gratuit et intensif de 12 semaines (420 heures)
                        à N'Djamena, menant à la certification AWS Certified Cloud Practitioner — aucune expérience
                        technique préalable n'est exigée.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 shadow-lg">
                            <h4 className="font-bold text-accent text-3xl mb-1">25</h4>
                            <p className="text-xs uppercase tracking-wider text-sidebar-foreground/70">Places Disponibles</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 shadow-lg">
                            <h4 className="font-bold text-accent text-3xl mb-1">420h</h4>
                            <p className="text-xs uppercase tracking-wider text-sidebar-foreground/70">Sur 12 Semaines</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 shadow-lg">
                            <h4 className="font-bold text-accent text-3xl mb-1">100%</h4>
                            <p className="text-xs uppercase tracking-wider text-sidebar-foreground/70">Gratuit + Certification</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="#postuler">
                            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-full px-8 shadow-xl" data-testid="button-hero-apply">
                                Postuler maintenant
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </a>
                        <a href="#programme">
                            <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/10 border-white/30 text-sidebar-foreground hover:bg-white/20" data-testid="button-hero-learn-more">
                                Découvrir le programme
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Session en bref */}
            <section className="py-16 bg-background" id="session">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <Badge className="mb-4 bg-green-500/10 text-green-700 border border-green-500/30 hover:bg-green-500/10">
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Candidatures ouvertes
                        </Badge>
                        <h2 className="text-3xl font-heading font-bold text-foreground">La session en bref</h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        {sessionFacts.map((fact) => (
                            <div key={fact.label} className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="mx-auto w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                                    <fact.icon className="w-6 h-6 text-accent" />
                                </div>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{fact.label}</p>
                                <p className="font-bold text-lg text-foreground">{fact.value}</p>
                                <p className="text-xs text-muted-foreground mt-1">{fact.note}</p>
                            </div>
                        ))}
                    </div>

                    <div className="max-w-5xl mx-auto mt-8 bg-muted/40 border border-border rounded-2xl p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                <Landmark className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground mb-1">Chad Cloud Talent : un programme financé par l'Ambassade des États-Unis</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Cette première cohorte tchadienne est <strong className="text-foreground">financée par l'Ambassade des
                                    États-Unis à N'Djamena</strong> (Section de la Diplomatie Publique) dans le cadre du projet
                                    « Chad Cloud Talent ». Elle est mise en œuvre par <strong className="text-foreground">Smart Africa
                                    Youth Chapter Tchad</strong> et <strong className="text-foreground">Code for Chad</strong>, avec le
                                    programme <strong className="text-foreground">AWS re/Start</strong> (Amazon Web Services) fourni via
                                    la <strong className="text-foreground">Smart Africa Digital Academy (SADA)</strong>, et le soutien
                                    institutionnel du <strong className="text-foreground">Ministère des Télécommunications et de l'Économie
                                    Numérique (MTENDA)</strong>.
                                </p>
                                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                                    Au-delà de la formation, les apprenants bénéficient d'un <strong className="text-foreground">mentorat par des
                                    alumni des programmes d'échange du gouvernement américain</strong>, de la série de rencontres
                                    <strong className="text-foreground"> « America in Tech »</strong> avec des professionnels américains du Cloud,
                                    d'un <strong className="text-foreground">Demo Day</strong> devant les employeurs et d'une
                                    <strong className="text-foreground"> cérémonie de certification</strong> organisée avec l'Ambassade.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Calendrier du programme */}
                    <div className="max-w-5xl mx-auto mt-8">
                        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-lg">
                            <Calendar className="w-5 h-5 text-accent" />
                            Calendrier du programme
                        </h3>
                        <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
                            {timeline.map((item) => (
                                <div key={item.period} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-6 py-4">
                                    <span className="font-semibold text-accent text-sm sm:w-56 shrink-0">{item.period}</span>
                                    <span className="text-sm text-muted-foreground">{item.event}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Information Section */}
            <section className="py-16 bg-muted/30" id="programme">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-heading font-bold text-foreground">Pourquoi rejoindre le programme AWS re/Start ?</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Ce programme complet vous prépare à un poste de niveau débutant dans
                                les opérations Cloud, avec un accompagnement de bout en bout.
                            </p>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                        <Laptop className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">Compétences Techniques Pratiques</h4>
                                        <p className="text-sm text-muted-foreground">Bases du Cloud AWS, Linux, Scripting Python/Bash, Réseaux et Sécurité : des cours en présentiel chaque jour et des labs AWS en ligne sur de vrais scénarios.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                        <Briefcase className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">Soft Skills, Mentorat & Emploi</h4>
                                        <p className="text-sm text-muted-foreground">Coaching pour les entretiens, rédaction de CV, mentorat par des alumni des programmes d'échange américains, et un Demo Day devant les employeurs (télécoms, banques, fintechs, organisations internationales).</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">Certification Officielle</h4>
                                        <p className="text-sm text-muted-foreground">Préparez et passez la certification AWS Certified Cloud Practitioner (examen pris en charge), puis poursuivez avec le parcours AWS Associate de 6 mois (SysOps, Developer, Solutions Architect).</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-accent" />
                                    Ce que vous apprendrez
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {curriculum.map((item) => (
                                        <span key={item.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-sm text-foreground">
                                            <item.icon className="w-4 h-4 text-accent" />
                                            {item.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-card p-8 rounded-3xl shadow-xl border border-accent/10">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Target className="w-6 h-6 text-accent" />
                                Public Cible Privilégié
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                25 places pour des jeunes tchadiens de <strong className="text-foreground">18 à 35 ans</strong>, sélectionnés
                                sur mérite via un appel public transparent. Aucune expérience technologique préalable n'est requise —
                                seulement une aptitude logique de base et une forte motivation.
                            </p>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <p><strong className="text-foreground">Jeunes chômeurs et sous-employés :</strong> À la recherche d'une opportunité d'entrer dans l'un des secteurs les plus porteurs au monde.</p>
                                </div>
                                <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <p><strong className="text-foreground">Au-delà des cercles tech habituels :</strong> Les candidatures des femmes et des jeunes des quartiers périphériques de N'Djamena sont particulièrement encouragées.</p>
                                </div>
                                <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <p><strong className="text-foreground">Disponibilité à N'Djamena :</strong> Le bootcamp étant en présentiel 5 jours par semaine pendant 12 semaines, il faut être disponible à temps plein à N'Djamena.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Processus de sélection */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-heading font-bold text-foreground mb-3">Comment se déroule la sélection ?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Quatre étapes simples, de votre candidature jusqu'au premier jour de formation.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {selectionSteps.map((step) => (
                            <div key={step.title} className="relative bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                                    <step.icon className="w-6 h-6 text-accent" />
                                </div>
                                <h4 className="font-bold text-foreground mb-2">{step.title}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-20 bg-muted/20 relative overflow-hidden" id="postuler">
                {/* Decorative background shapes */}
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl -z-10"></div>

                <div className="container mx-auto px-4 max-w-4xl">
                    <Card className="border-t-8 border-t-accent shadow-2xl rounded-2xl">
                        <CardHeader className="space-y-4 pb-10 text-center relative">
                            <div className="mx-auto w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-2">
                                <Zap className="w-10 h-10 text-accent" />
                            </div>
                            <CardTitle className="text-4xl font-heading text-primary">Postuler Maintenant</CardTitle>
                            <CardDescription className="text-lg max-w-2xl mx-auto">
                                Saisissez cette opportunité de lancer votre parcours dans le Cloud.
                                Les places sont limitées : seules les candidatures complètes et motivées seront retenues.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                                    {/* Section 1: Identité */}
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-border pb-3 text-primary">
                                            <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-heading">1</span>
                                            Informations Personnelles
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <FormField
                                                control={form.control}
                                                name="fullName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Nom Complet <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input placeholder="Prénom et Nom" className="h-12 bg-muted/50 border-border/50 focus:border-accent transition-colors" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="gender"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Sexe (Statistique d'inclusion) <span className="text-destructive">*</span></FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12 bg-muted/50 border-border/50 focus:border-accent">
                                                                    <SelectValue placeholder="Choisir" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="M">Masculin</SelectItem>
                                                                <SelectItem value="F">Féminin</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="dateOfBirth"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Date de Naissance <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input type="date" className="h-12 bg-muted/50 border-border/50 focus:border-accent" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Ville de Résidence <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input className="h-12 bg-muted/50 border-border/50 focus:border-accent" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Section 2: Contact & Profil */}
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-border pb-3 text-primary">
                                            <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-heading">2</span>
                                            Contact & Profil
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Numéro WhatsApp <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input placeholder="+235 ..." className="h-12 bg-muted/50 border-border/50 focus:border-accent" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Email Actif <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input type="email" placeholder="nom@exemple.com" className="h-12 bg-muted/50 border-border/50 focus:border-accent" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="professionalStatus"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Statut Professionnel Actuel <span className="text-destructive">*</span></FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12 bg-muted/50 border-border/50 focus:border-accent">
                                                                    <SelectValue placeholder="Sélectionnez..." />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Sans emploi">Sans emploi (NEET)</SelectItem>
                                                                <SelectItem value="Étudiant">Étudiant en recherche d'opportunité</SelectItem>
                                                                <SelectItem value="Reconversion">Employé(e) en reconversion</SelectItem>
                                                                <SelectItem value="Indépendant">Indépendant(e) / Freelance</SelectItem>
                                                                <SelectItem value="Autre">Autre</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormDescription>Pour ajuster notre programme à votre disponibilité.</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="hasDisability"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Êtes-vous en situation de handicap ? <span className="text-destructive">*</span></FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12 bg-muted/50 border-border/50 focus:border-accent">
                                                                    <SelectValue placeholder="Sélectionnez..." />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Non">Non</SelectItem>
                                                                <SelectItem value="Oui">Oui</SelectItem>
                                                                <SelectItem value="Préfère ne pas répondre">Préfère ne pas répondre</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormDescription>AWS re/Start et SAYC s'engagent pour l'inclusion.</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Section 3: Motivation */}
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-border pb-3 text-primary">
                                            <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-heading">3</span>
                                            Motivation
                                        </h3>
                                        <FormField
                                            control={form.control}
                                            name="motivation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold">Pourquoi souhaitez-vous intégrer le programme AWS re/Start ? <span className="text-destructive">*</span></FormLabel>
                                                    <FormDescription className="mb-2">Votre réponse est cruciale pour la sélection. Expliquez comment cette formation impactera votre carrière et vos ambitions dans le numérique (min 50 mots).</FormDescription>
                                                    <FormControl><Textarea className="min-h-[150px] text-base bg-muted/50 border-border/50 focus:border-accent resize-y" placeholder="Ma motivation est..." {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Section 4: Vidéo de présentation */}
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-border pb-3 text-primary">
                                            <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-heading">4</span>
                                            Vidéo de Présentation (1 minute)
                                        </h3>
                                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                                                    <Youtube className="w-6 h-6 text-red-600" />
                                                </div>
                                                <p className="text-sm text-foreground font-medium">
                                                    Une vidéo d'une minute est <strong>obligatoire</strong> pour valider votre candidature. Voici comment faire :
                                                </p>
                                            </div>
                                            <ol className="space-y-3 text-sm text-muted-foreground list-none">
                                                <li className="flex gap-3">
                                                    <span className="bg-red-500/10 text-red-700 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">1</span>
                                                    <span><strong className="text-foreground">Enregistrez une vidéo d'environ 1 minute</strong> avec votre téléphone : présentez-vous (nom, parcours) et expliquez pourquoi vous voulez travailler dans le Cloud. En français ou en anglais.</span>
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="bg-red-500/10 text-red-700 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">2</span>
                                                    <span><strong className="text-foreground">Publiez-la sur YouTube</strong> depuis l'application ou youtube.com, en choisissant la visibilité <strong className="text-foreground">« Non répertoriée »</strong> (seules les personnes ayant le lien pourront la voir).</span>
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="bg-red-500/10 text-red-700 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">3</span>
                                                    <span><strong className="text-foreground">Copiez le lien de la vidéo</strong> (bouton « Partager ») et collez-le dans le champ ci-dessous.</span>
                                                </li>
                                            </ol>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="videoUrl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold flex items-center gap-2">
                                                        <Video className="w-4 h-4 text-accent" />
                                                        Lien YouTube de votre vidéo <span className="text-destructive">*</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="url"
                                                            placeholder="https://youtu.be/votre-video"
                                                            className="h-12 bg-muted/50 border-border/50 focus:border-accent"
                                                            {...field}
                                                            value={field.value ?? ""}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>Formats acceptés : youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Section 5: Engagement */}
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-border pb-3 text-primary">
                                            <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-heading">5</span>
                                            Engagement
                                        </h3>
                                        <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
                                            <FormField
                                                control={form.control}
                                                name="fullTimeCommitment"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-4 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                className="data-[state=checked]:bg-accent data-[state=checked]:border-accent w-6 h-6 rounded-md mt-1"
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1">
                                                            <FormLabel className="text-base font-medium text-foreground cursor-pointer">
                                                                Je m'engage à suivre assidûment le bootcamp en présentiel à N'Djamena, à temps plein (5 jours/semaine) pendant 12 semaines, et à passer l'examen de certification.
                                                            </FormLabel>
                                                            <p className="text-sm text-muted-foreground mt-2">
                                                                Ce programme exige un rythme intense (420 heures). En cochant cette case, vous confirmez comprendre l'effort nécessaire.
                                                            </p>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full h-16 text-xl font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 rounded-full"
                                        disabled={mutation.isPending || !form.watch("fullTimeCommitment")}
                                    >
                                        {mutation.isPending ? (
                                            <>
                                                <Zap className="mr-2 h-6 w-6 animate-pulse" />
                                                Validation en cours...
                                            </>
                                        ) : (
                                            <>
                                                Soumettre ma Candidature
                                                <Send className="ml-3 h-6 w-6" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <div className="mt-16 grid md:grid-cols-2 gap-8 text-center md:text-left">
                        <div className="p-8 rounded-2xl bg-primary/5 border border-border">
                            <h4 className="font-bold text-xl mb-3 text-primary">Modalités Pratiques</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Le bootcamp se déroule <strong className="text-foreground">en présentiel à N'Djamena</strong>, dans la salle de
                                formation SAYC Tchad équipée d'une connexion internet dédiée et d'une alimentation de secours.
                                Les candidats retenus recevront par email et WhatsApp leurs accès aux labs AWS en ligne.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-green-500/5 border border-green-500/10">
                            <h4 className="font-bold text-xl mb-3 text-green-700">Avis de Sélection</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Un comité évaluera la motivation, la vidéo de présentation et la conformité au public cible.
                                Seules les personnes présélectionnées seront contactées pour un entretien de confirmation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
