import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertCandidateSchema, type InsertCandidate } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Camera, Upload, Link as LinkIcon, AlertCircle, CheckCircle2, Linkedin, Facebook, Twitter } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";

const postRoles = [
    { value: "Leader Adjoint", label: "Leader National Adjoint (Coordination des provinces)" },
    { value: "Secteur Privé", label: "Représentant du secteur privé / innovation" },
    { value: "Académique", label: "Représentant académique (Recherche & Formation)" },
    { value: "Inclusion", label: "Représentant inclusion & genre" },
];

export default function CandidateApplication() {
    const { toast } = useToast();
    const [step, setStep] = useState<"form" | "success">("form");
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const form = useForm<InsertCandidate>({
        resolver: zodResolver(insertCandidateSchema),
        defaultValues: {
            firstName: "",
            nomSpecifiqueUnique: "",
            email: "",
            role: "",
            photoUrl: "",
            cvUrl: "",
            motivationUrl: "",
            videoUrl: "",
            programUrl: "",
            linkedInUrl: "",
            facebookUrl: "",
            twitterUrl: "",
        },
    });

    const applicationMutation = useMutation({
        mutationFn: async (data: InsertCandidate) => {
            const res = await apiRequest("POST", "/api/elections/apply", data);
            return res.json();
        },
        onSuccess: () => {
            setStep("success");
            toast({
                title: "Candidature envoyée!",
                description: "Votre dossier est en cours de révision par le comité technique.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur",
                description: error.message || "Une erreur est survenue lors du dépôt de candidature.",
                variant: "destructive",
            });
        },
    });

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/jpeg", 0.7));
                };
            };
        });
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast({
                    title: "Image trop lourde",
                    description: "Veuillez choisir une image de moins de 10 Mo.",
                    variant: "destructive",
                });
                return;
            }

            try {
                const compressedBase64 = await compressImage(file);
                setPhotoPreview(compressedBase64);
                form.setValue("photoUrl", compressedBase64);
            } catch (error) {
                toast({
                    title: "Erreur",
                    description: "Impossible de traiter l'image.",
                    variant: "destructive",
                });
            }
        }
    };

    const onSubmit = (data: InsertCandidate) => {
        if (!data.photoUrl) {
            toast({
                title: "Photo requise",
                description: "Une photo est nécessaire pour votre profil de candidat.",
                variant: "destructive",
            });
            return;
        }
        applicationMutation.mutate(data);
    };

    if (step === "success") {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center">
                <div className="max-w-md w-full text-center space-y-6 animate-in fade-in slide-in-from-bottom-5">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold">Candidature Reçue !</h1>
                    <p className="text-muted-foreground">
                        Merci pour votre engagement. Notre comité technique va examiner votre dossier pour vérifier sa conformité avec les critères du SAYC.
                    </p>
                    <p className="text-sm bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100">
                        Vous recevrez un email dès que votre candidature sera validée pour la phase de campagne.
                    </p>
                    <div className="pt-4">
                        <Link href="/elections">
                            <Button variant="outline" className="w-full h-12 rounded-xl">
                                Retour à l'accueil des élections
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <SEOHead
                title="Déposer ma Candidature - SAYC Tchad"
                description="Postulez pour devenir membre du Comité National du SAYC Tchad."
                path="/elections/postuler"
            />
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-heading font-bold text-[#1e3a8a]">Formulaire de Candidature</h1>
                    <p className="text-muted-foreground">Rejoignez le leadership numérique du Tchad.</p>
                </div>

                <AlertCircle className="w-full h-auto p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-100 flex gap-3 items-start shrink-0">
                    <div className="text-xs">
                        <strong>Note importante :</strong> Comme nous n'hébergeons pas directement les fichiers lourds, veuillez héberger vos documents (CV, Lettre, Vidéo) sur **Google Drive, Dropbox ou YouTube** et fournir les liens de partage publics ci-dessous.
                    </div>
                </AlertCircle>

                <Card className="border-accent/10 shadow-xl">
                    <CardHeader className="bg-slate-50 border-b pb-6">
                        <CardTitle className="text-xl">Votre Dossier Numérique</CardTitle>
                        <CardDescription>Tous les champs sont obligatoires pour un dossier complet.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                
                                <div className="flex flex-col md:flex-row gap-8 items-center pb-6 border-b border-dashed">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-3xl border-2 border-accent/20 overflow-hidden bg-white flex items-center justify-center text-accent/30 shadow-inner">
                                            {photoPreview ? (
                                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Camera className="w-12 h-12" />
                                            )}
                                        </div>
                                        <Label
                                            htmlFor="photo-upload"
                                            className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:rotate-12 transition-transform"
                                        >
                                            <Upload className="w-5 h-5" />
                                        </Label>
                                        <Input
                                            id="photo-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoChange}
                                        />
                                    </div>
                                    <div className="space-y-1 text-center md:text-left">
                                        <h4 className="font-bold text-[#1e3a8a]">Photo Officielle</h4>
                                        <p className="text-xs text-muted-foreground max-w-xs">
                                            Cette photo sera affichée sur le bulletin de vote numérique. Utilisez une photo professionnelle.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Prénom</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Votre prénom" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nomSpecifiqueUnique"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nom de famille</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Votre nom" {...field} />
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
                                                <FormLabel>Email Professionnel</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="candidat@email.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Poste convoité</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Choisir un poste" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {postRoles.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="cvUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <LinkIcon className="w-4 h-4 text-accent" /> Lien vers votre CV (PDF) *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://drive.google.com/..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="motivationUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <LinkIcon className="w-4 h-4 text-accent" /> Lettre de motivation (Lien) *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://link-to-motivation.doc" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="videoUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <LinkIcon className="w-4 h-4 text-accent" /> Vidéo de présentation (YouTube/Drive) *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://youtube.com/..." {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="programUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <LinkIcon className="w-4 h-4 text-accent" /> Programme d'action (Lien) *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Votre vision en PDF" {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-dashed">
                                    <FormField
                                        control={form.control}
                                        name="linkedInUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Linkedin className="w-4 h-4 text-[#0a66c2]" /> LinkedIn
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Lien profil" {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="facebookUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Facebook className="w-4 h-4 text-[#1877f2]" /> Facebook
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Lien profil" {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="twitterUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Twitter className="w-4 h-4 text-[#1da1f2]" /> X (Twitter)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Lien profil" {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="pt-6 border-t font-medium text-sm text-muted-foreground italic">
                                    En soumettant ce formulaire, je certifie être membre du SAYC Tchad et accepte que mes informations soient publiées si ma candidature est retenue.
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 text-lg font-bold bg-[#1e3a8a] hover:bg-[#1e40af] rounded-2xl shadow-lg shadow-blue-900/10"
                                    disabled={applicationMutation.isPending}
                                >
                                    {applicationMutation.isPending ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Soumission...</>
                                    ) : (
                                        "Soumettre ma Candidature"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Bloc aide / contact */}
                <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                    <div className="flex-1 text-center sm:text-left">
                        <p className="font-semibold text-[#1e3a8a] text-base">
                            🆘 Vous avez un souci pour postuler ?
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Notre équipe est disponible pour vous aider à compléter votre dossier ou résoudre un problème technique.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                        <a
                            href="mailto:sayctchad@gmail.com?subject=Aide%20Candidature%20Élections"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1e3a8a] text-white text-sm font-semibold hover:bg-[#1e40af] transition-colors"
                        >
                            ✉️ Écrire par email
                        </a>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-[#1e3a8a] text-[#1e3a8a] text-sm font-semibold hover:bg-blue-100 transition-colors"
                        >
                            📬 Formulaire de contact
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
