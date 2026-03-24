import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertMemberSchema, type InsertMember } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Search,
  Users2,
  Calendar,
  Globe
} from "lucide-react";

export default function Join() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

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
    onSuccess: () => {
      setIsSuccess(true);
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

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-xl w-full text-center p-8 border-2 border-sayc-teal/20">
          <div className="w-20 h-20 bg-sayc-teal/10 text-sayc-teal rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-4">{t('join.success.title')}</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            {t('join.success.description')}
          </p>
          <Link href="/">
            <Button className="w-full sm:w-auto px-8 py-6 text-lg">
              {t('common.back_home')}
            </Button>
          </Link>
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

      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar to-sidebar/95 text-sidebar-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-accent/20 rounded-full" />
          <div className="absolute bottom-16 left-16 w-24 h-24 border-2 border-sayc-teal/20 rounded-full" />
        </div>
        <div className="container mx-auto px-4 relative">
          <Badge className="mb-6 bg-accent/20 text-accent border-accent/30 hover:bg-accent/30">
            <Users className="w-4 h-4 mr-2" />
            {t('join.hero.badge')}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 tracking-tight">
             {t('join.hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-sidebar-foreground/80 max-w-2xl leading-relaxed">
            {t('join.hero.description')}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
               <div className="grid sm:grid-cols-2 gap-6">
                 <Card className="border-l-4 border-l-sayc-teal">
                   <CardHeader className="pb-2">
                     <Users2 className="w-6 h-6 text-sayc-teal mb-2" />
                     <CardTitle className="text-lg">{t('about.pillars.engagement.title')}</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-muted-foreground">{t('about.pillars.engagement.desc')}</p>
                   </CardContent>
                 </Card>
                 <Card className="border-l-4 border-l-sayc-orange">
                   <CardHeader className="pb-2">
                     <Zap className="w-6 h-6 text-sayc-orange mb-2" />
                     <CardTitle className="text-lg">{t('about.pillars.skills.title')}</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-muted-foreground">{t('about.pillars.skills.desc')}</p>
                   </CardContent>
                 </Card>
               </div>
               
               <Card className="bg-muted/30 border-none shadow-none p-6">
                 <h3 className="font-heading font-bold text-xl mb-4 flex items-center gap-2">
                   <Globe className="w-5 h-5 text-sayc-teal" />
                   {t('home.initiatives.alliance.title')}
                 </h3>
                 <p className="text-muted-foreground leading-relaxed">
                   {t('home.initiatives.alliance.desc')}
                 </p>
               </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-heading">{t('join.form.title')}</CardTitle>
                <CardDescription>{t('join.form.description')}</CardDescription>
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

                    <div className="grid sm:grid-cols-2 gap-4">
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

                    <div className="grid sm:grid-cols-2 gap-4">
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
                              <FormLabel>{t('contact.form.city', "Ville *")}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('contact.form.city_placeholder', "Votre ville")} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>

                    <FormField
                      control={form.control}
                      name="motivation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pourquoi nous rejoindre ? *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Dites-nous ce qui vous motive..." 
                              className="min-h-[100px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                      <Button 
                        type="submit" 
                        className="w-full h-12 text-lg font-bold" 
                        disabled={registrationMutation.isPending}
                      >
                        {registrationMutation.isPending ? t('join.form.submitting', "Adhésion en cours...") : t('join.form.submit', "Confirmer mon adhésion")}
                        {!registrationMutation.isPending && <ArrowRight className="ml-2 h-5 w-5" />}
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
