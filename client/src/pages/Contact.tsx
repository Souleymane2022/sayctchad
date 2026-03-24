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
import { useTranslation } from "react-i18next";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import {
  Mail,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  Users,
  Briefcase,
  FileText,
  ExternalLink
} from "lucide-react";
import { SiFacebook, SiLinkedin } from "react-icons/si";

export default function Contact() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.info.location.title'),
      content: t('contact.info.location.content'),
      detail: t('contact.info.location.detail'),
    },
    {
      icon: MessageSquare,
      title: t('contact.info.focal.title'),
      content: t('contact.info.focal.content'),
      detail: t('contact.info.focal.detail'),
    },
    {
      icon: Mail,
      title: t('contact.info.email.title'),
      content: "contact@sayctchad.org",
      detail: t('contact.info.email.detail'),
    },
    {
      icon: Send,
      title: t('contact.info.phone.title'),
      content: "+235 66 16 17 53",
      detail: t('contact.info.phone.detail'),
    },
    {
      icon: Clock,
      title: t('contact.info.hours.title'),
      content: t('contact.info.hours.content'),
      detail: t('contact.info.hours.detail'),
    },
  ];

  const socialLinks = [
    { icon: SiFacebook, href: "https://www.facebook.com/profile.php?id=61585729201040", label: "Facebook" },
    { icon: SiLinkedin, href: "https://www.linkedin.com/company/110439974/", label: "LinkedIn" },
  ];

  const subjects = [
    { value: "general", label: t('contact.subjects.general') },
    { value: "membership", label: t('contact.subjects.membership') },
    { value: "training", label: t('contact.subjects.training') },
    { value: "partnership", label: t('contact.subjects.partnership') },
    { value: "media", label: t('contact.subjects.media') },
    { value: "other", label: t('contact.subjects.other') },
  ];

  const form = useForm<any>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      firstName: "",
      nomSpecifiqueUnique: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await (apiRequest as any)("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('contact.form.success_title'),
        description: t('contact.form.success_desc'),
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: t('contact.form.error_title'),
        description: t('contact.form.error_desc'),
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
    name: t('contact.seo.title'),
    description: t('contact.seo.description'),
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
        telephone: "+23566161753",
        availableLanguage: ["fr", "ar", "en"],
      },
    },
  }), [t]);

  return (
    <div className="flex flex-col">
      <SEOHead
        title={t('contact.seo.title')}
        description={t('contact.seo.description')}
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
              {t('contact.hero.badge')}
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-contact-title" dangerouslySetInnerHTML={{ __html: t('contact.hero.title') }} />
            <p className="text-lg text-sidebar-foreground/80 leading-relaxed" data-testid="text-contact-description">
              {t('contact.hero.description')}
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
                  <CardTitle className="font-heading text-2xl">{t('contact.form.title')}</CardTitle>
                  <CardDescription>
                    {t('contact.form.description')}
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
                            <FormLabel>{t('contact.form.first_name')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('contact.form.first_name_placeholder')}
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
                          name="nomSpecifiqueUnique"
                          render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('contact.form.last_name')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('contact.form.last_name_placeholder')}
                                {...field}
                                value={field.value || ""}
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
                            <FormLabel>{t('contact.form.email')}</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder={t('contact.form.email_placeholder')}
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
                            <FormLabel>{t('contact.form.phone')}</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder={t('contact.form.phone_placeholder')}
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
                            <FormLabel>{t('contact.form.subject')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-subject">
                                  <SelectValue placeholder={t('contact.form.subject_placeholder')} />
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
                            <FormLabel>{t('contact.form.message')}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t('contact.form.message_placeholder')}
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
                          t('contact.form.submitting')
                        ) : (
                          <>
                            {t('contact.form.submit')}
                            <Send className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
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
                  <CardTitle className="font-heading text-xl">{t('contact.info.title')}</CardTitle>
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
                  <CardTitle className="font-heading text-xl">{t('contact.social.title')}</CardTitle>
                  <CardDescription>
                    {t('contact.social.description')}
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
                  <CardTitle className="font-heading text-xl">{t('contact.quick_actions.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="/rejoindre" className="flex items-center gap-3 p-3 rounded-lg bg-primary-foreground/10 hover-elevate transition-colors">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">{t('contact.quick_actions.membership')}</span>
                  </a>
                  <a href="/contact" className="flex items-center gap-3 p-3 rounded-lg bg-primary-foreground/10 hover-elevate transition-colors">
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">{t('contact.quick_actions.partnership')}</span>
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
