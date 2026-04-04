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
        <div className="container mx-auto px-4 py-20 flex flex-col items-center">
            <SEOHead
                title="Candidatures Closes - SAYC Tchad"
                description="La période de candidature pour le Comité National du SAYC Tchad est terminée."
                path="/elections/postuler"
            />
            <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-5">
                <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto rotate-3 shadow-lg">
                    <AlertCircle className="w-14 h-14" />
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-[#1e3a8a]">
                        Candidatures Closes
                    </h1>
                    <div className="h-1.5 w-24 bg-[#1e3a8a] mx-auto rounded-full" />
                </div>

                <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl space-y-6">
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Conformément au calendrier électoral, la période de réception des dossiers de candidature s'est achevée hier soir à minuit.
                    </p>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-800 text-sm font-medium">
                        🚀 La phase actuelle est : <strong>Filtrage & Validation des dossiers</strong> par le comité technique.
                    </div>
                    <p className="text-sm text-slate-400 italic">
                        Merci aux nombreux candidats pour leur engagement envers le futur numérique du Tchad.
                    </p>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/elections">
                        <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-2 hover:bg-slate-50 font-bold">
                            Retour aux Élections
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button size="lg" className="h-14 px-8 rounded-2xl bg-[#1e3a8a] hover:bg-[#1e40af] font-bold shadow-lg shadow-blue-900/10">
                            Retour à l'accueil
                        </Button>
                    </Link>
                </div>

                {/* Contact support */}
                <p className="text-xs text-slate-400 pt-8">
                    Un problème ? Contactez-nous à <a href="mailto:sayctchad@gmail.com" className="text-blue-500 hover:underline">sayctchad@gmail.com</a>
                </p>
            </div>
        </div>
    );
}
