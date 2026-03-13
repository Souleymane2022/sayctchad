import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertMemberSchema, type InsertMember, type Member } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MemberCard } from "@/components/MemberCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Camera, Download, Share2, CheckCircle2, Target, ShieldCheck, Info, Heart, Users, Star } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const ageRanges = [
    { value: "15-18", label: "15-18 ans" },
    { value: "19-24", label: "19-24 ans" },
    { value: "25-30", label: "25-30 ans" },
    { value: "31-35", label: "31-35 ans" },
];

const educationLevels = [
    { value: "secondary", label: "Secondaire" },
    { value: "bac", label: "Baccalauréat" },
    { value: "license", label: "Licence" },
    { value: "master", label: "Master" },
    { value: "doctorate", label: "Doctorat" },
    { value: "other", label: "Autre" },
];

export default function MembershipRegistration() {
    const { toast } = useToast();
    const [step, setStep] = useState<"form" | "success">("form");
    const [createdMember, setCreatedMember] = useState<Member | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const form = useForm<InsertMember>({
        resolver: zodResolver(insertMemberSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            ageRange: "",
            city: "",
            education: "",
            occupation: "",
            motivation: "",
            photoUrl: "",
            acceptTerms: false,
        },
    });

    const registrationMutation = useMutation({
        mutationFn: async (data: InsertMember) => {
            const res = await apiRequest("POST", "/api/members", data);
            return res.json();
        },
        onSuccess: (data: Member) => {
            setCreatedMember(data);
            setStep("success");
            toast({
                title: "Bienvenue au SAYC!",
                description: "Votre carte de membre a été générée avec succès.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur",
                description: error.message || "Une erreur est survenue lors de l'inscription.",
                variant: "destructive",
            });
        },
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast({
                    title: "Image trop lourde",
                    description: "Veuillez choisir une image de moins de 2 Mo.",
                    variant: "destructive",
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPhotoPreview(base64String);
                form.setValue("photoUrl", base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = (data: InsertMember) => {
        if (!data.photoUrl) {
            toast({
                title: "Photo requise",
                description: "Veuillez ajouter une photo pour votre carte de membre.",
                variant: "destructive",
            });
            return;
        }
        registrationMutation.mutate(data);
    };

    const handlePrint = () => {
        window.print();
    };

    if (step === "success" && createdMember) {
        return (
            <div className="container mx-auto px-4 py-12 flex flex-col items-center">
                <SEOHead
                    title="Ma Carte Membre SAYC"
                    description="Félicitations ! Votre carte de membre SAYC Tchad est prête."
                    path="/devenir-membre-sayc/succes"
                />
                <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-5">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-heading font-bold">Félicitations, {createdMember.firstName} !</h1>
                    <p className="text-muted-foreground">
                        Vous êtes désormais officiellement membre du Smart Africa Youth Chapter Tchad.
                        Voici votre carte de membre digitale.
                    </p>

                    <div className="print:m-0 print:p-0">
                        <MemberCard member={createdMember} />
                    </div>

                    <div className="no-print mt-6">
                        <Button onClick={() => setStep("form")} variant="ghost">
                            Effectuer une autre inscription
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <SEOHead
                title="Inscription Membre SAYC Tchad"
                description="Rejoignez la communauté SAYC Tchad et obtenez votre carte de membre."
                path="/devenir-membre-sayc"
            />
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Information Strategy Section */}
                <section className="grid md:grid-cols-5 gap-8 items-start">
                    <div className="md:col-span-2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-semibold text-xs border border-accent/20">
                            <Star className="w-3 h-3" />
                            Engagement & Missions
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-[#1e3a8a] leading-tight">
                            Pourquoi rejoindre le <span className="text-accent underline underline-offset-4 decoration-sayc-teal/50">SAYC Tchad</span> ?
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Le Smart Africa Youth Chapter est bien plus qu'une simple plateforme. C'est un mouvement panafricain pour transformer l'avenir de notre continent par le numérique.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 rounded-2xl bg-white border shadow-sm hover:shadow-md transition-shadow group">
                                <div className="w-12 h-12 rounded-xl bg-sayc-teal/10 text-sayc-teal flex items-center justify-center shrink-0 group-hover:bg-sayc-teal group-hover:text-white transition-colors">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1e3a8a]">Vision Claire</h4>
                                    <p className="text-xs text-muted-foreground">Une ambition commune pour la transformation digitale du Tchad.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-2xl bg-white border shadow-sm hover:shadow-md transition-shadow group">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1e3a8a]">Réseau Officiel</h4>
                                    <p className="text-xs text-muted-foreground">Représentation officielle de Smart Africa Alliance au Tchad.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <Card className="border-accent/10 shadow-2xl overflow-hidden bg-sidebar text-sidebar-foreground">
                            <div className="p-1 bg-gradient-to-r from-sayc-teal via-accent to-[#1e3a8a]" />
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Info className="w-5 h-5 text-accent" />
                                    Charte du Membre
                                </CardTitle>
                                <CardDescription className="text-sidebar-foreground/70">
                                    Découvrez nos missions, vos engagements et les conditions d'adhésion.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <Tabs defaultValue="missions" className="w-full">
                                    <TabsList className="grid grid-cols-3 bg-white/5 p-1 rounded-xl">
                                        <TabsTrigger value="missions" className="text-xs rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white">Missions</TabsTrigger>
                                        <TabsTrigger value="engagements" className="text-xs rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white">Engagements</TabsTrigger>
                                        <TabsTrigger value="conditions" className="text-xs rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white">Conditions</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="missions" className="mt-6 space-y-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <ul className="space-y-3">
                                                <li className="flex items-start gap-3 text-sm">
                                                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5"><div className="w-2 h-2 rounded-full bg-accent" /></div>
                                                    Promouvoir le leadership numérique chez les jeunes Tchadiens.
                                                </li>
                                                <li className="flex items-start gap-3 text-sm">
                                                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5"><div className="w-2 h-2 rounded-full bg-accent" /></div>
                                                    Encourager l'innovation et l'entrepreneuriat technologique local.
                                                </li>
                                                <li className="flex items-start gap-3 text-sm">
                                                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5"><div className="w-2 h-2 rounded-full bg-accent" /></div>
                                                    Faciliter la collaboration entre les talents pour des solutions locales.
                                                </li>
                                            </ul>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="engagements" className="mt-6 space-y-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <ul className="space-y-3">
                                                <li className="flex items-start gap-3 text-sm">
                                                    <CheckCircle2 className="w-5 h-5 text-sayc-teal shrink-0" />
                                                    Participer activement aux programmes et événements du chapitre.
                                                </li>
                                                <li className="flex items-start gap-3 text-sm">
                                                    <CheckCircle2 className="w-5 h-5 text-sayc-teal shrink-0" />
                                                    Respecter l'éthique et les valeurs de Smart Africa Alliance.
                                                </li>
                                                <li className="flex items-start gap-3 text-sm">
                                                    <CheckCircle2 className="w-5 h-5 text-sayc-teal shrink-0" />
                                                    Servir d'ambassadeur de la transformation numérique.
                                                </li>
                                            </ul>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="conditions" className="mt-6 space-y-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-3 text-sm font-semibold">
                                                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">15+</div>
                                                    Âge requis : entre 15 et 35 ans.
                                                </li>
                                                <li className="flex items-start gap-3 text-sm">
                                                    <Users className="w-5 h-5 text-accent shrink-0" />
                                                    Résider au Tchad ou faire partie de la diaspora tchadienne.
                                                </li>
                                                <li className="flex items-start gap-3 text-sm">
                                                    <Star className="w-5 h-5 text-accent shrink-0" />
                                                    Passion pour la technologie et le développement de l'Afrique.
                                                </li>
                                            </ul>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                                    <p className="text-[10px] text-sidebar-foreground/50 italic capitalize">
                                        Le respect de cette charte est essentiel pour maintenir l'integrité du réseau.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <hr className="border-muted" />

                <Card className="border-accent/20 shadow-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-[#1e3a8a] via-accent to-sayc-teal" />
                    <CardHeader className="text-center space-y-2 pb-8">
                        <img src="/favicon.png" alt="SAYC" className="w-16 h-16 mx-auto mb-2" />
                        <CardTitle className="text-3xl font-heading font-bold text-[#1e3a8a]">Formulaire d'Inscription</CardTitle>
                        <CardDescription className="text-base max-w-lg mx-auto">
                            Rejoignez la plus grande communauté panafricaine de jeunes leaders du numérique.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* Photo Upload Section */}
                                <div className="flex flex-col items-center gap-4 p-6 bg-muted/30 rounded-2xl border-2 border-dashed border-accent/20">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-2xl border-2 border-accent/50 overflow-hidden bg-white flex items-center justify-center text-accent/30 shadow-inner">
                                            {photoPreview ? (
                                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Camera className="w-12 h-12" />
                                            )}
                                        </div>
                                        <Label
                                            htmlFor="photo-upload"
                                            className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform"
                                        >
                                            <Camera className="w-5 h-5" />
                                        </Label>
                                        <Input
                                            id="photo-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoChange}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h4 className="font-semibold text-sm">Photo d'identité</h4>
                                        <p className="text-xs text-muted-foreground">Format carré recommandé (Portrait)</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Prénom</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Jean" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nom</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Dupont" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="jean.dupont@email.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Téléphone (WhatsApp)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+235 66 00 00 00" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ageRange"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tranche d'âge</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Choisir" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {ageRanges.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ville</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="N'Djamena" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="education"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Niveau d'études</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Choisir" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {educationLevels.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="occupation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Profession</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Étudiant, Dev, etc." {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="acceptTerms"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-xl bg-muted/50">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-xs">
                                                    Je confirme l'exactitude des informations fournies et j'accepte d'être contacté par le SAYC Tchad pour les opportunités et événements.
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full h-14 text-lg font-bold bg-[#1e3a8a] hover:bg-[#1e40af] transition-all transform hover:scale-[1.01]"
                                    disabled={registrationMutation.isPending}
                                >
                                    {registrationMutation.isPending ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Génération en cours...</>
                                    ) : (
                                        "Générer ma carte de membre"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .container { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
        }
      `}} />
        </div>
    );
}
