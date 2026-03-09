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
import { GraduationCap, Send, CheckCircle2, Info } from "lucide-react";

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
            hasOnlineExperience: false,
            experienceFields: [],
            motivation: "",
            expectations: "",
            communityImpact: "",
            readyForOnline: false,
            readyForCohort: false,
            projectIdea: "",
            discoverySource: "",
            consent: false,
            cohort: "Tchad 2024",
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
                description: "Merci pour votre engagement. Vous recevrez un e-mail de confirmation sous peu.",
            });
            form.reset();
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur",
                description: error.message || "Une erreur est survenue lors de l'envoi.",
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
                description="Rejoignez la cohorte Tchadienne de la Thunderbird School of Global Management. Postulez dès maintenant pour transformer votre avenir."
                path="/programmes/thunderbird"
            />

            <section className="py-20 bg-gradient-to-br from-sidebar to-sidebar/95 text-sidebar-foreground">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30 mb-6">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-sm font-medium">Programme Excellence</span>
                    </div>
                    <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
                        Thunderbird <span className="text-accent">Global Management</span>
                    </h1>
                    <p className="text-lg text-sidebar-foreground/80 max-w-2xl mx-auto leading-relaxed">
                        Intégrez la cohorte Tchadienne de l'initiative Najafi 100 Million Learners.
                        Une formation de classe mondiale pour les futurs leaders de la transformation numérique.
                    </p>
                </div>
            </section>

            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Card className="border-t-4 border-t-accent shadow-xl">
                        <CardHeader className="space-y-1 pb-8">
                            <CardTitle className="text-3xl font-heading">Formulaire de Candidature</CardTitle>
                            <CardDescription>
                                Veuillez remplir ce formulaire avec soin. Nous recherchons des profils hautement engagés pour cette cohorte d'excellence.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    {/* Section 1: Informations Personnelles */}
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                                            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                            Informations Personnelles
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="fullName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nom et Prénom</FormLabel>
                                                        <FormControl><Input placeholder="Ex: Souleymane Mahamat" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="gender"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Sexe</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Sélectionnez" />
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
                                                        <FormLabel>Date de naissance</FormLabel>
                                                        <FormControl><Input type="date" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Ville de résidence</FormLabel>
                                                        <FormControl><Input {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Numéro WhatsApp / Téléphone</FormLabel>
                                                        <FormControl><Input placeholder="+235 ..." {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Adresse Email</FormLabel>
                                                        <FormControl><Input type="email" placeholder="example@gmail.com" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Section 2: Profil académique */}
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                                            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                            Profil Académique & Professionnel
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="educationLevel"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Niveau d’étude</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Sélectionnez votre niveau" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Lycée">Lycée</SelectItem>
                                                                <SelectItem value="Licence">Licence</SelectItem>
                                                                <SelectItem value="Master">Master</SelectItem>
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
                                                name="fieldOfStudy"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Domaine d'étude ou profession</FormLabel>
                                                        <FormControl><Input placeholder="Ex: Informatique, Gestion..." {...field} value={field.value ?? ""} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="schoolOrUniversity"
                                                render={({ field }) => (
                                                    <FormItem className="md:col-span-2">
                                                        <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Section 3: Expérience */}
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                                            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                                            Expérience et Compétences
                                        </h3>
                                        <FormField
                                            control={form.control}
                                            name="hasOnlineExperience"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>Avez-vous déjà suivi une formation en ligne ?</FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="experienceFields"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Dans quels domaines avez-vous déjà une expérience ?</FormLabel>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                                                        {["Entrepreneuriat", "Technologie", "Leadership", "Gestion de projet"].map((item) => (
                                                            <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(item)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...(field.value || []), item])
                                                                                : field.onChange(field.value?.filter((value) => value !== item));
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">{item}</FormLabel>
                                                            </FormItem>
                                                        ))}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Section 4: Motivation (Exigent) */}
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                                            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                                            Motivation & Impact
                                        </h3>
                                        <FormField
                                            control={form.control}
                                            name="motivation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Pourquoi souhaitez-vous rejoindre cette cohorte au Tchad ?</FormLabel>
                                                    <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="expectations"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Qu’espérez-vous apprendre dans cette formation ?</FormLabel>
                                                    <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="communityImpact"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Comment pensez-vous utiliser ces connaissances dans votre communauté ?</FormLabel>
                                                    <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Section 5: Engagement */}
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                                            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                                            Engagement & Disponibilité
                                        </h3>
                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="readyForOnline"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-sayc-teal/5">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>Êtes-vous prêt à suivre les modules de formation en ligne jusqu’à la fin ?</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="readyForCohort"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-sayc-teal/5">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>Êtes-vous disponible pour participer aux sessions de cohorte (rencontres, mentorat) ?</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Section 6: Compléments */}
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                                            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                                            Informations Complémentaires
                                        </h3>
                                        <FormField
                                            control={form.control}
                                            name="projectIdea"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Avez-vous une idée de projet ou une initiative que vous souhaitez développer ? (Facultatif)</FormLabel>
                                                    <FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="discoverySource"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Section 7: Consentement */}
                                    <div className="space-y-6 pt-6">
                                        <FormField
                                            control={form.control}
                                            name="consent"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md bg-accent/5 p-4 border border-accent/20">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel className="text-sm font-medium leading-relaxed">
                                                            J’accepte que mes informations soient utilisées pour la gestion du programme de formation
                                                            organisé par Smart Africa et le Smart Africa Youth Chapter Tchad.
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
                                        className="w-full h-14 text-lg bg-accent hover:bg-accent/90 text-accent-foreground"
                                        disabled={mutation.isPending}
                                    >
                                        {mutation.isPending ? (
                                            "Envoi en cours..."
                                        ) : (
                                            <>
                                                Soumettre ma candidature
                                                <Send className="ml-2 h-5 w-5" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                        <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold mb-1">Processus de sélection</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Après soumission de votre formulaire, notre comité de sélection examinera votre dossier.
                                Les candidats retenus seront contactés par e-mail et WhatsApp pour la suite du programme.
                                Assurez-vous de fournir des coordonnées valides.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
