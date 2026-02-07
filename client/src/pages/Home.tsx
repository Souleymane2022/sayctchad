import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Opportunity } from "@shared/schema";
import { 
  ArrowRight, 
  Users, 
  Lightbulb, 
  Handshake, 
  GraduationCap, 
  Rocket, 
  Calendar,
  ChevronRight,
  Globe,
  Target,
  Zap,
  Eye,
  ExternalLink,
  Briefcase,
  Building2,
  MapPin
} from "lucide-react";

import galleryImg1 from "@assets/UniPod_Mamou_J3_95_1770104422778.JPG";
import galleryImg2 from "@assets/UniPod_Mamou_J2_70_1770104422781.JPG";
import galleryImg3 from "@assets/UniPod_Mamou_J2_21_1770104422785.JPG";
import galleryImg4 from "@assets/604667985_122096798505190973_8462039452349924014_n_1770104422797.jpg";

const galleryImages = [
  { src: galleryImg1, alt: "Formation en cours" },
  { src: galleryImg2, alt: "Session de formation" },
  { src: galleryImg3, alt: "Travail collaboratif" },
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
    description: "Former des jeunes leaders capables de piloter l'évolution du chapitre et de transformer leurs communautés.",
    color: "bg-primary/10 text-primary",
    borderColor: "border-l-primary",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Plateforme structurée pour concevoir, valider et lancer des solutions numériques innovantes.",
    color: "bg-accent/10 text-accent",
    borderColor: "border-l-accent",
  },
  {
    icon: Handshake,
    title: "Collaboration",
    description: "Activer la collaboration via une plateforme nationale et continentale de formation et réseau.",
    color: "bg-sayc-teal/10 text-sayc-teal",
    borderColor: "border-l-sayc-teal",
  },
];

const programs = [
  {
    icon: GraduationCap,
    title: "Formations Numériques",
    description: "Programmes de renforcement des compétences en technologie, cloud et cybersécurité.",
    badge: "Populaire",
  },
  {
    icon: Rocket,
    title: "Incubation de Projets",
    description: "Accompagnement des jeunes entrepreneurs dans le développement de leurs startups.",
    badge: "Nouveau",
  },
  {
    icon: Calendar,
    title: "Hackathons & Bootcamps",
    description: "Événements intensifs pour résoudre des défis locaux avec des solutions tech.",
    badge: null,
  },
  {
    icon: Globe,
    title: "Réseau Continental",
    description: "Connexion avec les chapitres Smart Africa à travers l'Afrique.",
    badge: null,
  },
];

const stats = [
  { value: "500+", label: "Membres actifs" },
  { value: "25+", label: "Formations" },
  { value: "10+", label: "Partenaires" },
  { value: "15+", label: "Événements" },
];

const smartAfricaInitiatives = [
  {
    title: "Smart Africa Alliance",
    description: "Alliance panafricaine pour la transformation numérique du continent. Vision: un marché numérique unique en Afrique.",
    link: "https://smartafrica.org/fr/page-daccueil/",
    icon: Globe,
  },
  {
    title: "SADA - Académie Numérique",
    description: "La Smart Africa Digital Academy offre des formations certifiantes en compétences numériques.",
    link: "https://sada.smartafrica.org",
    icon: GraduationCap,
  },
  {
    title: "Transform Africa Summit",
    description: "Le sommet annuel qui rassemble les leaders africains pour accélérer la transformation digitale.",
    link: "https://transformafricasummit.org",
    icon: Rocket,
  },
];

const news = [
  {
    title: "Lancement du programme de formation en cybersécurité",
    date: "25 Jan 2026",
    category: "Formation",
    excerpt: "Un nouveau programme intensif pour former les jeunes aux enjeux de la sécurité numérique.",
  },
  {
    title: "Hackathon Smart Cities Tchad 2026",
    date: "18 Jan 2026",
    category: "Événement",
    excerpt: "48 heures pour imaginer les solutions urbaines de demain avec la technologie.",
  },
  {
    title: "Partenariat stratégique avec l'Union Africaine",
    date: "10 Jan 2026",
    category: "Partenariat",
    excerpt: "Renforcement de la collaboration pour l'inclusion numérique des jeunes africains.",
  },
];

