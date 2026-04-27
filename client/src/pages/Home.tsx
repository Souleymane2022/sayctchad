import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { SiWhatsapp } from "react-icons/si";
import SEOHead from "@/components/SEOHead";
import type { Opportunity, Achievement, Partner, Training, NewsArticle } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Users,
  Lightbulb,
  Handshake,
  GraduationCap,
  Rocket,
  ChevronRight,
  Globe,
  Target,
  Zap,
  Eye,
  ExternalLink,
  Briefcase,
  Building2,
  TrendingUp,
  BookOpen,
  Award,
  Link as LinkIcon,
  Calendar
} from "lucide-react";

import galleryImg1 from "@assets/UniPod_Mamou_J3_95_1770104422778.JPG";
import galleryImg2 from "@assets/UniPod_Mamou_J2_70_1770104422781.JPG";
import galleryImg3 from "@assets/UniPod_Mamou_J2_21_1770104422785.JPG";
import galleryImg4 from "@assets/604667985_122096798505190973_8462039452349924014_n_1770104422797.jpg";

// Images assets imports kept at top level

function PixelGrid({ className = "", variant = "hero" }: { className?: string; variant?: "hero" | "section" | "small" }) {
  if (variant === "small") {
    return (
      <div className={`grid grid-cols-3 gap-1 ${className}`}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-sm ${i % 3 === 0 ? "bg-primary" : i % 3 === 1 ? "bg-accent" : "bg-sayc-teal"} ${i % 2 === 0 ? "opacity-100" : "opacity-60"}`}
          />
        ))}
      </div>
    );
  }

  if (variant === "section") {
    const opacities = [1, 0.8, 1, 0.6, 0.8, 1, 0.4, 1, 1, 0.6, 0.8, 1, 0.4, 1, 0.8, 1];
    return (
      <div className={`grid grid-cols-4 gap-1.5 ${className}`}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-sm ${i % 4 === 0 ? "bg-primary" : i % 4 === 1 ? "bg-accent" : i % 4 === 2 ? "bg-sayc-teal" : "bg-primary/50"}`}
            style={{ opacity: opacities[i] }}
          />
        ))}
      </div>
    );
  }

  const heroOpacities = [0.8, 0.6, 0.9, 0.4, 0.7, 0.5, 0.8, 0.3, 0.9, 0.6, 0.7, 0.4, 0.8, 0.5, 0.9, 0.3, 0.6, 0.8, 0.4, 0.7, 0.9, 0.5, 0.8, 0.6, 0.4];

  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-sm ${i % 5 === 0 ? "bg-primary" : i % 5 === 1 ? "bg-accent" : i % 5 === 2 ? "bg-sayc-teal" : i % 5 === 3 ? "bg-primary/60" : "bg-accent/50"}`}
            style={{ opacity: heroOpacities[i] }}
          />
        ))}
      </div>
    </div>
  );
}


export default function Home() {
  const { t } = useTranslation();
  
  // Helper to ensure we always get a string for SEO/Props
  // Helper to ensure we always get a real string, not an i18n key (containing dots)
  const v = (res: any, fallback: string) => {
    if (typeof res !== "string") return fallback;
    if (res.includes(".") || res === "common.home") return fallback;
    return res;
  };

  const objectives = useMemo(() => [
    {
      icon: Users,
      title: t("home.objectives.leadership.title"),
      description: t("home.objectives.leadership.desc"),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Lightbulb,
      title: t("home.objectives.innovation.title"),
      description: t("home.objectives.innovation.desc"),
      color: "bg-accent/10 text-accent",
    },
    {
      icon: Handshake,
      title: t("home.objectives.collaboration.title"),
      description: t("home.objectives.collaboration.desc"),
      color: "bg-sayc-teal/10 text-sayc-teal",
    },
  ], [t]);

  const activities = useMemo(() => [
    {
      icon: GraduationCap,
      title: t("home.activities.skills.title"),
      description: t("home.activities.skills.desc"),
    },
    {
      icon: Users,
      title: t("home.activities.mentorship.title"),
      description: t("home.activities.mentorship.desc"),
    },
    {
      icon: Rocket,
      title: t("home.activities.hackathons.title"),
      description: t("home.activities.hackathons.desc"),
    },
    {
      icon: Globe,
      title: t("home.activities.networking.title"),
      description: t("home.activities.networking.desc"),
    },
    {
      icon: BookOpen,
      title: t("home.activities.resources.title"),
      description: t("home.activities.resources.desc"),
    },
    {
      icon: Award,
      title: t("home.activities.showcase.title"),
      description: t("home.activities.showcase.desc"),
    },
  ], [t]);

  const smartAfricaInitiatives = useMemo(() => [
    {
      title: t("home.initiatives.alliance.title"),
      description: t("home.initiatives.alliance.desc"),
      link: "https://smartafrica.org/fr/page-daccueil/",
      icon: Globe,
    },
    {
      title: t("home.initiatives.sada.title"),
      description: t("home.initiatives.sada.desc"),
      link: "https://sada.smart.africa",
      icon: GraduationCap,
    },
    {
      title: t("home.initiatives.tas.title"),
      description: t("home.initiatives.tas.desc"),
      link: "https://transformafricasummit.org",
      icon: Rocket,
    },
  ], [t]);
  
  const { data: opportunities = [] } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities"],
  });

  const { data: achievementsList = [], isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: partnersList = [] } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
  });

  const { data: trainingsList = [] } = useQuery<Training[]>({
    queryKey: ["/api/trainings"],
  });

  const galleryImages = useMemo(() => [
    { src: galleryImg1, alt: t("home.gallery.img1") },
    { src: galleryImg2, alt: t("home.gallery.img2") },
    { src: galleryImg3, alt: t("home.gallery.img3") },
    { src: galleryImg4, alt: t("home.gallery.img4") },
  ], [t]);

  const { data: newsList = [] } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
  });

  const latestOpportunities = opportunities.slice(0, 3);
  const latestTrainings = trainingsList.slice(0, 3);

  const organizationJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SAYC Tchad - Smart Africa Youth Chapter",
    description: v(t("home.seo_desc"), "Smart Africa Youth Chapter Tchad"),
    url: "https://sayctchad.org",
    logo: "https://sayctchad.org/favicon.png",
    parentOrganization: {
      "@type": "Organization",
      name: "Smart Africa Alliance",
      url: "https://smartafrica.org",
    },
    founder: {
      "@type": "Person",
      "name": "Souleymane Mahamat Saleh",
      "jobTitle": v(t("about.focal_point_title"), "Point Focal National"),
      "sameAs": [
        "https://www.linkedin.com/company/110439974/"
      ]
    },
    contactPoint: {
      "@type": "ContactPoint",
      "contactType": v(t("about.focal_point_title"), "Point Focal National"),
      "name": "Souleymane Mahamat Saleh",
      "telephone": "+23566161753",
      "availableLanguage": ["fr", "ar", "en"]
    },
    address: {
      "@type": "PostalAddress",
      "addressLocality": "N'Djamena",
      "addressCountry": "TD",
    },
  }), [t]);

  return (
    <div className="flex flex-col">
      <SEOHead
        title={`${v(t("common.home", "Accueil"), "Accueil")} - SAYC Tchad` as any}
        description={v(t("home.seo_desc", "Smart Africa Youth Chapter Tchad"), "Smart Africa Youth Chapter Tchad - 7ème chapitre jeunesse de Smart Africa dédié aux jeunes de 15 à 35 ans pour l'éducation, la collaboration et l'innovation numérique au Tchad.") as any}
        path="/"
        keywords={v(t("home.seo_keywords", "SAYC Tchad, Smart Africa, Innovation"), "SAYC Tchad, Smart Africa, Jeunesse, Tchad, Innovation, SADA") as any}
        jsonLd={organizationJsonLd}
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-sidebar via-sidebar to-sidebar/95 text-sidebar-foreground py-20 md:py-28 lg:py-36">
        <PixelGrid className="bottom-20 right-1/3 opacity-35" variant="hero" />

        {/* ELECTION DAY SPECIAL ANNOUNCEMENT SECTION */}
        <div className="container mx-auto px-4 md:px-6 relative z-50 mb-12">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-6 md:p-10 shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4">
                <Badge className="bg-red-600 animate-pulse text-white border-none px-4 py-1 text-xs font-black">EN DIRECT</Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-left space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full border border-accent/30">
                    <Vote className="w-5 h-5 text-accent" />
                    <span className="text-accent font-black text-xs uppercase tracking-widest">Élections SAYC Tchad 2026</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                    JOURNÉE DE <span className="text-accent">DÉCISION</span>
                  </h2>
                  <p className="text-lg text-white/70 leading-relaxed">
                    Le futur du leadership numérique tchadien se joue aujourd'hui. Soyez au rendez-vous pour les deux moments clés du scrutin.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-black">12H</div>
                      <p className="text-sm font-bold text-white">CLÔTURE DU SCRUTIN</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-sayc-teal flex items-center justify-center font-black">15H</div>
                      <p className="text-sm font-bold text-white">RÉSULTATS OFFICIELS</p>
                    </div>
                  </div>
                  <Link href="/elections">
                    <Button size="lg" className="w-full md:w-auto bg-white text-black hover:bg-slate-100 font-black rounded-2xl h-14 px-10 text-lg shadow-xl">
                      ACCÉDER AU PORTAIL DE VOTE
                      <ChevronRight className="ml-2 w-6 h-6" />
                    </Button>
                  </Link>
                </div>
                
                <div className="relative">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4 transform hover:-translate-y-2 transition-transform duration-500">
                         <div className="rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                            <img 
                              src="https://images.unsplash.com/photo-1540910419892-f0c07d16538d?q=80&w=400&h=600&fit=crop" 
                              alt="Clôture 12h" 
                              className="w-full h-auto"
                            />
                         </div>
                         <p className="text-[10px] text-center text-white/40 font-bold uppercase tracking-widest">Affiche Officielle Clôture</p>
                      </div>
                      <div className="space-y-4 mt-8 transform hover:-translate-y-2 transition-transform duration-500">
                         <div className="rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                            <img 
                              src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=400&h=600&fit=crop" 
                              alt="Proclamation 15h" 
                              className="w-full h-auto"
                            />
                         </div>
                         <p className="text-[10px] text-center text-white/40 font-bold uppercase tracking-widest">Affiche Officielle Résultats</p>
                      </div>
                   </div>
                   
                   {/* Special Overlay with the real generated images from artifacts */}
                   <div className="absolute inset-0 grid grid-cols-2 gap-4">
                      <div className="mt-0 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl">
                         <img src="/api/proxy-image?path=C:/Users/Hp/.gemini/antigravity/brain/b5d80a73-9f72-4c56-bc99-1fe576e7731e/cloture_elections_sayc_12h_1777275091438.png" alt="Clôture" className="w-full h-full object-cover" />
                      </div>
                      <div className="mt-8 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl">
                         <img src="/api/proxy-image?path=C:/Users/Hp/.gemini/antigravity/brain/b5d80a73-9f72-4c56-bc99-1fe576e7731e/proclamation_resultats_sayc_15h_1777275108203.png" alt="Proclamation" className="w-full h-full object-cover" />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-accent/20 text-accent border-accent/30" data-testid="badge-hero-tag">
              <Zap className="w-3 h-3 mr-1" />
              {t("hero.badge", { defaultValue: "7e Chapitre Jeunesse de Smart Africa" })}
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
              {t("hero.title")}{" "}
              <span className="text-accent">{t("hero.tchad")}</span>
            </h1>
            <p className="text-lg md:text-xl text-sidebar-foreground/80 mb-4 max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-description">
              {t("hero.description")}
            </p>
            <p className="text-sm text-sidebar-foreground/60 mb-8 max-w-xl mx-auto" data-testid="text-hero-tagline">
              {t("hero.tagline", { defaultValue: "Jeunes de 15 à 35 ans" })} | {t("hero.initiative_of", { defaultValue: "Une initiative de" })}{" "}
              <a href="https://smartafrica.org" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2" data-testid="link-hero-smart-africa">
                {t("home.alliance_name")}
              </a>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/rejoindre">
                <Button size="lg" className="bg-accent text-accent-foreground border-accent-border min-w-[200px]" data-testid="button-hero-join">
                  {t("hero.cta_join")}
                  <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
                </Button>
              </Link>
              <a 
                href="https://chat.whatsapp.com/CB0pBpYzYyBIw2zZB3A8Kj" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="min-w-[200px] border-sayc-teal/50 text-sayc-teal hover:bg-sayc-teal/10" data-testid="button-hero-whatsapp">
                  <SiWhatsapp className="mr-2 h-5 w-5" />
                  {t("hero.cta_whatsapp")}
                </Button>
              </a>
              <Link href="/opportunites">
                <Button size="lg" variant="outline" className="min-w-[200px] border-sidebar-foreground/20 text-sidebar-foreground" data-testid="button-hero-opportunities">
                  {t("hero.cta_opp")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-4 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
            <span className="font-medium">{t("home.alliance_name")}</span>
            <span className="hidden sm:inline text-primary-foreground/40">|</span>
            <a href="https://sada.smart.africa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-foreground/80 transition-colors" data-testid="link-bar-sada">
              SADA <ExternalLink className="w-3 h-3" />
            </a>
            <span className="hidden sm:inline text-primary-foreground/40">|</span>
            <a href="https://transformafricasummit.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-foreground/80 transition-colors" data-testid="link-bar-tas">
              Transform Africa Summit <ExternalLink className="w-3 h-3" />
            </a>
            <span className="hidden sm:inline text-primary-foreground/40">|</span>
            <a href="https://smartafrica.org/blueprint/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-foreground/80 transition-colors" data-testid="link-bar-blueprints">
              {t("home.blueprints")} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-8 right-8 opacity-20">
          <PixelGrid variant="section" />
        </div>
        <div className="absolute bottom-8 left-8 opacity-15">
          <PixelGrid variant="section" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <PixelGrid variant="small" />
              <Badge variant="outline" data-testid="badge-objectives-tag">
                <Target className="w-3 h-3 mr-1" />
                {t("home.objectives_tag")}
              </Badge>
              <PixelGrid variant="small" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-objectives-title">
              {t("home.objectives_title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-objectives-description">
              {t("home.objectives_desc")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {objectives.map((objective, index) => (
              <Card key={index} className="border-none shadow-lg hover-elevate transition-all duration-300" data-testid={`card-objective-${index}`}>
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 rounded-lg ${objective.color} flex items-center justify-center mb-4`}>
                    <objective.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="font-heading text-xl">{objective.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {objective.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <Badge variant="outline" className="mb-4" data-testid="badge-activities-tag">
                <Rocket className="w-3 h-3 mr-1" />
                {t("home.activities_tag")}
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-activities-title">
                {t("home.activities_title")}
              </h2>
              <p className="text-muted-foreground max-w-xl" data-testid="text-activities-description">
                {t("home.activities_desc")}
              </p>
            </div>
            <Link href="/programmes">
              <Button variant="outline" className="shrink-0" data-testid="button-activities-view-all">
                {t("common.learn_more")}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <Card key={index} className="group hover-elevate transition-all duration-300" data-testid={`card-activity-${index}`}>
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <activity.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="font-heading text-lg">{activity.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {activity.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4" data-testid="badge-gallery-tag">
              <Eye className="w-3 h-3 mr-1" />
              {t("home.gallery_tag")}
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-gallery-title">
              {t("home.gallery_title")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto" data-testid="text-gallery-description">
              {t("home.gallery_desc")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-video overflow-hidden rounded-md"
                data-testid={`img-home-gallery-${index}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-4 md:px-6">
          {achievementsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-12 w-24 mx-auto mb-2 bg-sidebar-foreground/10" />
                  <Skeleton className="h-4 w-32 mx-auto bg-sidebar-foreground/10" />
                </div>
              ))}
            </div>
          ) : achievementsList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {achievementsList.map((achievement, index) => (
                <div key={achievement.id} className="text-center" data-testid={`stat-${index}`}>
                  <div className="font-heading text-4xl md:text-5xl font-bold text-accent mb-2">
                    {achievement.metricValue}
                  </div>
                  <div className="text-sidebar-foreground/70 text-sm md:text-base">
                    {achievement.metricLabel}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-sidebar-foreground/60">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t("home.stats_unavailable")}</p>
            </div>
          )}
        </div>
      </section>

      {latestTrainings.length > 0 && (
        <section className="py-16 md:py-24" data-testid="section-trainings-preview">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <Badge variant="outline" className="mb-4" data-testid="badge-trainings-home-tag">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {t("home.trainings_tag")}
                </Badge>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-trainings-home-title">
                  {t("home.trainings_title")}
                </h2>
                <p className="text-muted-foreground max-w-xl" data-testid="text-trainings-home-description">
                  {t("home.trainings_desc")}
                </p>
              </div>
              <Link href="/formations">
                <Button variant="outline" className="shrink-0" data-testid="button-trainings-view-all">
                  {t("common.all_trainings")}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {latestTrainings.map((training) => (
                <Card key={training.id} className="group hover-elevate transition-all duration-300" data-testid={`card-training-preview-${training.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {training.level || "Formation"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{training.provider}</span>
                    </div>
                    <CardTitle className="font-heading text-lg leading-snug">
                      {training.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed mb-3">
                      {training.description.length > 150 ? training.description.slice(0, 150) + "..." : training.description}
                    </CardDescription>
                    {training.link && (
                      <a href={training.link} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary text-sm font-medium">
                        {t("home.access_training")}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {latestOpportunities.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30" data-testid="section-opportunities-preview">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <Badge variant="outline" className="mb-4" data-testid="badge-opportunities-home-tag">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {t("home.opps_tag")}
                </Badge>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-opportunities-home-title">
                  {t("home.opps_title")}
                </h2>
                <p className="text-muted-foreground max-w-xl" data-testid="text-opportunities-home-description">
                  {t("home.opps_desc")}
                </p>
              </div>
              <Link href="/opportunites">
                <Button variant="outline" className="shrink-0" data-testid="button-opportunities-view-all">
                  {t("common.all_opps")}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {latestOpportunities.map((opp) => (
                <Card key={opp.id} className="group hover-elevate transition-all duration-300" data-testid={`card-opp-preview-${opp.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {opp.category}
                      </Badge>
                      <span className="text-xs text-accent font-medium">{opp.deadline}</span>
                    </div>
                    <CardTitle className="font-heading text-lg leading-snug">
                      {opp.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed mb-3">
                      {opp.description.length > 120 ? opp.description.slice(0, 120) + "..." : opp.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Building2 className="w-3 h-3" />
                      <span>{opp.organization}</span>
                    </div>
                    <Link href="/opportunites">
                      <span className="flex items-center text-primary text-sm font-medium cursor-pointer">
                        {t("common.view_details")}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </span>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4" data-testid="badge-smart-africa-tag">
              <Globe className="w-3 h-3 mr-1" />
              {t("home.initiatives_tag")}
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-smart-africa-title">
              {t("home.initiatives_title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-smart-africa-description">
              {t("home.initiatives_desc")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {smartAfricaInitiatives.map((initiative, index) => (
              <a
                key={index}
                href={initiative.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                data-testid={`link-sa-initiative-${index}`}
              >
                <Card className="h-full group hover-elevate transition-all duration-300" data-testid={`card-sa-initiative-${index}`}>
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <initiative.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="font-heading text-lg flex items-center gap-2 flex-wrap">
                      {initiative.title}
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {initiative.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

          <div className="text-center">
            <a href="https://smartafrica.org/fr/page-daccueil/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" data-testid="button-visit-smart-africa">
                {t("common.visit_site")} smartafrica.org
                <ExternalLink className="ml-1 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {partnersList.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30" data-testid="section-partners">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4" data-testid="badge-partners-tag">
                <LinkIcon className="w-3 h-3 mr-1" />
                {t("home.partners_tag")}
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-partners-title">
                {t("home.partners_title")}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t("home.partners_desc")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {partnersList.map((partner) => (
                <Card key={partner.id} className="hover-elevate transition-all duration-300 text-center" data-testid={`card-partner-${partner.id}`}>
                  <CardHeader className="pb-3">
                    {partner.logoUrl ? (
                      <img src={partner.logoUrl} alt={partner.name} className="h-16 w-auto mx-auto mb-3 object-contain" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                        <Building2 className="w-8 h-8" />
                      </div>
                    )}
                    <CardTitle className="font-heading text-base">{partner.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {partner.description && (
                      <CardDescription className="text-xs leading-relaxed mb-3">
                        {partner.description.length > 100 ? partner.description.slice(0, 100) + "..." : partner.description}
                      </CardDescription>
                    )}
                    {partner.websiteUrl && (
                      <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary text-xs font-medium">
                        {t("home.partners.visit")}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {newsList.length > 0 && (
        <section className="py-16 md:py-24" data-testid="section-news">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <Badge variant="outline" className="mb-4" data-testid="badge-news-tag">
                  <Zap className="w-3 h-3 mr-1" />
                  {t("home.news_tag")}
                </Badge>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-news-title">
                  {t("home.news_title")}
                </h2>
                <p className="text-muted-foreground max-w-xl">
                  {t("home.news_desc")}
                </p>
              </div>
              <Link href="/actualites">
                <Button variant="outline" className="shrink-0" data-testid="button-news-view-all">
                  {t("common.all_news")}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {newsList.slice(0, 3).map((article) => (
                <Dialog key={article.id}>
                  <Card className="group hover-elevate transition-all duration-300 overflow-hidden" data-testid={`card-news-${article.id}`}>
                    {(article.imageUrls?.[0] || article.imageUrl) && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.imageUrls?.[0] || article.imageUrl || ""}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          data-testid={`img-news-${article.id}`}
                        />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{article.publishedAt}</span>
                      </div>
                      <CardTitle className="font-heading text-lg leading-snug">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-sm leading-relaxed">
                        {article.excerpt}
                      </CardDescription>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent font-medium" data-testid={`btn-read-more-home-${article.id}`}>
                          {t("common.read_more")}
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </CardContent>
                  </Card>

                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="mb-6">
                      <DialogTitle className="font-heading text-2xl md:text-3xl text-left leading-tight">
                        {article.title}
                      </DialogTitle>
                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {article.publishedAt}
                        </span>
                      </div>
                      <DialogDescription className="hidden">
                        {t("home.news.details_prefix")}{article.title}
                      </DialogDescription>
                    </DialogHeader>

                    <article className="space-y-8">
                      {/* Image Gallery */}
                      {(article.imageUrls || article.imageUrl) && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {article.imageUrls && article.imageUrls.length > 0 ? (
                              article.imageUrls.map((img, idx) => (
                                <div key={idx} className={`relative rounded-xl overflow-hidden shadow-lg ${article.imageUrls!.length === 1 ? 'md:col-span-2 aspect-video' : 'aspect-square'}`}>
                                  <img 
                                    src={img} 
                                    alt={`${article.title} - ${idx + 1}`} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))
                            ) : article.imageUrl ? (
                              <div className="md:col-span-2 aspect-video rounded-xl overflow-hidden shadow-lg">
                                <img 
                                  src={article.imageUrl} 
                                  alt={article.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}

                      {/* Article Content */}
                      <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">
                        {article.content || article.excerpt}
                      </div>
                    </article>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-sidebar text-primary-foreground relative overflow-hidden">
        <PixelGrid className="top-10 right-10 opacity-20" variant="hero" />
        <PixelGrid className="bottom-10 left-10 opacity-15" variant="hero" />
        <div className="container mx-auto px-4 md:px-6 text-center relative">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-title">
            {t("home.cta_title")}
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 text-lg" data-testid="text-cta-description">
            {t("home.cta_desc")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/rejoindre">
              <Button size="lg" className="bg-accent text-accent-foreground border-accent-border min-w-[200px]" data-testid="button-cta-join">
                {t("home.become_member")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground/30 text-primary-foreground" data-testid="button-cta-contact">
                {t("common.contact_us")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
