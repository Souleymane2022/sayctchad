import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertAwsRestartApplicationSchema, AWS_RESTART_APPLICATION_DEADLINE, type InsertAwsRestartApplication } from "@shared/schema";
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

const APPLICATION_DEADLINE = "13 novembre 2026 à minuit";

const sessionFacts = [
    { icon: Calendar, label: "Candidatures", value: "3 – 13 nov. 2026", note: "Formulaire en ligne, avant minuit" },
    { icon: Users, label: "Places", value: "25", note: "18 à 35 ans, nationalité tchadienne" },
    { icon: Clock, label: "Bootcamp", value: "12 semaines", note: "420 h, du 23 nov. 2026 au 19 févr. 2027" },
    { icon: Award, label: "Coût", value: "Gratuit", note: "Examen de certification offert par AWS" },
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
        title: "1. Remplis le formulaire en ligne",
        description: "Avant le 13 novembre 2026 à minuit : formulaire ci-dessous + ta vidéo de présentation d'une minute (lien YouTube).",
    },
    {
        icon: PhoneCall,
        title: "2. Passe le test et l'entretien",
        description: "Les candidats présélectionnés sont contactés du 14 au 18 novembre pour un test et un entretien. Sélection au mérite.",
    },
    {
        icon: Users,
        title: "3. Résultats le 20 novembre",
        description: "Les 25 candidats retenus sont annoncés le 20 novembre 2026.",
    },
    {
        icon: Rocket,
        title: "4. Début du bootcamp le 23 novembre",
        description: "La première promotion démarre à N'Djamena le 23 novembre 2026, avec les accès aux labs AWS.",
    },
];

const timeline = [
    { period: "3 – 13 novembre 2026", event: "Candidatures en ligne (formulaire + vidéo), jusqu'au 13 novembre à minuit" },
    { period: "14 – 18 novembre 2026", event: "Test et entretien des candidats présélectionnés" },
    { period: "20 novembre 2026", event: "Annonce des résultats de la sélection" },
    { period: "23 nov. 2026 – 19 févr. 2027", event: "Bootcamp AWS re/Start : 12 semaines, 420 heures de cours et de labs à N'Djamena" },
    { period: "Fin février 2027", event: "Certification AWS Cloud Practitioner — examen offert par AWS" },
    { period: "Mars – Août 2027", event: "Parcours AWS Associate : six mois en ligne, labs et mentorat" },
    { period: "Août 2027", event: "Demo Day : tes projets cloud présentés devant les employeurs" },
];

