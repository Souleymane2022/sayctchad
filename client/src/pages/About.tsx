import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import type { Partner } from "@shared/schema";
import {
  ArrowRight,
  Target,
  Eye,
  Users,
  GraduationCap,
  Briefcase,
  Building2,
  Globe,
  Heart,
  ExternalLink,
  FileText,
  Rocket,
  CheckCircle,
  Link as LinkIcon
} from "lucide-react";

export default function About() {
  const { t } = useTranslation();

  const { data: partners = [], isLoading: loadingPartners } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
  });

  const webPageJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: t("about.seo.title"),
    description: t("about.seo.description"),
    url: "https://sayctchad.org/a-propos",
    mainEntity: {
      "@type": "Organization",
      name: "SAYC Tchad",
      alternateName: "Smart Africa Youth Chapter Tchad",
      url: "https://sayctchad.org",
      logo: "https://sayctchad.org/logo.png",
      description: t("about.mission_desc"),
      address: {
        "@type": "PostalAddress",
        addressLocality: "N'Djamena",
        addressCountry: "TD"
      }
    }
  }), [t]);

  return (
    <div className="flex flex-col">
      <SEOHead 
        title={t("about.seo.title")}
        description={t("about.seo.description")}
        path="/a-propos"
        jsonLd={webPageJsonLd}
      />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-sidebar text-sidebar-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-accent/20 rounded-full" />
          <div className="absolute bottom-16 left-16 w-24 h-24 border-2 border-sayc-teal/20 rounded-full" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge variant="secondary" className="mb-6 bg-accent/20 text-accent border-accent/30 pointer-events-none">
            {t("about.hero_tag")}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-8 tracking-tight max-w-4xl mx-auto leading-tight" data-testid="text-about-title">
            {t("about.hero_title")}
          </h1>
          <p className="text-lg md:text-xl text-sidebar-foreground/80 max-w-3xl mx-auto leading-relaxed" data-testid="text-about-description">
            {t("about.hero_subtitle")}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="space-y-8">
              <div className="inline-flex p-3 rounded-2xl bg-sayc-teal/10 text-sayc-teal">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-heading font-bold">{t("about.mission_title")}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("about.mission_desc")}
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-2xl text-sayc-teal">1M+</h4>
                  <p className="text-sm text-muted-foreground">{t('about.stats.youth_trained', "Jeunes formés d'ici 2030")}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-2xl text-sayc-orange">35+</h4>
                  <p className="text-sm text-muted-foreground">{t('about.stats.member_states', "États Membres Smart Africa")}</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-muted rounded-[2.5rem] overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-sayc-teal/20 to-sayc-orange/20 mix-blend-multiply opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center p-12">
                   <div className="text-center space-y-6">
                      <Eye className="w-16 h-16 text-sayc-orange mx-auto opacity-80" />
                      <h3 className="text-2xl font-heading font-bold">{t("about.vision_title")}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                         {t("about.vision_desc")}
                      </p>
                   </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Tchad Context */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-heading font-bold mb-6">{t("about.tchad_title")}</h2>
            <div className="h-1 bg-sayc-orange w-20 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
             <Card className="hover-elevate bg-background border-none shadow-sm">
               <CardHeader>
                 <Users className="w-10 h-10 text-sayc-teal mb-2" />
                 <CardTitle className="text-xl">{t('about.values.inclusion.title')}</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground">{t('about.values.inclusion.desc')}</p>
               </CardContent>
             </Card>
             <Card className="hover-elevate bg-background border-none shadow-sm">
               <CardHeader>
                 <GraduationCap className="w-10 h-10 text-sayc-orange mb-2" />
                 <CardTitle className="text-xl">{t('about.values.excellence.title')}</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground">{t('about.values.excellence.desc')}</p>
               </CardContent>
             </Card>
             <Card className="hover-elevate bg-background border-none shadow-sm">
               <CardHeader>
                 <Rocket className="w-10 h-10 text-sayc-teal mb-2" />
                 <CardTitle className="text-xl">{t('about.values.engagement.title')}</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground">{t('about.values.engagement.desc')}</p>
               </CardContent>
             </Card>
          </div>
        </div>
      </section>

      {/* Resources & Documents */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-heading font-bold">{t("about.resources_title", "Documents & Ressources")}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.resources_desc', "Retrouvez ici les documents officiels présentant la vision et les objectifs de SAYC Tchad.")}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="hover-elevate transition-all border-l-4 border-l-sayc-teal">
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <FileText className="w-8 h-8 text-sayc-teal shrink-0" />
                    <div>
                        <CardTitle className="text-base mb-1">{t('about.resources.concept_note', "Concept Note")}</CardTitle>
                        <a 
                          href="/docs/SAYC_Tchad_Concept_Note.pdf" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                        >
                           {t('about.resources.open_pdf', "Ouvrir le PDF")} <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                  </CardHeader>
                </Card>
                <Card className="hover-elevate transition-all border-l-4 border-l-sayc-orange">
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <Briefcase className="w-8 h-8 text-sayc-orange shrink-0" />
                    <div>
                      <CardTitle className="text-base mb-1">Présentation</CardTitle>
                      <a 
                        href="/docs/SAYC_Tchad_Presentation.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                      >
                         Ouvrir le PDF <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
            
            <div className="space-y-6">
               <Card className="bg-primary text-primary-foreground border-none shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full" />
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <LinkIcon className="w-5 h-5" />
                        Smart Africa Blueprints
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                       <p className="text-sm text-primary-foreground/80">
                          {t('about.resources.blueprints_desc', "Découvrez les guides stratégiques (Blueprints) de Smart Africa sur l'identité numérique, l'IA et plus encore.")}
                       </p>
                       <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90" asChild>
                          <a href="https://smartafrica.org/blueprint/" target="_blank" rel="noopener noreferrer">
                             {t('about.resources.explorer_blueprints', "Explorer les Blueprints")} <ExternalLink className="ml-2 w-4 h-4" />
                          </a>
                       </Button>
                  </CardContent>
               </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold">{t("about.partners_title")}</h2>
          </div>
          
          {loadingPartners ? (
            <div className="flex justify-center gap-8">
               <Skeleton className="w-32 h-16" />
               <Skeleton className="w-32 h-16" />
               <Skeleton className="w-32 h-16" />
            </div>
          ) : (
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
               {partners.filter(p => p.isActive).map(partner => (
                 <a key={partner.id} href={partner.websiteUrl || "#"} target="_blank" rel="noopener noreferrer" title={partner.name}>
                    <img src={partner.logoUrl || ""} alt={partner.name} className="h-12 md:h-16 w-auto object-contain" />
                 </a>
               ))}
               {!partners.some(p => p.isActive) && (
                 <div className="flex items-center gap-12 grayscale opacity-50">
                    <div className="h-12 md:h-16 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-12 md:h-16 w-40 bg-muted rounded animate-pulse" />
                    <div className="h-12 md:h-16 w-32 bg-muted rounded animate-pulse" />
                 </div>
               )}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-8">{t('about.cta_title', "Prêt à transformer l'Afrique ?")}</h2>
            <div className="flex flex-wrap justify-center gap-4">
               <Link href="/rejoindre">
                  <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold bg-white text-primary hover:bg-white/90">
                     {t('home.become_member')}
                  </Button>
               </Link>
               <Link href="/contact">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold border-2 border-white/20 text-white hover:bg-white/10">
                     {t('common.contact_us')}
                  </Button>
               </Link>
            </div>
        </div>
      </section>
    </div>
  );
}
