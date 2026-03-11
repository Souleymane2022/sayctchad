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
import { Loader2, Camera, Download, Share2, CheckCircle2 } from "lucide-react";
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
                <SEOHead title="Ma Carte Membre SAYC" description="Félicitations ! Votre carte de membre SAYC Tchad est prête." />
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

                    <div className="flex flex-wrap justify-center gap-4 no-print">
                        <Button onClick={handlePrint} variant="outline" className="gap-2">
                            <Download className="w-4 h-4" />
                            Télécharger / Imprimer la carte
                        </Button>
                        <Button onClick={() => setStep("form")} variant="ghost">
                            Nouvelle inscription
                        </Button>
                    </div>

                    <p className="text-xs text-muted-foreground no-print italic">
                        Astuce : Pour sauvegarder sur mobile, faites une capture d'écran nette de chaque côté de la carte.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <SEOHead title="Inscription Membre SAYC Tchad" description="Rejoignez la communauté SAYC Tchad et obtenez votre carte de membre." />
            <div className="max-w-2xl mx-auto">
                <Card className="border-accent/20 shadow-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-[#1e3a8a] via-accent to-sayc-teal" />
                    <CardHeader className="text-center space-y-2">
                        <img src="/favicon.png" alt="SAYC" className="w-16 h-16 mx-auto mb-2" />
                        <CardTitle className="text-3xl font-heading font-bold text-[#1e3a8a]">Devenir Membre SAYC</CardTitle>
                        <CardDescription className="text-lg">
                            Complétez ce formulaire pour obtenir votre carte de membre officielle.
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
