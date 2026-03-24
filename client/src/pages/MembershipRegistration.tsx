import { useState, useMemo } from "react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { insertMemberSchema, type InsertMember } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { 
  UserPlus, 
  CheckCircle, 
  ArrowRight, 
  Info, 
  Award,
  ShieldCheck,
  Globe,
  Users
} from "lucide-react";

export default function MembershipRegistration() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredMember, setRegisteredMember] = useState<any>(null);

  const form = useForm<any>({
    resolver: zodResolver(insertMemberSchema),
    defaultValues: {
      firstName: "",
      nomSpecifiqueUnique: "",
      email: "",
      phone: "",
      ageRange: "",
      city: "",
      education: "",
      occupation: "",
      interests: [],
      motivation: "",
      acceptTerms: false,
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/members", data);
      return response.json();
    },
    onSuccess: (data) => {
      setIsSuccess(true);
      setRegisteredMember(data);
      toast({
        title: t('join.form.success_title'),
        description: t('join.form.success_desc'),
      });
      window.scrollTo(0, 0);
    },
    onError: (error: any) => {
      toast({
        title: t('join.form.error_title'),
        description: error.message || t('join.form.error_desc'),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertMember) => {
    registrationMutation.mutate(data);
  };

  const ageRanges = [
    { value: "15-24", label: "15-24 ans" },
    { value: "25-30", label: "25-30 ans" },
    { value: "31-35", label: "31-35 ans" },
    { value: "35+", label: "Plus de 35 ans" },
  ];

  const interestOptions = [
    { id: "entrepreneurship", label: t('join.interests.entrepreneurship') },
    { id: "leadership", label: t('join.interests.leadership') },
    { id: "coding", label: t('join.interests.coding') },
    { id: "digital_marketing", label: t('join.interests.digital_marketing') },
    { id: "agriculture_tech", label: t('join.interests.agriculture_tech') },
    { id: "education_tech", label: t('join.interests.education_tech') },
    { id: "climate_tech", label: t('join.interests.climate_tech') },
  ];

  if (isSuccess && registeredMember) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[70vh] flex items-center justify-center">
        <Card className="max-w-xl w-full text-center p-8 border-2 border-sayc-teal/20">
          <div className="w-20 h-20 bg-sayc-teal/10 text-sayc-teal rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-4">{t('join.success.title')}</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            {t('join.success.description')}
          </p>
          
          <div className="bg-muted/30 p-6 rounded-xl mb-8 text-left border border-border/50">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sayc-teal" />
              {t('join.success.info_title', "Vos informations d'adhésion")}
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">{t('contact.form.full_name', "Nom complet")}:</span> <span className="font-medium">{registeredMember.firstName} {registeredMember.nomSpecifiqueUnique}</span></p>
              <p><span className="text-muted-foreground">{t('join.success.member_id', "ID Membre")}:</span> <span className="font-mono bg-sayc-teal/10 px-2 py-0.5 rounded text-sayc-teal font-bold">{registeredMember.membershipId}</span></p>
              <p><span className="text-muted-foreground">{t('join.success.status', "Statut")}:</span> <span className="text-sayc-orange font-medium">{t('join.success.pending', "En attente de validation")}</span></p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link href="/">
              <Button className="w-full h-12 text-lg">
                {t('common.back_home')}
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('join.success.email_sent', "Un email de confirmation a été envoyé à {{email}}", { email: registeredMember.email })}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <SEOHead
        title={t('join.seo.title')}
        description={t('join.seo.description')}
        path="/rejoindre"
      />

      <section className="relative py-20 bg-gradient-to-br from-sidebar to-sidebar/95 text-sidebar-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-accent/20 rounded-full" />
          <div className="absolute bottom-16 left-16 w-24 h-24 border-2 border-sayc-teal/20 rounded-full" />
          <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] text-white/5" />
        </div>
        
        <div className="container mx-auto px-4 relative text-center">
          <Badge className="mb-6 bg-accent/20 text-accent border-accent/30 hover:bg-accent/30 py-1 px-4">
            <UserPlus className="w-4 h-4 mr-2" />
            {t('join.hero.badge')}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 tracking-tight">
            {t('join.hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-sidebar-foreground/80 max-w-2xl mx-auto leading-relaxed">
            {t('join.hero.description')}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-24 space-y-6">
                <Card className="border-l-4 border-l-sayc-teal">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <Award className="w-5 h-5 text-sayc-teal" />
                       {t('join.why.title', "Pourquoi nous rejoindre ?")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-sayc-teal/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-3 h-3 text-sayc-teal" />
                      </div>
                      <p className="text-sm">{t('join.why.sada', "Accès prioritaire aux formations SADA")}</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-sayc-teal/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-3 h-3 text-sayc-teal" />
                      </div>
                      <p className="text-sm">{t('join.why.network', "Réseautage avec la jeunesse africaine")}</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-sayc-teal/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-3 h-3 text-sayc-teal" />
                      </div>
                      <p className="text-sm">{t('join.why.events', "Participation aux événements Smart Africa")}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-sayc-teal text-white border-none overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {t('join.already_member.title', "Déjà membre ?")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    <p className="text-sm text-white/80">
                      {t('join.already_member.desc', "Si vous possédez déjà un identifiant de membre, vous pouvez vérifier votre statut ou mettre à jour votre profil.")}
                    </p>
                    <Link href="/verifier">
                      <Button variant="secondary" className="w-full bg-white text-sayc-teal hover:bg-white/90">
                        {t('join.already_member.button', "Vérifier mon statut")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-8">
              <Card className="shadow-xl shadow-sayc-teal/5">
                <CardHeader className="border-b bg-muted/10">
                  <CardTitle className="text-2xl font-heading">{t('join.form.title')}</CardTitle>
                  <CardDescription>{t('join.form.description')}</CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <div className="space-y-6">
                        <h3 className="font-heading text-lg font-bold flex items-center gap-2 border-b pb-2">
                          <span className="w-8 h-8 rounded-full bg-sayc-teal text-white flex items-center justify-center text-sm">1</span>
                          {t('join.form.personal_info', "Informations Personnelles")}
                        </h3>
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
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('contact.form.phone')}</FormLabel>
                                <FormControl>
                                  <Input placeholder={t('contact.form.phone_placeholder')} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="ageRange"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('contact.form.age_range', "Tranche d'âge *")}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t('contact.form.subject_placeholder')} />
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
                                <FormLabel>{t('contact.form.city', "Ville de résidence *")}</FormLabel>
                                <FormControl>
                                  <Input placeholder={t('contact.form.city_placeholder', "Ex: N'Djamena, Abéché...")} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="font-heading text-lg font-bold flex items-center gap-2 border-b pb-2">
                          <span className="w-8 h-8 rounded-full bg-sayc-teal text-white flex items-center justify-center text-sm">2</span>
                          Parcours & Intérêts
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="education"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Niveau d'études *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Votre dernier diplôme..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="occupation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Occupation actuelle</FormLabel>
                                <FormControl>
                                  <Input placeholder="Étudiant, Entrepreneur..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="interests"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel className="text-base">Domaines d'intérêt (Plusieurs choix possibles)</FormLabel>
                                <FormDescription>
                                  Sélectionnez les sujets qui vous passionnent le plus.
                                </FormDescription>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {interestOptions.map((item) => (
                                  <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="interests"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={item.id}
                                          className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(item.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, item.id])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value: string) => value !== item.id
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal cursor-pointer text-sm">
                                            {item.label}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="motivation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pourquoi voulez-vous rejoindre SAYC Tchad ? *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Décrivez brièvement vos motivations..." 
                                  className="min-h-[120px] resize-none"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4 pt-4 border-t">
                        <FormField
                          control={form.control}
                          name="acceptTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal">
                                  J'accepte la charte éthique de SAYC Tchad et je m'engage à participer activement aux initiatives du chapitre.
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full h-14 text-lg font-bold" 
                          disabled={registrationMutation.isPending}
                        >
                          {registrationMutation.isPending ? t('join.form.submitting', "Traitement en cours...") : t('join.form.submit', "Confirmer mon adhésion")}
                          {!registrationMutation.isPending && <ArrowRight className="ml-2 h-5 w-5" />}
                        </Button>
                        
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <Info className="w-3.5 h-3.5" />
                          <span>{t('join.form.privacy_notice', "Vos données personnelles sont protégées et traitées conformément à notre politique de confidentialité.")}</span>
                        </div>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          .container { max-width: 100% !important; padding: 0 !important; }
        }
      `}} />
    </div>
  );
}