export default function Home() {
  const { data: opportunities = [] } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities"],
  });

  const latestOpportunities = opportunities.slice(0, 3);

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-sidebar via-sidebar to-sidebar/95 text-sidebar-foreground py-20 md:py-28 lg:py-36">
        <PixelGrid className="top-10 left-10 opacity-40" variant="hero" />
        <PixelGrid className="top-20 right-16 opacity-30" variant="hero" />
        <PixelGrid className="bottom-32 left-1/4 opacity-25" variant="hero" />
        <PixelGrid className="bottom-20 right-1/3 opacity-35" variant="hero" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-accent/20 text-accent border-accent/30" data-testid="badge-hero-tag">
              <Zap className="w-3 h-3 mr-1" />
              Chapitre Jeunesse de Smart Africa au Tchad
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
              Smart Africa Youth Chapter{" "}
              <span className="text-accent">Tchad</span>
            </h1>
            <p className="text-lg md:text-xl text-sidebar-foreground/80 mb-4 max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-description">
              Le chapitre jeunesse de Smart Africa au Tchad. Inspirer une nouvelle génération
              de jeunes Africains à utiliser la technologie et l'innovation pour transformer l'Afrique.
            </p>
            <p className="text-sm text-sidebar-foreground/60 mb-8 max-w-xl mx-auto" data-testid="text-hero-tagline">
              Connecter - Innover - Transformer | Une initiative de{" "}
              <a href="https://smartafrica.org" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
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
            <a href="https://sada.smartafrica.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-bar-sada">
              SADA <ExternalLink className="w-3 h-3" />
            </a>
            <span className="hidden sm:inline text-primary-foreground/40">|</span>
            <a href="https://transformafricasummit.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-bar-tas">
              Transform Africa Summit <ExternalLink className="w-3 h-3" />
            </a>
            <span className="hidden sm:inline text-primary-foreground/40">|</span>
            <a href="https://smartafrica.org/blueprint/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-bar-blueprints">
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
                Nos Objectifs
              </Badge>
              <PixelGrid variant="small" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-objectives-title">
              Trois Piliers Stratégiques
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-objectives-description">
              Notre mission repose sur trois objectifs fondamentaux pour transformer la jeunesse tchadienne.
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
              <Badge variant="outline" className="mb-4" data-testid="badge-programs-tag">
                <Rocket className="w-3 h-3 mr-1" />
                Programmes
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-programs-title">
                Nos Programmes & Activités
              </h2>
              <p className="text-muted-foreground max-w-xl" data-testid="text-programs-description">
                Découvrez nos initiatives pour accompagner les jeunes dans leur parcours numérique.
              </p>
            </div>
            <Link href="/programmes">
              <Button variant="outline" className="shrink-0" data-testid="button-programs-view-all">
                Voir tous les programmes
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => (
              <Card key={index} className="group hover-elevate cursor-pointer transition-all duration-300" data-testid={`card-program-${index}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <program.icon className="w-6 h-6" />
                    </div>
                    {program.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {program.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="font-heading text-lg">{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {program.description}
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
                className="relative aspect-video overflow-hidden rounded-lg hover-elevate transition-all"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" data-testid={`stat-${index}`}>
                <div className="font-heading text-4xl md:text-5xl font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-sidebar-foreground/70 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {latestOpportunities.length > 0 && (
        <section className="py-16 md:py-24" data-testid="section-opportunities-preview">
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
                    <div className="flex items-center justify-between gap-2 mb-2">
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
                        <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-muted/30">
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
              Le SAYC Tchad est le chapitre jeunesse de Smart Africa au Tchad.
              Smart Africa est une alliance panafricaine dont la vision est de transformer
              l'Afrique en un marché numérique unique.
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
              >
                <Card className="h-full group hover-elevate transition-all duration-300" data-testid={`card-sa-initiative-${index}`}>
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <initiative.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="font-heading text-lg flex items-center gap-2">
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

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <Badge variant="outline" className="mb-4" data-testid="badge-news-tag">
                <Calendar className="w-3 h-3 mr-1" />
                Actualités
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-news-title">
                Dernières Actualités
              </h2>
              <p className="text-muted-foreground max-w-xl" data-testid="text-news-description">
                Restez informé des dernières nouvelles et opportunités du SAYC Tchad.
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
            {news.map((article, index) => (
              <Card key={index} className="group hover-elevate cursor-pointer transition-all duration-300" data-testid={`card-news-${index}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                  </div>
                  <CardTitle className="font-heading text-lg leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {article.excerpt}
                  </CardDescription>
                  <div className="mt-4 flex items-center text-primary text-sm font-medium">
                    Lire la suite
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-title">
              Prêt à rejoindre le mouvement?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto" data-testid="text-cta-description">
              Rejoignez des centaines de jeunes Tchadiens engagés pour la transformation numérique de l'Afrique
              avec Smart Africa.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/rejoindre">
                <Button size="lg" variant="secondary" className="min-w-[200px]" data-testid="button-cta-join">
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
        </div>
      </section>
    </div>
  );
}
