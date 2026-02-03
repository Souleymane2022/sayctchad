import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Zap
} from "lucide-react";

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

const partners = [
  { name: "Smart Africa", logo: "SA" },
  { name: "Ministère du Numérique", logo: "MN" },
  { name: "UNESCO", logo: "UN" },
  { name: "PNUD", logo: "PN" },
  { name: "BAD", logo: "BD" },
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
              Chapitre National de la Jeunesse
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
              Smart Africa Youth Chapter{" "}
              <span className="text-accent">Tchad</span>
            </h1>
            <p className="text-lg md:text-xl text-sidebar-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-description">
              Inspirer une nouvelle génération de jeunes Africains à utiliser la technologie et l'innovation pour transformer l'Afrique et bâtir un avenir durable.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/rejoindre">
                <Button size="lg" className="bg-accent text-accent-foreground border-accent-border min-w-[200px]" data-testid="button-hero-join">
                  Rejoindre le SAYC
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/a-propos">
                <Button size="lg" variant="outline" className="min-w-[200px] border-sidebar-foreground/20 text-sidebar-foreground hover:bg-sidebar-foreground/10" data-testid="button-hero-discover">
                  Découvrir notre vision
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
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

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4" data-testid="badge-partners-tag">
              <Handshake className="w-3 h-3 mr-1" />
              Partenaires
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-partners-title">
              Nos Partenaires
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto" data-testid="text-partners-description">
              Ensemble, nous construisons l'avenir numérique du Tchad.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="w-24 h-24 md:w-28 md:h-28 rounded-lg bg-card border flex items-center justify-center hover-elevate transition-all"
                data-testid={`partner-${index}`}
              >
                <span className="font-heading font-bold text-2xl text-muted-foreground">
                  {partner.logo}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/partenaires">
              <Button variant="outline" data-testid="button-partners-become">
                Devenir partenaire
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
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
              Rejoignez des centaines de jeunes Tchadiens engagés pour la transformation numérique de l'Afrique.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/rejoindre">
                <Button size="lg" variant="secondary" className="min-w-[200px]" data-testid="button-cta-join">
                  Devenir membre
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-cta-contact">
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
