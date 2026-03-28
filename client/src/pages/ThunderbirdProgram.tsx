import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertThunderbirdApplicationSchema, type InsertThunderbirdApplication } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
import { GraduationCap, Send, CheckCircle2, Info, Globe, ShieldCheck, Zap, ExternalLink, Award } from "lucide-react";
import { Link } from "wouter";

export default function ThunderbirdProgram() {
    const { toast } = useToast();
    const form = useForm<InsertThunderbirdApplication>({
        resolver: zodResolver(insertThunderbirdApplicationSchema),
        defaultValues: {
            fullName: "",
            gender: "",
            dateOfBirth: "",
            city: "N'Djamena",
            phone: "",
            email: "",
            educationLevel: "",
            schoolOrUniversity: "",
            fieldOfStudy: "",
            englishLevel: "Débutant",
            hasOnlineExperience: false,
            experienceFields: [],
            targetPathway: "Foundational",
            motivation: "",
            expectations: "",
            communityImpact: "",
            timeCommitment: "5-10h",
            readyForOnline: false,
            readyForCohort: false,
            projectIdea: "",
            discoverySource: "",
            consent: false,
            cohort: "Cohorte 2 (En attente)",
            status: "pending",
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: InsertThunderbirdApplication) => {
            const res = await apiRequest("POST", "/api/thunderbird-applications", data);
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: "Candidature envoyée !",
                description: "Merci pour votre engagement. Votre dossier est en cours d'examen.",
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

    const onSubmit = (data: InsertThunderbirdApplication) => {
        mutation.mutate(data);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <SEOHead
                title="Candidature Thunderbird | Najafi 100 Million Learners"
                description="Rejoignez la cohorte Tchadienne de la Thunderbird School of Global Management. Initiative Najafi 100 Million Learners."
                path="/programmes/thunderbird"
            />

            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-br from-[#0c1b33] to-[#1a3a5f] text-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30 mb-6">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-sm font-medium">Excellence Académique Mondiale</span>
                    </div>
                    <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
                        Najafi <span className="text-accent underline decoration-2 underline-offset-8">100 Million Learners</span>
                    </h1>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
                        Une initiative mondiale de la Thunderbird School of Global Management (ASU). 
                        Félicitations aux <strong>277 lauréats</strong> de la première cohorte !
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 mb-12">
                        <Link href="/programmes/thunderbird/resultats">
                            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 h-14 rounded-full shadow-lg shadow-accent/20 flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Voir les Résultats de la Bourse
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/20">
                            <h4 className="font-bold text-accent text-2xl">100M</h4>
                            <p className="text-xs uppercase tracking-wider">Apprenants Mondiaux</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/20">
                            <h4 className="font-bold text-accent text-2xl">40</h4>
                            <p className="text-xs uppercase tracking-wider">Langues Disponibles</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/20">
                            <h4 className="font-bold text-accent text-2xl">TOP 1</h4>
                            <p className="text-xs uppercase tracking-wider">Management Global</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Information Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-heading font-bold color-text-primary">Pourquoi nous rejoindre ?</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                L'initiative mondiale Francis et Dionne Najafi 100 Million Learners offre une formation en ligne accréditée
                                en gestion mondiale et en entrepreneuriat, sans aucun coût pour les apprenants.
                            </p>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                        <Zap className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Compétences du 21e Siècle</h4>
                                        <p className="text-sm text-muted-foreground">Maîtrisez l'entrepreneuriat, le leadership stratégique et la transformation numérique.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                        <Globe className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Reconnaissance Internationale</h4>
                                        <p className="text-sm text-muted-foreground">Obtenez des badges numériques et des certificats accrédités par ASU/Thunderbird.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Parcours Académiques</h4>
                                        <p className="text-sm text-muted-foreground">Possibilité de crédits académiques pour des diplômes universitaires futurs.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card p-8 rounded-3xl shadow-xl border border-accent/10">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Info className="w-6 h-6 text-accent" />
                                Les 3 Parcours
                            </h3>
                            <div className="space-y-6 text-sm">
                                <div className="p-4 rounded-xl bg-accent/5 border-l-4 border-accent">
                                    <h5 className="font-bold text-accent mb-1">1. Foundational (Fondamental)</h5>
                                    <p className="text-muted-foreground italic">Pour tous les niveaux.</p>
                                    <p className="mt-2">Contenu : Fondamentaux des affaires, culture numérique, compétences interculturelles.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-primary/5 border-l-4 border-primary">
                                    <h5 className="font-bold text-primary mb-1">2. Intermediate (Intermédiaire)</h5>
                                    <p className="text-muted-foreground italic">Niveau Licence / Professionnel.</p>
                                    <p className="mt-2">Contenu : Leadership stratégique, transformation numérique, négociations éthiques.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-sidebar/5 border-l-4 border-sidebar">
                                    <h5 className="font-bold text-sidebar mb-1">3. Advanced (Avancé)</h5>
                                    <p className="text-muted-foreground italic">Niveau Master / Exécutif.</p>
                                    <p className="mt-2">Contenu : Innovation numérique, durabilité, prise de décision complexe.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Card className="border-t-8 border-t-accent shadow-2xl">
                        <CardHeader className="space-y-4 pb-10 text-center">
                            <div className="mx-auto w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-2 animate-pulse">
                                <GraduationCap className="w-10 h-10 text-accent" />
                            </div>
                            <CardTitle className="text-4xl font-heading">Rejoindre la Cohorte 2</CardTitle>
                            <CardDescription className="text-lg">
                                Les inscriptions pour la première cohorte sont closes (277 sélectionnés). 
                                <strong> Inscrivez-vous dès maintenant sur la liste d'attente </strong> 
                                pour être prioritaire lors du lancement de la deuxième cohorte.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                                    {/* Section 1: Identité */}
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold flex items-center gap-3 border-b pb-3">
                                            <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg">1</span>
                                            Identité & Contact
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <FormField
                                                control={form.control}
                                                name="fullName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Nom Complet</FormLabel>
                                                        <FormControl><Input placeholder="Prénom et Nom" className="h-12" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="gender"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Sexe</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12">
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
                                                        <FormLabel className="text-base font-semibold">Date de Naissance</FormLabel>
                                                        <FormControl><Input type="date" className="h-12" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Ville de Résidence</FormLabel>
                                                        <FormControl><Input className="h-12" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Numéro WhatsApp</FormLabel>
                                                        <FormControl><Input placeholder="+235 ..." className="h-12" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Email Professionnel</FormLabel>
                                                        <FormControl><Input type="email" placeholder="nom@exemple.com" className="h-12" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Section 2: Profil & Niveau */}
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold flex items-center gap-3 border-b pb-3">
                                            <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg">2</span>
                                            Profil & Compétences
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <FormField
                                                control={form.control}
                                                name="educationLevel"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Niveau d'Étude Actuel</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12">
                                                                    <SelectValue placeholder="Sélectionnez" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Lycée">Lycée / BAC</SelectItem>
                                                                <SelectItem value="Licence">Licence (L1, L2, L3)</SelectItem>
                                                                <SelectItem value="Master">Master / Ingénieur</SelectItem>
                                                                <SelectItem value="Doctorat">Doctorat</SelectItem>
                                                                <SelectItem value="Autre">Autre</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="englishLevel"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Niveau d'Anglais</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value || "Débutant"}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12">
                                                                    <SelectValue placeholder="Auto-évaluation" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Débutant">Débutant (A1-A2)</SelectItem>
                                                                <SelectItem value="Intermédiaire">Intermédiaire (B1-B2)</SelectItem>
                                                                <SelectItem value="Avancé">Avancé / Courant (C1-C2)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormDescription>La plateforme Thunderbird est accessible en plusieurs langues.</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="fieldOfStudy"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Spécialité / Profession</FormLabel>
                                                        <FormControl><Input placeholder="Ex: Finance, Développement Web..." className="h-12" {...field} value={field.value ?? ""} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="schoolOrUniversity"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Institution / Université</FormLabel>
                                                        <FormControl><Input placeholder="Ex: Université de N'Djamena" className="h-12" {...field} value={field.value ?? ""} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Section 3: Choix du Parcours */}
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold flex items-center gap-3 border-b pb-3">
                                            <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg">3</span>
                                            Parcours Najafi Souhaité
                                        </h3>
                                        <FormField
                                            control={form.control}
                                            name="targetPathway"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-base font-semibold">Lequel des 3 parcours vous intéresse le plus ?</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value || "Foundational"}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-14">
                                                                <SelectValue placeholder="Sélectionnez un parcours" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Foundational">1. Foundational (Débutants / Tous niveaux)</SelectItem>
                                                            <SelectItem value="Intermediate">2. Intermediate (Étudiants / Professionals)</SelectItem>
                                                            <SelectItem value="Advanced">3. Advanced (Leaders / Exécutifs)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Section 4: Motivation Rigoureuse */}
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold flex items-center gap-3 border-b pb-3">
                                            <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg">4</span>
                                            Motivation & Impact
                                        </h3>
                                        <FormField
                                            control={form.control}
                                            name="motivation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-base font-semibold">Quelles sont vos motivations réelles pour suivre ce programme international ?</FormLabel>
                                                    <FormControl><Textarea className="min-h-[120px] text-base" placeholder="Détaillez votre vision..." {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="projectIdea"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-base font-semibold">Décrivez un projet ou une initiative que vous aimeriez lancer ou améliorer grâce à ces cours.</FormLabel>
                                                    <FormControl><Textarea className="min-h-[150px] text-base" placeholder="Soyez le plus explicite possible..." {...field} value={field.value ?? ""} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="communityImpact"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-base font-semibold">Comment votre participation bénéficiera-t-elle à la communauté locale au Tchad ?</FormLabel>
                                                    <FormControl><Textarea className="min-h-[120px] text-base" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Section 5: Engagement */}
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold flex items-center gap-3 border-b pb-3">
                                            <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg">5</span>
                                            Engagement & Discipline
                                        </h3>
                                        <div className="space-y-6">
                                            <FormField
                                                control={form.control}
                                                name="timeCommitment"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Disponibilité hebdomadaire pour l'étude en ligne</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value || "5-10h"}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12">
                                                                    <SelectValue placeholder="Heures par semaine" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="3-5h">3 à 5 heures / semaine</SelectItem>
                                                                <SelectItem value="5-10h">5 à 10 heures / semaine</SelectItem>
                                                                <SelectItem value="10h+">Plus de 10 heures / semaine</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="grid gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="readyForOnline"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-4 space-y-0 rounded-xl border-2 p-5 bg-accent/5 border-accent/10">
                                                            <FormControl>
                                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                            </FormControl>
                                                            <FormLabel className="text-base font-medium">Je m'engage à suivre tous les cours en ligne jusqu'à l'obtention du certificat.</FormLabel>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="readyForCohort"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-4 space-y-0 rounded-xl border-2 p-5 bg-accent/5 border-accent/10">
                                                            <FormControl>
                                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                            </FormControl>
                                                            <FormLabel className="text-base font-medium">Je souhaite participer activement aux rencontres de cohorte organisées à N'Djamena.</FormLabel>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 6: Consentement Final */}
                                    <div className="space-y-8 pt-8 border-t">
                                        <FormField
                                            control={form.control}
                                            name="consent"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-4 space-y-0 rounded-xl bg-sidebar/5 p-6 border-2 border-sidebar/10">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <div className="space-y-2 leading-none">
                                                        <FormLabel className="text-sm font-semibold leading-relaxed">
                                                            J’accepte que mes informations soient utilisées pour la gestion du programme de formation
                                                            organisé par <span className="text-sidebar font-bold">Smart Africa</span> et le
                                                            <span className="text-sidebar font-bold"> Smart Africa Youth Chapter Tchad</span> (chapitre de Smart Africa mère)
                                                            en partenariat avec la <span className="text-sidebar font-bold">Thunderbird School of Global Management</span>.
                                                        </FormLabel>
                                                        <FormMessage />
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full h-16 text-xl font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-2xl transition-all hover:scale-[1.01]"
                                        disabled={mutation.isPending}
                                    >
                                        {mutation.isPending ? (
                                            <>
                                                <Zap className="mr-2 h-6 w-6 animate-pulse" />
                                                Envoi de votre pré-inscription...
                                            </>
                                        ) : (
                                            <>
                                                S'inscrire sur la Liste d'Attente (Cohorte 2)
                                                <Send className="ml-3 h-6 w-6" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <div className="mt-16 grid md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10">
                            <h4 className="font-bold text-xl mb-3">Soutien Local</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Le Smart Africa Youth Chapter Tchad assure l'accompagnement local
                                des apprenants tchadiens pour garantir le succès de cette cohorte nationale.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-secondary/5 border border-secondary/10">
                            <h4 className="font-bold text-xl mb-3">Admission</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Les dossiers sont examinés en continu. Vous recevrez une notification
                                officielle par Email et WhatsApp suite à votre présélection.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
