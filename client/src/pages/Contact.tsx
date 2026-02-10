import { useMemo } from "react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { 
  Mail, 
  MapPin, 
  Send,
  Clock,
  MessageSquare,
  Users,
  Briefcase
} from "lucide-react";
import { SiFacebook, SiLinkedin } from "react-icons/si";

const contactInfo = [
  {
    icon: MapPin,
    title: "Localisation",
    content: "N'Djamena, Tchad",
    detail: "Siège du chapitre national",
  },
  {
    icon: MessageSquare,
    title: "Point Focal",
    content: "Souleymane Mahamat Saleh",
    detail: "Point Focal National SAYC Tchad",
  },
  {
    icon: Mail,
    title: "Formulaire de contact",
    content: "Utilisez le formulaire ci-contre",
    detail: "Réponse sous 48h ouvrables",
  },
  {
    icon: Clock,
    title: "Horaires",
    content: "Lun-Ven: 8h-17h",
    detail: "Heure de N'Djamena (UTC+1)",
  },
];

const socialLinks = [
  { icon: SiFacebook, href: "https://www.facebook.com/profile.php?id=61585729201040", label: "Facebook" },
  { icon: SiLinkedin, href: "https://www.linkedin.com/company/110439974/", label: "LinkedIn" },
];

const subjects = [
  { value: "general", label: "Question générale" },
  { value: "membership", label: "Adhésion au SAYC" },
  { value: "training", label: "Formations & Programmes" },
  { value: "partnership", label: "Partenariat" },
  { value: "media", label: "Presse & Médias" },
  { value: "other", label: "Autre" },
];

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message envoyé!",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    contactMutation.mutate(data);
  };

  const webPageJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact SAYC Tchad",
    description: "Contactez le SAYC Tchad pour toute question, partenariat ou demande d'information.",
    url: "https://sayctchad.org/contact",
    isPartOf: { "@type": "WebSite", name: "SAYC Tchad", url: "https://sayctchad.org" },
    mainEntity: {
      "@type": "Organization",
      name: "SAYC Tchad",
      address: {
        "@type": "PostalAddress",
        addressLocality: "N'Djamena",
        addressCountry: "TD",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Point Focal National",
        name: "Souleymane Mahamat Saleh",
        availableLanguage: ["fr", "ar"],
      },
    },
  }), []);

  return (
    <div className="flex flex-col">
      <SEOHead
        title="Contact SAYC Tchad | Nous Joindre"
        description="Contactez le SAYC Tchad pour toute question sur nos programmes, partenariats ou adhésion. Basé à N'Djamena, Tchad."
        path="/contact"
        jsonLd={webPageJsonLd}
      />
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar to-sidebar/95 text-sidebar-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-28 h-28 border-2 border-accent/30 rounded-full" />
          <div className="absolute bottom-16 left-16 w-20 h-20 border-2 border-sayc-teal/30 rounded-full" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-6 bg-accent/20 text-accent border-accent/30" data-testid="badge-contact-header">
              <MessageSquare className="w-3 h-3 mr-1" />
              Contact
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-contact-title">
              Entrons en{" "}
              <span className="text-accent">contact</span>
            </h1>
            <p className="text-lg text-sidebar-foreground/80 leading-relaxed" data-testid="text-contact-description">
              Une question, une suggestion ou envie de collaborer? 
              N'hesitez pas a nous contacter. Notre equipe est la pour vous accompagner.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <Card data-testid="card-contact-form">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Envoyez-nous un message</CardTitle>
                  <CardDescription>
                    Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
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
                                  data-testid="input-first-name"
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
                                  data-testid="input-last-name"
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
                                  data-testid="input-email"
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
                              <FormLabel>Téléphone</FormLabel>
                              <FormControl>
                                <Input 
                                  type="tel"
                                  placeholder="+235 66 00 00 00" 
                                  {...field} 
                                  value={field.value || ""}
                                  data-testid="input-phone"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sujet *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-subject">
                                  <SelectValue placeholder="Sélectionnez un sujet" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subjects.map((subject) => (
                                  <SelectItem key={subject.value} value={subject.value}>
                                    {subject.label}
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
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Votre message..."
                                rows={6}
                                className="resize-none"
                                {...field}
                                data-testid="textarea-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full sm:w-auto"
                        disabled={contactMutation.isPending}
                        data-testid="button-submit-contact"
                      >
                        {contactMutation.isPending ? (
                          "Envoi en cours..."
                        ) : (
                          <>
                            Envoyer le message
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card data-testid="card-contact-info">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Informations de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4" data-testid={`contact-info-${index}`}>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <info.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{info.title}</h4>
                        <p className="text-foreground">{info.content}</p>
                        <p className="text-xs text-muted-foreground">{info.detail}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card data-testid="card-social-links">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Suivez-nous</CardTitle>
                  <CardDescription>
                    Restez connecté avec le SAYC Tchad sur les réseaux sociaux.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover-elevate transition-colors"
                        aria-label={social.label}
                        data-testid={`link-social-${social.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground" data-testid="card-quick-actions">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="/rejoindre" className="flex items-center gap-3 p-3 rounded-lg bg-primary-foreground/10 hover-elevate transition-colors">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Devenir membre</span>
                  </a>
                  <a href="/partenaires" className="flex items-center gap-3 p-3 rounded-lg bg-primary-foreground/10 hover-elevate transition-colors">
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">Devenir partenaire</span>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
