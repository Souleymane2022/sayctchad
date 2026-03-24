import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { insertCandidateSchema, type InsertCandidate } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Vote, 
    User, 
    FileText, 
    Video, 
    Link as LinkIcon, 
    CheckCircle, 
    ArrowRight,
    Info
} from "lucide-react";

export default function CandidateApplication() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [, setLocation] = useLocation();

    const form = useForm<any>({
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

    const candidateMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("POST", "/api/candidates", data);
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: t('candidate.form.success_title', "Candidature soumise"),
                description: t('candidate.form.success_desc', "Votre candidature a été enregistrée avec succès. Elle sera examinée par l'administration."),
            });
            setLocation("/elections");
        },
        onError: (error: Error) => {
            toast({
                title: t('candidate.form.error_title', "Erreur lors de la soumission"),
                description: error.message || t('candidate.form.error_desc', "Une erreur est survenue."),
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: InsertCandidate) => {
        candidateMutation.mutate(data);
    };

    const roles = [
        { value: "President", label: "Président" },
        { value: "Vice-President", label: "Vice-Président" },
        { value: "Secretary General", label: "Secrétaire Général" },
        { value: "Treasurer", label: "Trésorier" },
        { value: "Communication Officer", label: "Chargé de Communication" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <SEOHead
                title={t('candidate.seo.title')}
                description={t('candidate.seo.description')}
                path="/candidater"
            />
            
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-sidebar to-sidebar/95 text-sidebar-foreground overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-32 h-32 border-2 border-accent/20 rounded-full" />
                    <div className="absolute bottom-16 left-16 w-24 h-24 border-2 border-sayc-orange/20 rounded-full" />
                </div>
                <div className="container mx-auto px-4 relative text-center">
                    <Badge className="mb-6 bg-sayc-orange/20 text-sayc-orange border-sayc-orange/30">
                        <Vote className="w-4 h-4 mr-2" />
                        {t('candidate.hero.badge')}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight">
                        {t('candidate.hero.title')}
                    </h1>
                    <p className="text-lg md:text-xl text-sidebar-foreground/80 max-w-2xl mx-auto leading-relaxed">
                        {t('candidate.hero.description')}
                    </p>
                </div>
            </section>

            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Card className="shadow-xl">
                        <CardHeader className="bg-muted/10 border-b">
                            <CardTitle className="text-2xl font-heading">{t('candidate.form.title')}</CardTitle>
                            <CardDescription>{t('candidate.form.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('contact.form.first_name')}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={t('contact.form.first_name_placeholder')} {...field} />
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
                                                    <FormLabel>{t('contact.form.last_name')}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={t('contact.form.last_name_placeholder')} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('contact.form.email')}</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder={t('contact.form.email_placeholder')} {...field} />
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
                                                    <FormLabel>Poste visé *</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Choisir un poste..." />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {roles.map((role) => (
                                                                <SelectItem key={role.value} value={role.value}>
                                                                    {role.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-6 pt-4 border-t">
                                        <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-sayc-teal" />
                                            Documents & Médias
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="photoUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Lien Photo de Profil *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="URL de votre photo" {...field} />
                                                        </FormControl>
                                                        <FormDescription>Format carré recommandé.</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="cvUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Lien CV (PDF) *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="URL de votre CV" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="motivationUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Lien Lettre de Motivation *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="URL du document" {...field} />
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
                                                        <FormLabel>Lien Vidéo de Présentation</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Lien YouTube ou autre" {...field} />
                                                        </FormControl>
                                                        <FormDescription>Optionnel mais recommandé.</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-4 border-t">
                                        <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                                            <LinkIcon className="w-5 h-5 text-sayc-teal" />
                                            Réseaux Sociaux
                                        </h3>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="linkedInUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>LinkedIn</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Lien profil" {...field} />
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
                                                        <FormLabel>Facebook</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Lien profil" {...field} />
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
                                                        <FormLabel>X (Twitter)</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Lien profil" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <Button 
                                            type="submit" 
                                            className="w-full py-6 text-lg font-bold bg-sayc-teal hover:bg-sayc-teal/90"
                                            disabled={candidateMutation.isPending}
                                        >
                                            {candidateMutation.isPending ? t('common.submitting', "Soumission en cours...") : t('common.submit_application', "Soumettre ma Candidature")}
                                            {!candidateMutation.isPending && <ArrowRight className="ml-2 w-5 h-5 text-white" />}
                                        </Button>
                                        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                                            <Info className="w-3.5 h-3.5" />
                                            <span>En soumettant ce formulaire, vous certifiez l'exactitude des informations fournies.</span>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