export default function AwsRestartProgram() {
    const { toast } = useToast();
    const applicationsClosed = new Date() >= AWS_RESTART_APPLICATION_DEADLINE;
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
                description="Première promotion AWS re/Start au Tchad : bootcamp gratuit de 12 semaines (420 h) à N'Djamena pour 25 jeunes, avec certification AWS Cloud Practitioner. Financé par l'Ambassade des États-Unis. Candidatures du 3 au 13 novembre 2026."
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
                    <p className="text-xl text-sidebar-foreground/80 max-w-3xl mx-auto leading-relaxed mb-6">
                        Grande première : AWS re/Start arrive au Tchad ! Un bootcamp gratuit et intensif de 12 semaines (420 heures)
                        à N'Djamena, menant à la certification AWS Certified Cloud Practitioner — aucune formation
                        en informatique n'est exigée.
                    </p>
                    <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-accent-foreground font-bold mb-8 shadow-lg">
                        <Calendar className="w-5 h-5" />
                        {applicationsClosed
                            ? "Candidatures clôturées — résultats le 20 novembre 2026"
                            : `Candidatures du 3 au ${APPLICATION_DEADLINE}`}
                    </div>

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
                        {!applicationsClosed && (
                            <a href="#postuler">
                                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-full px-8 shadow-xl" data-testid="button-hero-apply">
                                    Postuler maintenant
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </a>
                        )}
                        <a href="#programme">
                            <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/10 border-white/30 text-sidebar-foreground hover:bg-white/20" data-testid="button-hero-learn-more">
                                Découvrir le programme
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Bandeau partenaires */}
            <section className="bg-card border-b border-border py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
                        <div className="flex flex-col items-center lg:items-start gap-2">
                            <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-border/50">
                                <img src="/images/partners/us-embassy-ndjamena.png" alt="U.S. Embassy N'Djamena" className="h-8 md:h-9 w-auto object-contain" />
                            </div>
                            <p className="text-xs text-muted-foreground text-center lg:text-left max-w-xs">
                                Financement du programme par l'Ambassade des États-Unis à N'Djamena
                            </p>
                        </div>
                        <div className="hidden lg:block w-px h-14 bg-border" />
                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-full md:w-auto text-center">
                                En partenariat avec
                            </span>
                            <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-border/50">
                                <img src="/images/partners/smart-africa-logo.png" alt="Smart Africa" className="h-8 md:h-9 w-auto object-contain" />
                            </div>
                            <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-border/50">
                                <img src="/images/partners/sada-logo-wide.png" alt="Smart Africa Digital Academy (SADA)" className="h-10 md:h-12 w-auto object-contain" />
                            </div>
                            <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-border/50">
                                <img src="/images/partners/aws-restart-logo.png" alt="AWS re/Start" className="h-8 md:h-9 w-auto object-contain" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Session en bref */}
            <section className="py-16 bg-background" id="session">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        {applicationsClosed ? (
                            <Badge className="mb-4 bg-orange-500/10 text-orange-700 border border-orange-500/30 hover:bg-orange-500/10">
                                <Clock className="w-4 h-4 mr-1" /> Candidatures clôturées — résultats le 20 novembre 2026
                            </Badge>
                        ) : (
                            <Badge className="mb-4 bg-green-500/10 text-green-700 border border-green-500/30 hover:bg-green-500/10">
                                <CheckCircle2 className="w-4 h-4 mr-1" /> Candidatures ouvertes jusqu'au {APPLICATION_DEADLINE}
                            </Badge>
                        )}
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
                                    Cette première promotion tchadienne est <strong className="text-foreground">financée par l'Ambassade des
                                    États-Unis à N'Djamena</strong> dans le cadre du projet « Chad Cloud Talent ». Elle est mise en œuvre
                                    par <strong className="text-foreground">Smart Africa Youth Chapter Tchad</strong>, en partenariat
                                    avec <strong className="text-foreground">Smart Africa</strong>, la <strong className="text-foreground">Smart
                                    Africa Digital Academy (SADA)</strong> et <strong className="text-foreground">AWS re/Start</strong> (Amazon Web Services).
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
                                C'est pour toi si…
                            </p>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <p><strong className="text-foreground">Tu as entre 18 et 35 ans</strong>, de nationalité tchadienne.</p>
                                </div>
                                <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <p><strong className="text-foreground">Tu as le goût de la logique</strong> et des bases en mathématiques — aucune formation en informatique n'est exigée.</p>
                                </div>
                                <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <p><strong className="text-foreground">Tu es disponible à plein temps</strong>, à N'Djamena, du 23 novembre 2026 au 19 février 2027.</p>
                                </div>
                                <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <p><strong className="text-foreground">Tu es motivé(e) :</strong> la sélection se fait au mérite, sur test et entretien.</p>
                                </div>
                            </div>
                            <div className="mt-6 bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm font-medium text-foreground">
                                Jeunes femmes : vous êtes vivement encouragées à postuler.
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
                    {applicationsClosed ? (
                    <Card className="border-t-8 border-t-accent shadow-2xl rounded-2xl text-center">
                        <CardHeader className="space-y-4 pb-6">
                            <div className="mx-auto w-20 h-20 rounded-full bg-orange-500/15 flex items-center justify-center mb-2">
                                <Clock className="w-10 h-10 text-orange-600" />
                            </div>
                            <CardTitle className="text-4xl font-heading text-primary">Candidatures Clôturées</CardTitle>
                            <CardDescription className="text-lg max-w-2xl mx-auto">
                                Les candidatures pour la première promotion AWS re/Start N'Djamena sont fermées
                                depuis le 13 novembre 2026 à minuit. Merci à toutes celles et tous ceux qui ont postulé !
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-10">
                            <div className="max-w-xl mx-auto space-y-4 text-left">
                                <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg text-sm">
                                    <PhoneCall className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                    <p><strong className="text-foreground">14 – 18 novembre :</strong> les candidats présélectionnés sont contactés pour le test et l'entretien. Surveillez votre téléphone (WhatsApp) et votre email.</p>
                                </div>
                                <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <p><strong className="text-foreground">20 novembre 2026 :</strong> annonce des résultats de la sélection.</p>
                                </div>
                                <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg text-sm">
                                    <Rocket className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                    <p><strong className="text-foreground">23 novembre 2026 :</strong> début du bootcamp à N'Djamena pour les 25 retenus.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    ) : (
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
                                                                Je m'engage à suivre assidûment le bootcamp en présentiel à N'Djamena, à temps plein, du 23 novembre 2026 au 19 février 2027, et à passer l'examen de certification.
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
                    )}

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
                                Candidatures jusqu'au <strong className="text-foreground">13 novembre 2026 à minuit</strong>. Les candidats
                                présélectionnés seront contactés du <strong className="text-foreground">14 au 18 novembre</strong> pour un test
                                et un entretien. Résultats le <strong className="text-foreground">20 novembre</strong>, début du bootcamp
                                le <strong className="text-foreground">23 novembre 2026</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
