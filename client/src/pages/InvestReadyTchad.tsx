import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
    insertInvestReadyApplicationSchema,
    INVEST_READY_DEADLINE,
    type InsertInvestReadyApplication,
} from "@shared/schema";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Rocket, Send, CheckCircle2, Calendar, Users, Clock, TrendingUp, Target,
    Lightbulb, Mic, Trophy, FileText, Upload, Mail, Phone, ArrowRight, Landmark,
    PiggyBank, BarChart3, Presentation, Megaphone,
} from "lucide-react";

const selectClass = "flex h-12 w-full rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-base focus:border-accent focus-visible:outline-none";
const inputClass = "h-12 bg-muted/50 border-border/50 focus:border-accent";

const axes = [
    { icon: PiggyBank, label: "Stratégie de levée de fonds" },
    { icon: BarChart3, label: "Modèle économique et financier" },
    { icon: Megaphone, label: "Storytelling investisseur" },
    { icon: Presentation, label: "Pitch deck" },
    { icon: Mic, label: "Préparation au pitch" },
];

const eligibility = [
    "Start-up digitale ou greentech basée au Tchad",
    "Fondateurs et cofondateurs âgés de 18 à 35 ans au moment de la candidature",
    "Produit minimum viable ou premières tractions",
    "Levée de fonds prévue dans les 6 à 18 mois",
    "Deux personnes maximum par start-up",
    "Engagement de présence sur les trois jours",
];

const days = [
    {
        icon: Lightbulb,
        day: "Jour 1",
        title: "Comprendre",
        points: ["Modèle économique", "Notions financières", "Étapes d'une levée de fonds", "Travail sur le business model"],
    },
    {
        icon: Mic,
        day: "Jour 2",
        title: "Convaincre",
        points: ["Structure du pitch deck", "Storytelling", "Simulation d'entretien investisseur", "Répétitions"],
    },
    {
        icon: Trophy,
        day: "Jour 3",
        title: "Pitcher",
        points: ["Pitch de 5 minutes devant un jury de financeurs", "Délibération", "Remise de trois prix de 50 000 FCFA", "Mise en relation"],
    },
];

const criteria = [
    { icon: Rocket, label: "Maturité du produit" },
    { icon: TrendingUp, label: "Potentiel de marché" },
    { icon: Users, label: "Qualité de l'équipe" },
    { icon: PiggyBank, label: "Besoin réel de financement" },
];

