import { useMemo } from "react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Opportunity, Achievement, Partner, Training, NewsArticle } from "@shared/schema";
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
  Link as LinkIcon
} from "lucide-react";

import galleryImg1 from "@assets/UniPod_Mamou_J3_95_1770104422778.JPG";
import galleryImg2 from "@assets/UniPod_Mamou_J2_70_1770104422781.JPG";
import galleryImg3 from "@assets/UniPod_Mamou_J2_21_1770104422785.JPG";
import galleryImg4 from "@assets/604667985_122096798505190973_8462039452349924014_n_1770104422797.jpg";

const galleryImages = [
  { src: galleryImg1, alt: "Formation SADA4Youth en cours" },
  { src: galleryImg2, alt: "Session de renforcement de compétences" },
  { src: galleryImg3, alt: "Travail collaboratif des jeunes" },
  { src: galleryImg4, alt: "Conférence Smart Africa" },
];

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

const objectives = [
  {
    icon: Users,
    title: "Leadership",
    description: "Favoriser le leadership au sein du chapitre et former des jeunes leaders capables de piloter son évolution.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Fournir une plateforme structurée où les jeunes innovateurs peuvent concevoir, valider et lancer des solutions numériques innovantes.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Handshake,
    title: "Collaboration",
    description: "Activer la collaboration entre les jeunes via une plateforme nationale et continentale pour la formation, la mise en réseau et l'innovation.",
    color: "bg-sayc-teal/10 text-sayc-teal",
  },
];

const activities = [
  {
    icon: GraduationCap,
    title: "Développer vos compétences",
    description: "Programmes de renforcement des compétences numériques de base et avancées via la plateforme SADA.",
  },
  {
    icon: Users,
    title: "Programme de mentorat",
    description: "Accompagnement personnalisé par des mentors expérimentés du réseau Smart Africa.",
  },
  {
    icon: Rocket,
    title: "Hackathons & Bootcamps",
    description: "Concours de pitchs, bootcamps et hackathons locaux et internationaux pour les jeunes innovateurs.",
  },
  {
    icon: Globe,
    title: "Opportunités de réseautage",
    description: "Connexion avec les 6 autres chapitres Smart Africa à travers l'Afrique pour partager les meilleures pratiques.",
  },
  {
    icon: BookOpen,
    title: "Ressources pédagogiques",
    description: "Accès à plus de 130 formations sur la plateforme SADA, incluant des cours d'universités internationales.",
  },
  {
    icon: Award,
    title: "Présentation de projets",
    description: "Opportunités de présenter vos projets devant des investisseurs et des décideurs politiques.",
  },
];

const smartAfricaInitiatives = [
  {
    title: "Smart Africa Alliance",
    description: "Alliance panafricaine de 40 États membres représentant plus de 1,2 milliard de personnes, pour accélérer le développement socio-économique par les TIC.",
    link: "https://smartafrica.org/fr/page-daccueil/",
    icon: Globe,
  },
  {
    title: "SADA - Académie Numérique",
    description: "Écosystème d'apprentissage panafricain visant à améliorer les compétences numériques et l'employabilité. Objectif : 100 millions de citoyens africains d'ici 2030.",
    link: "https://sada.smartafrica.org",
    icon: GraduationCap,
  },
  {
    title: "Transform Africa Summit",
    description: "Le sommet annuel qui rassemble les leaders africains pour accélérer la transformation digitale du continent.",
    link: "https://transformafricasummit.org",
    icon: Rocket,
  },
];

