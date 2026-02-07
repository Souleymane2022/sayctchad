import { useState, useMemo } from "react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertMemberSchema, type InsertMember } from "@shared/schema";
import { z } from "zod";
import { 
  Users, 
  CheckCircle2,
  GraduationCap,
  Rocket,
  Globe,
  Heart,
  Send
} from "lucide-react";

const benefits = [
  {
    icon: GraduationCap,
    title: "Formations gratuites",
    description: "Accès à tous nos programmes de formation en compétences numériques.",
  },
  {
    icon: Rocket,
    title: "Mentorat personnalisé",
    description: "Accompagnement par des experts du secteur technologique.",
  },
  {
    icon: Globe,
    title: "Réseau continental",
    description: "Connexion avec les chapitres Smart Africa à travers l'Afrique.",
  },
  {
    icon: Heart,
    title: "Communauté engagée",
    description: "Rejoignez une communauté de jeunes passionnés par l'innovation.",
  },
];

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

const interestOptions = [
  "Développement Web",
  "Développement Mobile",
  "Data Science",
  "Intelligence Artificielle",
  "Cybersécurité",
  "Cloud Computing",
  "Entrepreneuriat",
  "Design UI/UX",
];

const extendedMemberSchema = insertMemberSchema.extend({
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions d'utilisation" }),
  }),
});

type ExtendedMemberForm = z.infer<typeof extendedMemberSchema>;

export default function Join() {
  const { toast } = useToast();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const form = useForm<ExtendedMemberForm>({
    resolver: zodResolver(extendedMemberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      ageRange: "",
      city: "",
      education: "",
      occupation: "",
      interests: [],
      motivation: "",
      acceptTerms: false as unknown as true,
    },
  });

  const memberMutation = useMutation({
    mutationFn: async (data: InsertMember) => {
      const response = await apiRequest("POST", "/api/members", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Inscription réussie!",
        description: "Bienvenue au SAYC Tchad! Vous recevrez un email de confirmation.",
      });
      form.reset();
      setSelectedInterests([]);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const handleInterestToggle = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(newInterests);
    form.setValue("interests", newInterests);
  };

  const onSubmit = (data: ExtendedMemberForm) => {
    memberMutation.mutate({ ...data, interests: selectedInterests });
  };

  const webPageJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Rejoindre SAYC Tchad",
    description: "Rejoignez le SAYC Tchad et bénéficiez de formations gratuites, mentorat et opportunités pour les jeunes de 15 à 35 ans.",
    url: `${window.location.origin}/rejoindre`,
    isPartOf: { "@type": "WebSite", name: "SAYC Tchad", url: window.location.origin },
  }), []);

  return (
    <div className="flex flex-col">
      <SEOHead
        title="Rejoindre SAYC Tchad | Adhésion Jeunesse 15-35 ans"
        description="Rejoignez le SAYC Tchad et bénéficiez de formations gratuites en compétences numériques, mentorat personnalisé et connexion au réseau continental Smart Africa. Ouvert aux jeunes de 15 à 35 ans."
        path="/rejoindre"
        jsonLd={webPageJsonLd}
      />
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary/10 to-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-6" data-testid="badge-join-header">
              <Users className="w-3 h-3 mr-1" />
              Devenir Membre
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-join-title">
              Rejoignez le{" "}
              <span className="text-primary">SAYC Tchad</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-join-description">
              Faites partie d'une communauté de jeunes Tchadiens engagés pour la transformation 
              numérique de l'Afrique. L'adhésion est gratuite et ouverte aux jeunes de 15 à 35 ans.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-none shadow-sm" data-testid={`card-benefit-${index}`}>
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="font-heading text-base">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <Card data-testid="card-join-form">
              <CardHeader className="text-center">
                <CardTitle className="font-heading text-2xl">Formulaire d'adhésion</CardTitle>
                <CardDescription>
                  Remplissez le formulaire pour devenir membre du SAYC Tchad.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Votre prénom" 
                                {...field} 
                                data-testid="input-join-first-name"
                              />
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
                            <FormLabel>Nom *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Votre nom" 
                                {...field} 
                                data-testid="input-join-last-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="votre@email.com" 
                                {...field} 
                                data-testid="input-join-email"
                              />
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
                            <FormLabel>Téléphone *</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel"
                                placeholder="+235 66 00 00 00" 
                                {...field} 
                                data-testid="input-join-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ageRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tranche d'âge *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-age-range">
                                  <SelectValue placeholder="Sélectionnez" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ageRanges.map((range) => (
                                  <SelectItem key={range.value} value={range.value}>
                                    {range.label}
                                  </SelectItem>
                                ))}
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
                            <FormLabel>Ville *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="N'Djamena" 
                                {...field} 
                                data-testid="input-join-city"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="education"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Niveau d'études *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-education">
                                  <SelectValue placeholder="Sélectionnez" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {educationLevels.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
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
                            <FormLabel>Profession/Occupation</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Étudiant, Développeur..." 
                                {...field} 
                                value={field.value || ""}
                                data-testid="input-join-occupation"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-3">
                      <FormLabel>Centres d'intérêt</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {interestOptions.map((interest) => (
                          <Badge
                            key={interest}
                            variant={selectedInterests.includes(interest) ? "default" : "outline"}
                            className="cursor-pointer toggle-elevate"
                            onClick={() => handleInterestToggle(interest)}
                            data-testid={`badge-interest-${interest.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            {selectedInterests.includes(interest) && (
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                            )}
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="motivation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pourquoi souhaitez-vous rejoindre le SAYC?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Décrivez votre motivation..."
                              rows={4}
                              className="resize-none"
                              {...field}
                              value={field.value || ""}
                              data-testid="textarea-motivation"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-terms"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              J'accepte les conditions d'utilisation et la politique de confidentialité du SAYC Tchad. *
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={memberMutation.isPending}
                      data-testid="button-submit-join"
                    >
                      {memberMutation.isPending ? (
                        "Inscription en cours..."
                      ) : (
                        <>
                          S'inscrire au SAYC Tchad
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