export default function InvestReadyTchad() {
    const { toast } = useToast();
    const applicationsClosed = new Date() >= INVEST_READY_DEADLINE;
    const [frLogoOk, setFrLogoOk] = useState(true);
    const [idFileName, setIdFileName] = useState<string>("");
    const [deckFileName, setDeckFileName] = useState<string>("");

    const form = useForm<InsertInvestReadyApplication>({
        resolver: zodResolver(insertInvestReadyApplicationSchema),
        defaultValues: {
            startupName: "",
            sector: "",
            foundingYear: "",
            description: "",
            website: "",
            stage: "",
            revenue12m: "",
            fundingAmount: "",
            fundingTimeline: "",
            founderFirstName: "",
            founderLastName: "",
            founderDob: "",
            founderGender: "",
            founderPhone: "",
            founderEmail: "",
            secondFirstName: "",
            secondLastName: "",
            secondDob: "",
            secondGender: "",
            idFileName: "",
            idFileData: "",
            deckFileName: "",
            deckFileData: "",
            presenceCommitment: false,
            dataConsent: false,
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: InsertInvestReadyApplication) => {
            const res = await apiRequest("POST", "/api/invest-ready-applications", data);
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: "Candidature envoyée !",
                description: "Merci ! Un accusé de réception vous a été envoyé par email. Les 20 start-ups retenues seront notifiées par email et WhatsApp.",
            });
            form.reset();
            setIdFileName("");
            setDeckFileName("");
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur de soumission",
                description: error.message || "Une erreur est survenue. Veuillez réessayer.",
                variant: "destructive",
            });
        },
    });

    const readFileAsDataUrl = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const handleFile = async (
        e: React.ChangeEvent<HTMLInputElement>,
        kind: "id" | "deck"
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const maxMo = kind === "id" ? 5 : 10;
        if (file.size > maxMo * 1024 * 1024) {
            toast({ title: "Fichier trop lourd", description: `Le fichier doit faire moins de ${maxMo} Mo.`, variant: "destructive" });
            e.target.value = "";
            return;
        }
        try {
            const dataUrl = await readFileAsDataUrl(file);
            if (kind === "id") {
                form.setValue("idFileName", file.name, { shouldValidate: true });
                form.setValue("idFileData", dataUrl, { shouldValidate: true });
                setIdFileName(file.name);
            } else {
                form.setValue("deckFileName", file.name);
                form.setValue("deckFileData", dataUrl, { shouldValidate: true });
                setDeckFileName(file.name);
            }
        } catch {
            toast({ title: "Erreur", description: "Impossible de lire le fichier.", variant: "destructive" });
        }
    };

    const onSubmit = (data: InsertInvestReadyApplication) => {
        mutation.mutate(data);
    };

    const descriptionWords = (form.watch("description") || "").trim().split(/\s+/).filter(Boolean).length;

    return (
        <div className="flex flex-col min-h-screen font-sans">
            <SEOHead
                title="Invest Ready Tchad : Bootcamp investissement start-ups | SAYC Tchad"
                description="Invest Ready Tchad : bootcamp de 3 jours à N'Djamena pour préparer 20 start-ups tchadiennes à la levée de fonds. Avec le soutien de l'Ambassade de France au Tchad. Candidatures du 6 au 11 novembre 2026."
                path="/programmes/invest-ready-tchad"
                image="https://sayctchad.org/images/og-invest-ready.png"
            />

            {/* Bandeau partenaires */}
            <section className="bg-card border-b border-border py-5">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-border/50">
                                <img src="/images/partners/smart-africa-logo.png" alt="Smart Africa" className="h-8 md:h-9 w-auto object-contain" />
                            </div>
                            <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-border/50">
                                <img src="/images/partners/sada-logo-wide.png" alt="Smart Africa Digital Academy (SADA)" className="h-9 md:h-11 w-auto object-contain" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Avec le soutien de</span>
                            {frLogoOk ? (
                                <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-border/50">
                                    <img
                                        src="/images/partners/logo-ambassade-france.png"
                                        alt="Ambassade de France au Tchad"
                                        className="h-9 md:h-11 w-auto object-contain"
                                        onError={() => setFrLogoOk(false)}
                                    />
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-border/50 flex items-center gap-2">
                                    <Landmark className="w-5 h-5 text-blue-800" />
                                    <span className="text-sm font-bold text-blue-900">Ambassade de France au Tchad</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Hero */}
            <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar to-sidebar/95 text-sidebar-foreground overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent border border-accent/30 mb-6">
                        <Rocket className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Appel à candidatures</span>
                    </div>
                    <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Invest Ready <span className="text-accent underline decoration-2 underline-offset-8">Tchad</span>
                    </h1>
                    <p className="text-xl text-sidebar-foreground/80 max-w-3xl mx-auto leading-relaxed mb-6">
                        Bootcamp de préparation à l'investissement pour start-ups tchadiennes
                    </p>
                    <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-accent-foreground font-bold mb-8 shadow-lg">
                        <Calendar className="w-5 h-5" />
                        {applicationsClosed
                            ? "Les candidatures sont closes"
                            : "Candidatures du 6 au 11 novembre 2026"}
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 shadow-lg max-w-[240px]">
                            <h4 className="font-bold text-accent text-2xl mb-1">13 nov. 2026</h4>
                            <p className="text-xs uppercase tracking-wider text-sidebar-foreground/70">Lancement : 3 jours intensifs, N'Djamena, Novembre Numérique</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 shadow-lg max-w-[240px]">
                            <h4 className="font-bold text-accent text-2xl mb-1">20</h4>
                            <p className="text-xs uppercase tracking-wider text-sidebar-foreground/70">Start-ups sélectionnées</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 shadow-lg max-w-[240px]">
                            <h4 className="font-bold text-accent text-2xl mb-1">6 au 11 nov.</h4>
                            <p className="text-xs uppercase tracking-wider text-sidebar-foreground/70">Candidatures, clôture le 11 à minuit</p>
                        </div>
                    </div>

                    {!applicationsClosed && (
                        <a href="#postuler">
                            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-full px-8 shadow-xl" data-testid="button-hero-apply">
                                Postuler maintenant
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </a>
                    )}
                </div>
            </section>

            {/* Le programme */}
            <section className="py-16 bg-background" id="programme">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-8">Le programme</h2>
                    <p className="text-muted-foreground leading-relaxed text-lg text-center max-w-3xl mx-auto mb-8">
                        Invest Ready Tchad est un bootcamp de trois jours qui prépare les start-ups tchadiennes en phase
                        d'amorçage à la rencontre avec des investisseurs. Il s'inspire du SAVR Bootcamp de Smart Africa
                        et reprend ses cinq axes. Le programme est financé par l'Ambassade de France au Tchad.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {axes.map((axe) => (
                            <span key={axe.label} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground shadow-sm">
                                <axe.icon className="w-4 h-4 text-accent" />
                                {axe.label}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Qui peut postuler */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-heading font-bold text-foreground mb-3 flex items-center justify-center gap-3">
                            <Target className="w-7 h-7 text-accent" />
                            Qui peut postuler ?
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {eligibility.map((item) => (
                            <div key={item} className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-foreground">{item}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 bg-accent/10 border border-accent/30 rounded-xl p-5 text-center text-sm font-medium text-foreground">
                        Au moins 40 % des start-ups retenues seront fondées ou cofondées par des femmes.
                    </div>
                </div>
            </section>

            {/* Déroulé des trois jours */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-10">Le déroulé des trois jours</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {days.map((d) => (
                            <div key={d.day} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                                    <d.icon className="w-6 h-6 text-accent" />
                                </div>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{d.day}</p>
                                <h3 className="font-bold text-xl text-foreground mb-4">{d.title}</h3>
                                <ul className="space-y-2">
                                    {d.points.map((p) => (
                                        <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Critères de sélection */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-10">Critères de sélection</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {criteria.map((c) => (
                            <div key={c.label} className="bg-card border border-border rounded-2xl p-5 text-center shadow-sm">
                                <div className="mx-auto w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                                    <c.icon className="w-5 h-5 text-accent" />
                                </div>
                                <p className="text-sm font-medium text-foreground">{c.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-6 text-sm text-muted-foreground leading-relaxed text-center">
                        Un comité de trois personnes (SAYC Tchad, Ambassade de France, un entrepreneur confirmé)
                        sélectionne les 20 start-ups. Les résultats sont notifiés par email et WhatsApp.
                    </div>
                </div>
            </section>

            {/* Formulaire */}
            <section className="py-20 bg-background relative overflow-hidden" id="postuler">
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl -z-10"></div>
                <div className="container mx-auto px-4 max-w-4xl">
                    {applicationsClosed ? (
                        <Card className="border-t-8 border-t-accent shadow-2xl rounded-2xl text-center">
                            <CardHeader className="space-y-4 pb-6">
                                <div className="mx-auto w-20 h-20 rounded-full bg-orange-500/15 flex items-center justify-center mb-2">
                                    <Clock className="w-10 h-10 text-orange-600" />
                                </div>
                                <CardTitle className="text-4xl font-heading text-primary">Les candidatures sont closes</CardTitle>
                                <CardDescription className="text-lg max-w-2xl mx-auto">
                                    Les candidatures pour Invest Ready Tchad sont fermées depuis le 11 novembre 2026 à minuit.
                                    Les 20 start-ups sélectionnées seront notifiées par email et WhatsApp. Merci à toutes les équipes qui ont postulé !
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ) : (
                        <Card className="border-t-8 border-t-accent shadow-2xl rounded-2xl">
                            <CardHeader className="space-y-4 pb-10 text-center">
                                <div className="mx-auto w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-2">
                                    <Rocket className="w-10 h-10 text-accent" />
                                </div>
                                <CardTitle className="text-4xl font-heading text-primary">Formulaire de candidature</CardTitle>
                                <CardDescription className="text-lg max-w-2xl mx-auto">
                                    20 places. Candidatures ouvertes jusqu'au 11 novembre 2026 à minuit.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                                        {/* Section 1 : la start-up */}
                                        <div className="space-y-8">
                                            <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-border pb-3 text-primary">
                                                <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-heading">1</span>
                                                La start-up
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <FormField control={form.control} name="startupName" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Nom de la start-up <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input placeholder="Ex : TchadPay" className={inputClass} {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="sector" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Secteur <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl>
                                                            <select {...field} className={selectClass}>
                                                                <option value="">Sélectionnez...</option>
                                                                <option value="Numérique">Numérique</option>
                                                                <option value="Greentech">Greentech</option>
                                                                <option value="Agritech">Agritech</option>
                                                                <option value="Fintech">Fintech</option>
                                                                <option value="Edtech">Edtech</option>
                                                                <option value="Santé">Santé</option>
                                                                <option value="Autre">Autre</option>
                                                            </select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="foundingYear" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Année de création <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input type="number" min="2000" max="2026" placeholder="2024" className={inputClass} {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="website" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Site web ou réseaux sociaux (facultatif)</FormLabel>
                                                        <FormControl><Input placeholder="https://..." className={inputClass} {...field} value={field.value ?? ""} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="stage" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Stade <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl>
                                                            <select {...field} className={selectClass}>
                                                                <option value="">Sélectionnez...</option>
                                                                <option value="Idée avec prototype">Idée avec prototype</option>
                                                                <option value="MVP">MVP (produit minimum viable)</option>
                                                                <option value="Premières ventes">Premières ventes</option>
                                                                <option value="En croissance">En croissance</option>
                                                            </select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="revenue12m" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Chiffre d'affaires des 12 derniers mois en FCFA (facultatif)</FormLabel>
                                                        <FormControl><Input placeholder="Ex : 2 500 000" className={inputClass} {...field} value={field.value ?? ""} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="fundingAmount" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Montant de levée de fonds envisagé <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input placeholder="Ex : 15 000 000 FCFA" className={inputClass} {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="fundingTimeline" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Échéance de la levée <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl>
                                                            <select {...field} className={selectClass}>
                                                                <option value="">Sélectionnez...</option>
                                                                <option value="Dans 6 mois">Dans 6 mois</option>
                                                                <option value="Dans 6 à 12 mois">Dans 6 à 12 mois</option>
                                                                <option value="Dans 12 à 18 mois">Dans 12 à 18 mois</option>
                                                            </select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </div>
                                            <FormField control={form.control} name="description" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold">Description de la start-up <span className="text-destructive">*</span></FormLabel>
                                                    <FormDescription>300 mots maximum. Mots actuels : {descriptionWords}/300</FormDescription>
                                                    <FormControl><Textarea className="min-h-[150px] text-base bg-muted/50 border-border/50 focus:border-accent resize-y" placeholder="Que fait votre start-up, pour qui, et où en êtes-vous ?" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>

                                        {/* Section 2 : fondateur principal */}
                                        <div className="space-y-8">
                                            <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-border pb-3 text-primary">
                                                <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-heading">2</span>
                                                Fondateur principal
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <FormField control={form.control} name="founderLastName" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Nom <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input className={inputClass} {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="founderFirstName" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Prénom <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input className={inputClass} {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="founderDob" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Date de naissance <span className="text-destructive">*</span></FormLabel>
                                                        <FormDescription>Vous devez avoir entre 18 et 35 ans.</FormDescription>
                                                        <FormControl><Input type="date" className={inputClass} {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="founderGender" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Sexe <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl>
                                                            <select {...field} className={selectClass}>
                                                                <option value="">Choisir...</option>
                                                                <option value="F">Féminin</option>
                                                                <option value="M">Masculin</option>
                                                            </select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="founderPhone" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Téléphone WhatsApp <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input placeholder="+235 ..." className={inputClass} {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="founderEmail" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Email <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input type="email" placeholder="nom@exemple.com" className={inputClass} {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </div>
                                        </div>

                                        {/* Section 3 : deuxième participant */}
                                        <div className="space-y-8">
                                            <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-border pb-3 text-primary">
                                                <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-heading">3</span>
                                                Deuxième participant (facultatif)
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <FormField control={form.control} name="secondLastName" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Nom</FormLabel>
                                                        <FormControl><Input className={inputClass} {...field} value={field.value ?? ""} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="secondFirstName" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Prénom</FormLabel>
                                                        <FormControl><Input className={inputClass} {...field} value={field.value ?? ""} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="secondDob" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Date de naissance</FormLabel>
                                                        <FormDescription>Entre 18 et 35 ans également.</FormDescription>
                                                        <FormControl><Input type="date" className={inputClass} {...field} value={field.value ?? ""} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="secondGender" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Sexe</FormLabel>
                                                        <FormControl>
                                                            <select {...field} className={selectClass} value={field.value ?? ""}>
                                                                <option value="">Choisir...</option>
                                                                <option value="F">Féminin</option>
                                                                <option value="M">Masculin</option>
                                                            </select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </div>
                                        </div>

                                        {/* Section 4 : documents */}
                                        <div className="space-y-8">
                                            <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-border pb-3 text-primary">
                                                <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-heading">4</span>
                                                Documents
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-accent" />
                                                        Pièce d'identité du fondateur principal <span className="text-destructive">*</span>
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">PDF ou image, 5 Mo maximum.</p>
                                                    <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-accent/30 bg-muted/30 cursor-pointer hover:border-accent/60 transition-colors">
                                                        <Upload className="w-5 h-5 text-accent shrink-0" />
                                                        <span className="text-sm text-foreground break-all">{idFileName || "Choisir le fichier..."}</span>
                                                        <input type="file" accept="image/*,.pdf,application/pdf" className="hidden" onChange={(e) => handleFile(e, "id")} />
                                                    </label>
                                                    <FormField control={form.control} name="idFileData" render={() => (
                                                        <FormItem><FormMessage /></FormItem>
                                                    )} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                                        <Presentation className="w-4 h-4 text-accent" />
                                                        Pitch deck ou présentation (facultatif)
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">PDF, PowerPoint ou image, 10 Mo maximum.</p>
                                                    <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:border-accent/60 transition-colors">
                                                        <Upload className="w-5 h-5 text-accent shrink-0" />
                                                        <span className="text-sm text-foreground break-all">{deckFileName || "Choisir le fichier..."}</span>
                                                        <input type="file" accept="image/*,.pdf,.ppt,.pptx,application/pdf" className="hidden" onChange={(e) => handleFile(e, "deck")} />
                                                    </label>
                                                    <FormField control={form.control} name="deckFileData" render={() => (
                                                        <FormItem><FormMessage /></FormItem>
                                                    )} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 5 : engagements */}
                                        <div className="space-y-8">
                                            <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-border pb-3 text-primary">
                                                <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-heading">5</span>
                                                Engagements
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
                                                    <FormField control={form.control} name="presenceCommitment" render={({ field }) => (
                                                        <FormItem className="flex flex-row items-start space-x-4 space-y-0">
                                                            <FormControl>
                                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-accent data-[state=checked]:border-accent w-6 h-6 rounded-md mt-1" />
                                                            </FormControl>
                                                            <div>
                                                                <FormLabel className="text-base font-medium text-foreground cursor-pointer">
                                                                    Nous nous engageons à être présents les trois jours du bootcamp, du 13 au 15 novembre 2026 à N'Djamena.
                                                                </FormLabel>
                                                                <FormMessage />
                                                            </div>
                                                        </FormItem>
                                                    )} />
                                                </div>
                                                <div className="bg-muted/40 border border-border rounded-xl p-6">
                                                    <FormField control={form.control} name="dataConsent" render={({ field }) => (
                                                        <FormItem className="flex flex-row items-start space-x-4 space-y-0">
                                                            <FormControl>
                                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-accent data-[state=checked]:border-accent w-6 h-6 rounded-md mt-1" />
                                                            </FormControl>
                                                            <div>
                                                                <FormLabel className="text-base font-medium text-foreground cursor-pointer">
                                                                    J'autorise SAYC Tchad à traiter les données de ce formulaire dans le cadre de la sélection Invest Ready Tchad.
                                                                </FormLabel>
                                                                <FormMessage />
                                                            </div>
                                                        </FormItem>
                                                    )} />
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full h-16 text-xl font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 rounded-full"
                                            disabled={mutation.isPending || !form.watch("presenceCommitment") || !form.watch("dataConsent")}
                                        >
                                            {mutation.isPending ? (
                                                <>Envoi en cours...</>
                                            ) : (
                                                <>
                                                    Soumettre la candidature
                                                    <Send className="ml-3 h-6 w-6" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Contact + mise en œuvre */}
                    <div className="mt-16 grid md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-2xl bg-primary/5 border border-border">
                            <h4 className="font-bold text-xl mb-3 text-primary">Contact</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed flex items-center gap-2 mb-2">
                                <Mail className="w-4 h-4 text-accent" />
                                <a href="mailto:sayctchad@gmail.com" className="hover:underline">sayctchad@gmail.com</a>
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed flex items-center gap-2">
                                <Phone className="w-4 h-4 text-accent" />
                                <a href="tel:+23566161753" className="hover:underline">+235 66 16 17 53</a>
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-green-500/5 border border-green-500/10">
                            <h4 className="font-bold text-xl mb-3 text-green-700">Bon à savoir</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Le bootcamp a lieu à N'Djamena dans le cadre du Novembre Numérique.
                                Les résultats de la sélection sont notifiés par email et WhatsApp avant le lancement du 13 novembre 2026.
                            </p>
                        </div>
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-10">
                        Mis en œuvre par le <strong className="text-foreground">Smart Africa Youth Chapter Tchad</strong>
                    </p>
                </div>
            </section>
        </div>
    );
}
