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
import { Cloud, Send, CheckCircle2, Info, Laptop, Target, Zap, ShieldCheck, Briefcase } from "lucide-react";
import { Link } from "wouter";

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
            fullTimeCommitment: false,
            status: "pending",
            cohort: "Tchad 2024",
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
                title="Devenez Spécialiste Cloud Junior | AWS re/Start Tchad"
                description="Rejoignez le programme AWS re/Start au Tchad : formation intensive et gratuite de 12 semaines pour lancer votre carrière dans le CloudComputing."
                path="/programmes/aws-restart"
            />

            {/* Hero Section with AWS Theme */}
            <section className="py-20 bg-gradient-to-br from-[#232F3E] to-[#121921] text-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF9900]/10 text-[#FF9900] border border-[#FF9900]/30 mb-6">
                        <Cloud className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">AWS re/Start Tchad</span>
                    </div>
                    <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Devenez Spécialiste <br/>
                        <span className="text-[#FF9900]">Cloud Junior</span>
                    </h1>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
                        Transformez votre vie grâce au Cloud ! Une formation en ligne gratuite et intensive de 12 semaines pour vous propulser vers de nouvelles opportunités de carrière technologique.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="bg-white/5 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 shadow-lg">
                            <h4 className="font-bold text-[#FF9900] text-3xl mb-1">12</h4>
                            <p className="text-xs uppercase tracking-wider text-slate-300">Semaines Intensives</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 shadow-lg">
                            <h4 className="font-bold text-[#FF9900] text-3xl mb-1">100%</h4>
                            <p className="text-xs uppercase tracking-wider text-slate-300">Gratuit et En Ligne</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 shadow-lg">
                            <h4 className="font-bold text-[#FF9900] text-3xl mb-1">0</h4>
                            <p className="text-xs uppercase tracking-wider text-slate-300">Expérience Requise</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Information Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-heading font-bold text-foreground">Pourquoi rejoindre le programme AWS re/Start ?</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Présenté par Smart Africa Youth Chapter Tchad, ce programme complet vous prépare 
                                pour un poste de niveau débutant dans les opérations Cloud.
                            </p>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#FF9900]/10 flex items-center justify-center shrink-0">
                                        <Laptop className="w-6 h-6 text-[#FF9900]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">Compétences Techniques Pratiques</h4>
                                        <p className="text-sm text-muted-foreground">Bases du Cloud AWS, Linux, Scripting Python/Bash, Réseaux et Sécurité, Déploiement CI/CD.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#FF9900]/10 flex items-center justify-center shrink-0">
                                        <Briefcase className="w-6 h-6 text-[#FF9900]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">Soft Skills & Emploi</h4>
                                        <p className="text-sm text-muted-foreground">Coaching pour les entretiens, rédaction de CV, et un accès facilité à un réseau d'employeurs.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#FF9900]/10 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-6 h-6 text-[#FF9900]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">Certification Officielle</h4>
                                        <p className="text-sm text-muted-foreground">Passez et obtenez le badge AWS re/Start valide mondialement, démontrant vos acquis face aux recruteurs.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card p-8 rounded-3xl shadow-xl border-l-[6px] border-l-[#FF9900] border-t border-r border-b border-border">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Target className="w-6 h-6 text-[#FF9900]" />
                                Public Cible Privilégié
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Cette initiative vise particulièrement à encourager le développement technologique pour :
                            </p>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <p><strong className="text-foreground">Jeunes chômeurs et sous-employés (NEETs) :</strong> À la recherche d'une opportunité d'entrer dans l'un des secteurs les plus porteurs.</p>
                                </div>
                                <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <p><strong className="text-foreground">Reconversion professionnelle :</strong> Que vous veniez de la vente, du secrétariat ou autre, une nouvelle carrière vous attend.</p>
                                </div>
                                <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <p><strong className="text-foreground">Populations sous-représentées :</strong> Focus prioritaire pour les femmes dans la tech et les personnes en situation de handicap (infrastructures adaptées virtuellement).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-20 bg-background relative overflow-hidden">
                {/* Decorative background shapes */}
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-[#FF9900]/5 blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-[#232F3E]/5 blur-3xl -z-10"></div>
                
                <div className="container mx-auto px-4 max-w-4xl">
                    <Card className="border-t-[8px] border-t-[#232F3E] shadow-2xl rounded-2xl">
                        <CardHeader className="space-y-4 pb-10 text-center relative">
                            <div className="mx-auto w-20 h-20 rounded-full bg-[#FF9900]/10 flex items-center justify-center mb-2 shadow-sm border border-[#FF9900]/20">
                                <Zap className="w-10 h-10 text-[#FF9900]" />
                            </div>
                            <CardTitle className="text-4xl font-heading text-[#232F3E]">Postuler Maintenant</CardTitle>
                            <CardDescription className="text-lg max-w-2xl mx-auto">
                                Saisissez cette opportunité unique de lancer votre parcours dans le Cloud. 
                                Les places sont limitées, seules les candidatures les plus motivées seront retenues.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                                    {/* Section 1: Identité */}
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-border pb-3 text-[#232F3E]">
                                            <span className="bg-[#232F3E] text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md font-heading">1</span>
                                            Informations Personnelles
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <FormField
                                                control={form.control}
                                                name="fullName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Nom Complet <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input placeholder="Prénom et Nom" className="h-12 bg-muted/50 border-border/50 focus:border-[#FF9900] transition-colors" {...field} /></FormControl>
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
                                                                <SelectTrigger className="h-12 bg-muted/50 border-border/50 focus:border-[#FF9900]">
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
                                                        <FormControl><Input type="date" className="h-12 bg-muted/50 border-border/50 focus:border-[#FF9900]" {...field} /></FormControl>
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
                                                        <FormControl><Input className="h-12 bg-muted/50 border-border/50 focus:border-[#FF9900]" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Section 2: Contact & Profil */}
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-border pb-3 text-[#232F3E]">
                                            <span className="bg-[#232F3E] text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md font-heading">2</span>
                                            Contact & Profil
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Numéro WhatsApp <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input placeholder="+235 ..." className="h-12 bg-muted/50 border-border/50 focus:border-[#FF9900]" {...field} /></FormControl>
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
                                                        <FormControl><Input type="email" placeholder="nom@exemple.com" className="h-12 bg-muted/50 border-border/50 focus:border-[#FF9900]" {...field} /></FormControl>
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
                                                                <SelectTrigger className="h-12 bg-muted/50 border-border/50 focus:border-[#FF9900]">
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
                                                                <SelectTrigger className="h-12 bg-muted/50 border-border/50 focus:border-[#FF9900]">
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
                                        <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-border pb-3 text-[#232F3E]">
                                            <span className="bg-[#232F3E] text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md font-heading">3</span>
                                            Motivation
                                        </h3>
                                        <FormField
                                            control={form.control}
                                            name="motivation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold">Pourquoi souhaitez-vous intégrer le programme AWS re/Start ? <span className="text-destructive">*</span></FormLabel>
                                                    <FormDescription className="mb-2">Votre réponse est cruciale pour la sélection. Expliquez comment cette formation impactera votre carrière et vos ambitions dans le numérique (min 50 mots).</FormDescription>
                                                    <FormControl><Textarea className="min-h-[150px] text-base bg-muted/50 border-border/50 focus:border-[#FF9900] resize-y" placeholder="Ma motivation est..." {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Section 4: Engagement */}
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-border pb-3 text-[#232F3E]">
                                            <span className="bg-[#232F3E] text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md font-heading">4</span>
                                            Engagement
                                        </h3>
                                        <div className="bg-[#FF9900]/5 border border-[#FF9900]/20 rounded-xl p-6">
                                            <FormField
                                                control={form.control}
                                                name="fullTimeCommitment"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-4 space-y-0">
                                                        <FormControl>
                                                            <Checkbox 
                                                                checked={field.value} 
                                                                onCheckedChange={field.onChange} 
                                                                className="data-[state=checked]:bg-[#FF9900] data-[state=checked]:border-[#FF9900] w-6 h-6 rounded-md mt-1"
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1">
                                                            <FormLabel className="text-base font-medium text-foreground cursor-pointer">
                                                                Je m'engage à suivre assidûment cette formation en ligne pendant 12 semaines et à participer aux évaluations de certification.
                                                            </FormLabel>
                                                            <p className="text-sm text-muted-foreground mt-2">
                                                                Ce programme exige un rythme intense. En cochant cette case, vous confirmez comprendre l'effort nécessaire.
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
                                        className="w-full h-16 text-xl font-bold bg-[#FF9900] hover:bg-[#E88A00] text-[#232F3E] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 rounded-xl"
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
                        <div className="p-8 rounded-2xl bg-[#232F3E]/5 border border-border">
                            <h4 className="font-bold text-xl mb-3 text-[#232F3E]">Modalités Pratiques</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Les sessions se dérouleront **entièrement en ligne**. Les candidats retenus 
                                recevront par email les accès à la plateforme d'apprentissage AWS Educate.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-green-500/5 border border-green-500/10">
                            <h4 className="font-bold text-xl mb-3 text-green-700">Avis de Sélection</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Un comité évaluera la motivation et la conformité au public cible.
                                Seules les personnes présélectionnées seront contactées pour un entretien de confirmation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
