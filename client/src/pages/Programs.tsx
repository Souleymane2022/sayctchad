import { useMemo } from "react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Training } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowRight, 
  GraduationCap, 
  Rocket, 
  Users,
  Briefcase,
  Globe,
  ChevronRight,
  Target,
  BookOpen,
  Award,
  Lightbulb,
  ExternalLink,
  Handshake
} from "lucide-react";

const saycPillars = [
  {
    icon: Users,
    title: "Engagement des jeunes dans les politiques numériques",
    description: "Encourager la participation des jeunes dans l'élaboration des politiques numériques. Plaider pour des politiques inclusives et centrées sur les jeunes. Favoriser l'engagement dans les réformes de gouvernance numérique.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: GraduationCap,
    title: "Renforcement des compétences numériques",
    description: "Déployer des formations nationales et régionales en compétences numériques de base et avancées. Fournir des parcours de certification alignés sur les besoins du marché du travail. Faciliter l'apprentissage via la plateforme SADA.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Rocket,
    title: "Compétences entrepreneuriales & innovation",
    description: "Organiser des bootcamps et concours de pitchs locaux et internationaux. Faciliter l'accès au financement, à l'accompagnement et à la visibilité internationale. Favoriser le réseautage entre innovateurs africains.",
    color: "bg-sayc-teal/10 text-sayc-teal",
  },
];

const saycActivities = [
  { icon: BookOpen, title: "Développer vos compétences", description: "Programmes de formation via SADA et les partenaires de Smart Africa." },
  { icon: Handshake, title: "Programme de mentorat", description: "Accompagnement personnalisé par des mentors expérimentés." },
  { icon: Target, title: "Opportunités de leadership", description: "Former des jeunes leaders capables de transformer leurs communautés." },
  { icon: Globe, title: "Opportunités de réseautage", description: "Connexion avec les chapitres Smart Africa à travers l'Afrique." },
  { icon: Award, title: "Présentation de projets", description: "Présentez vos projets devant des investisseurs et décideurs." },
  { icon: Lightbulb, title: "Concours & Hackathons", description: "Compétitions locales et internationales pour les innovateurs." },
];

export default function Programs() {
  const { data: trainings = [], isLoading: trainingsLoading } = useQuery<Training[]>({
    queryKey: ["/api/trainings"],
  });

  const webPageJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Programmes SAYC Tchad",
    description: "Programmes de formation et d'innovation numérique du SAYC Tchad : engagement politique, compétences numériques et entrepreneuriat.",
    url: `${window.location.origin}/programmes`,
    isPartOf: { "@type": "WebSite", name: "SAYC Tchad", url: window.location.origin },
  }), []);

  return (
    <div className="flex flex-col">
      <SEOHead
        title="Programmes SAYC Tchad | Formation et Innovation Numérique"
        description="Découvrez les programmes du SAYC Tchad : engagement des jeunes dans les politiques numériques, renforcement des compétences et entrepreneuriat innovant."
        path="/programmes"
        jsonLd={webPageJsonLd}
      />
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-muted/50 to-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6" data-testid="badge-programs-header">
              <Rocket className="w-3 h-3 mr-1" />
              SAYC Tchad
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-programs-title">
              Programmes &{" "}
              <span className="text-primary">Activités</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4" data-testid="text-programs-description">
              Le SAYC Tchad offre une plateforme dédiée à l'éducation, à la collaboration
              et à l'autonomisation des jeunes de 15 à 35 ans. Transmission de compétences pratiques,
              promotion de la collaboration et mentorat.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Cadre des piliers clés de SADA pour les Jeunes et Entrepreneurs
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/formations">
                <Button size="lg" data-testid="button-view-trainings">
                  Voir les formations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="https://sada.smartafrica.org" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" data-testid="button-sada-programs">
                  Plateforme SADA
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4" data-testid="badge-pillars">
              <Target className="w-3 h-3 mr-1" />
              Cadre stratégique
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-pillars-title">
              Les Trois Piliers du SAYC
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-pillars-description">
              Compétences pour l'emploi : créer un environnement favorable permettant aux jeunes
              et entrepreneurs africains de prospérer dans l'écosystème technologique mondial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {saycPillars.map((pillar, index) => (
              <Card key={index} className="hover-elevate transition-all" data-testid={`card-pillar-${index}`}>
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 rounded-lg ${pillar.color} flex items-center justify-center mb-4`}>
                    <pillar.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="font-heading text-lg">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {pillar.description}
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
            <Badge variant="outline" className="mb-4" data-testid="badge-activities">
              <Briefcase className="w-3 h-3 mr-1" />
              Activités
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-activities-title">
              Ce Que Nous Offrons
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-activities-description">
              Le SAYC Tchad propose un ensemble d'activités pour accompagner les jeunes dans leur parcours.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saycActivities.map((activity, index) => (
              <Card key={index} className="text-center hover-elevate transition-all" data-testid={`card-activity-${index}`}>
                <CardHeader className="pb-3">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <activity.icon className="w-7 h-7" />
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

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <Badge variant="outline" className="mb-4" data-testid="badge-trainings-programs">
                <GraduationCap className="w-3 h-3 mr-1" />
                Formations SADA
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-trainings-programs-title">
                Formations Disponibles
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Programmes certifiants via la Smart Africa Digital Academy.
              </p>
            </div>
            <Link href="/formations">
              <Button variant="outline" className="shrink-0" data-testid="button-all-trainings">
                Toutes les formations
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {trainingsLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-20 mb-2" />
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : trainings.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {trainings.slice(0, 3).map((training) => (
                <Card key={training.id} className="hover-elevate transition-all" data-testid={`card-training-prog-${training.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      {training.level && (
                        <Badge variant="secondary" className="text-xs">
                          {training.level}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{training.provider}</span>
                    </div>
                    <CardTitle className="font-heading text-lg leading-snug">
                      {training.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {training.description.length > 120 ? training.description.slice(0, 120) + "..." : training.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
              <p className="text-muted-foreground">Les formations seront bientôt disponibles.</p>
              <a href="https://sada.smartafrica.org" target="_blank" rel="noopener noreferrer" className="inline-block mt-4">
                <Button variant="outline" data-testid="button-empty-sada-programs">
                  Plateforme SADA
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Button>
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-programs-title">
              Rejoignez le SAYC Tchad
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto" data-testid="text-cta-programs-description">
              Participez à la transformation numérique du Tchad. Le SAYC est ouvert à tous les jeunes
              de 15 à 35 ans passionnés par la technologie et l'innovation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/rejoindre">
                <Button size="lg" variant="secondary" className="min-w-[200px]" data-testid="button-cta-join-programs">
                  Devenir membre
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground/30 text-primary-foreground" data-testid="button-cta-contact-programs">
                  Demander des informations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