export default function Home() {
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

  const { data: newsList = [] } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
  });

  const latestOpportunities = opportunities.slice(0, 3);
  const latestTrainings = trainingsList.slice(0, 3);

  const organizationJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SAYC Tchad - Smart Africa Youth Chapter",
    description: "7ème chapitre jeunesse de Smart Africa au Tchad, dédié aux jeunes de 15 à 35 ans pour l'éducation, la collaboration et l'innovation numérique.",
    url: window.location.origin,
    logo: `${window.location.origin}/favicon.png`,
    parentOrganization: {
      "@type": "Organization",
      name: "Smart Africa Alliance",
      url: "https://smartafrica.org",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Point Focal",
      name: "Souleymane Mahamat Saleh",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "N'Djamena",
      addressCountry: "TD",
    },
  }), []);

  return (
    <div className="flex flex-col">
      <SEOHead
        title="SAYC Tchad - Smart Africa Youth Chapter | Innovation Numérique pour la Jeunesse"
        description="Smart Africa Youth Chapter Tchad - 7ème chapitre jeunesse de Smart Africa dédié aux jeunes de 15 à 35 ans pour l'éducation, la collaboration et l'innovation numérique au Tchad."
        path="/"
        jsonLd={organizationJsonLd}
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-sidebar via-sidebar to-sidebar/95 text-sidebar-foreground py-20 md:py-28 lg:py-36">
        <PixelGrid className="top-10 left-10 opacity-40" variant="hero" />
        <PixelGrid className="top-20 right-16 opacity-30" variant="hero" />
        <PixelGrid className="bottom-32 left-1/4 opacity-25" variant="hero" />
        <PixelGrid className="bottom-20 right-1/3 opacity-35" variant="hero" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-accent/20 text-accent border-accent/30" data-testid="badge-hero-tag">
              <Zap className="w-3 h-3 mr-1" />
              7e Chapitre Jeunesse de Smart Africa
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
              Smart Africa Youth Chapter{" "}
              <span className="text-accent">Tchad</span>
            </h1>
            <p className="text-lg md:text-xl text-sidebar-foreground/80 mb-4 max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-description">
              Inspirer une nouvelle génération de jeunes Africains à utiliser la technologie
              et l'innovation pour transformer l'Afrique, créer des opportunités et bâtir un avenir durable.
            </p>
            <p className="text-sm text-sidebar-foreground/60 mb-8 max-w-xl mx-auto" data-testid="text-hero-tagline">
              Jeunes de 15 à 35 ans | Une initiative de{" "}
              <a href="https://smartafrica.org" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2" data-testid="link-hero-smart-africa">
                Smart Africa Alliance
              </a>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/rejoindre">
                <Button size="lg" className="bg-accent text-accent-foreground border-accent-border min-w-[200px]" data-testid="button-hero-join">
                  Rejoindre le SAYC
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/opportunites">
                <Button size="lg" variant="outline" className="min-w-[200px] border-sidebar-foreground/20 text-sidebar-foreground" data-testid="button-hero-opportunities">
                  Voir les opportunités
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
            <span className="font-medium">Smart Africa Alliance</span>
            <span className="hidden sm:inline text-primary-foreground/40">|</span>
            <a href="https://sada.smartafrica.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-foreground/80 transition-colors" data-testid="link-bar-sada">
              SADA <ExternalLink className="w-3 h-3" />
            </a>
            <span className="hidden sm:inline text-primary-foreground/40">|</span>
            <a href="https://transformafricasummit.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-foreground/80 transition-colors" data-testid="link-bar-tas">
              Transform Africa Summit <ExternalLink className="w-3 h-3" />
            </a>
            <span className="hidden sm:inline text-primary-foreground/40">|</span>
            <a href="https://smartafrica.org/blueprint/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-foreground/80 transition-colors" data-testid="link-bar-blueprints">
              Plans directeurs <ExternalLink className="w-3 h-3" />
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
                Objectifs du SAYC
              </Badge>
              <PixelGrid variant="small" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-objectives-title">
              Trois Piliers Stratégiques
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-objectives-description">
              Le chapitre jeunesse de Smart Africa repose sur trois objectifs fondamentaux pour transformer la jeunesse tchadienne.
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
                Activités SAYC
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-activities-title">
                Ce Que Nous Offrons
              </h2>
              <p className="text-muted-foreground max-w-xl" data-testid="text-activities-description">
                Une plateforme dédiée à l'éducation, à la collaboration et à l'autonomisation des jeunes tchadiens.
              </p>
            </div>
            <Link href="/programmes">
              <Button variant="outline" className="shrink-0" data-testid="button-activities-view-all">
                En savoir plus
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
              En Images
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-gallery-title">
              Nos Activités
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto" data-testid="text-gallery-description">
              Découvrez nos formations et événements en images.
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
              <p>Les statistiques seront bientôt disponibles.</p>
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
                  Formations SADA
                </Badge>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-trainings-home-title">
                  Formations & Programmes
                </h2>
                <p className="text-muted-foreground max-w-xl" data-testid="text-trainings-home-description">
                  Programmes certifiants de la Smart Africa Digital Academy et de ses partenaires.
                </p>
              </div>
              <Link href="/formations">
                <Button variant="outline" className="shrink-0" data-testid="button-trainings-view-all">
                  Toutes les formations
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
                        Accéder à la formation
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
                  Opportunités
                </Badge>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-opportunities-home-title">
                  Appels d'offres & Opportunités
                </h2>
                <p className="text-muted-foreground max-w-xl" data-testid="text-opportunities-home-description">
                  Les dernières opportunités de Smart Africa et de ses partenaires.
                </p>
              </div>
              <Link href="/opportunites">
                <Button variant="outline" className="shrink-0" data-testid="button-opportunities-view-all">
                  Toutes les opportunités
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
                        Voir les détails
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
              Notre Réseau
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-smart-africa-title">
              Smart Africa Alliance
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-smart-africa-description">
              Le SAYC Tchad est le 7e chapitre jeunesse de Smart Africa.
              Smart Africa est un engagement des chefs d'État africains pour accélérer le développement
              socio-économique durable par les technologies de l'information.
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
                Visiter smartafrica.org
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
                Partenaires
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-partners-title">
                Nos Partenaires
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Les organisations et institutions qui soutiennent le développement numérique de la jeunesse.
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
                        Visiter
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
                  Actualités
                </Badge>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-news-title">
                  Dernières Actualités
                </h2>
                <p className="text-muted-foreground max-w-xl">
                  Les nouvelles récentes du SAYC Tchad et de Smart Africa.
                </p>
              </div>
              <Link href="/actualites">
                <Button variant="outline" className="shrink-0" data-testid="button-news-view-all">
                  Toutes les actualités
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {newsList.slice(0, 3).map((article) => (
                <Card key={article.id} className="group hover-elevate transition-all duration-300" data-testid={`card-news-${article.id}`}>
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
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {article.excerpt}
                    </CardDescription>
                  </CardContent>
                </Card>
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
            Rejoignez le mouvement
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 text-lg" data-testid="text-cta-description">
            Participez à la transformation numérique du Tchad. Le SAYC est ouvert à tous les jeunes
            de 15 à 35 ans passionnés par la technologie et l'innovation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/rejoindre">
              <Button size="lg" className="bg-accent text-accent-foreground border-accent-border min-w-[200px]" data-testid="button-cta-join">
                Devenir membre
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground/30 text-primary-foreground" data-testid="button-cta-contact">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
