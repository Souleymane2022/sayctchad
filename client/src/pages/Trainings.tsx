import { useMemo } from "react";
import { Link, useRoute } from "wouter";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Training, Achievement } from "@shared/schema";
import {
  GraduationCap,
  Clock,
  Users,
  Award,
  ArrowRight,
  ExternalLink,
  BookOpen,
  TrendingUp,
  MapPin,
  Calendar,
  X
} from "lucide-react";

export default function Trainings() {
  const [match, params] = useRoute("/formations/:id");
  const detailId = params?.id;

  const { data: trainings = [], isLoading } = useQuery<Training[]>({
    queryKey: ["/api/trainings"],
  });

  const training = useMemo(() => 
    detailId ? trainings.find(t => t.id === detailId) : null
  , [detailId, trainings]);

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const seoData = useMemo(() => {
    if (training) {
      return {
        title: `${training.title} | Formation SAYC Tchad`,
        description: training.description.substring(0, 160),
        image: training.imageUrl || undefined,
        path: `/formations/${training.id}`
      };
    }
    return {
      title: "Formations SAYC Tchad | SADA, AWS, Cybersécurité, IA",
      description: "Accédez aux formations certifiantes de la Smart Africa Digital Academy (SADA) et de ses partenaires : AWS, cybersécurité, intelligence artificielle et compétences numériques.",
      path: "/formations"
    };
  }, [training]);

  const webPageJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seoData.title,
    description: seoData.description,
    url: `https://sayctchad.org${seoData.path}`,
    isPartOf: { "@type": "WebSite", name: "SAYC Tchad", url: "https://sayctchad.org" },
  }), [seoData]);

  if (training) {
    return (
      <div className="flex flex-col min-h-screen">
        <SEOHead
          title={seoData.title}
          description={seoData.description}
          image={seoData.image}
          path={seoData.path}
          jsonLd={webPageJsonLd}
        />
        <section className="pt-32 pb-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <Link href="/formations">
              <Button variant="ghost" className="mb-8 hover:bg-transparent p-0 flex items-center gap-2">
                <X className="w-4 h-4" />
                Retour au catalogue
              </Button>
            </Link>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                <div className="space-y-4">
                  {training.level && (
                    <Badge variant="outline" className="bg-primary/5">
                      {training.level}
                    </Badge>
                  )}
                  <h1 className="text-3xl md:text-5xl font-heading font-bold">{training.title}</h1>
                  <div className="flex flex-wrap gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span>{training.provider}</span>
                    </div>
                    {training.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>Dur&eacute;e : {training.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                {training.imageUrl && (
                  <div className="rounded-2xl overflow-hidden shadow-2xl bg-muted aspect-video">
                    <img 
                      src={training.imageUrl} 
                      alt={training.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {training.description}
                </div>
              </div>

              <div className="space-y-6">
                <Card className="border-2 border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-xl font-heading">Rejoindre la formation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {training.link ? (
                      <a href={training.link} target="_blank" rel="noopener noreferrer" className="block">
                        <Button className="w-full py-6 text-lg font-bold">
                          Acc&eacute;der maintenant
                          <ExternalLink className="ml-2 w-5 h-5" />
                        </Button>
                      </a>
                    ) : (
                       <Link href="/contact" className="block">
                        <Button className="w-full py-6 text-lg font-bold" variant="outline">
                          S'informer
                        </Button>
                      </Link>
                    )}
                    <p className="text-xs text-center text-muted-foreground">
                      D&eacute;veloppez vos comp&eacute;tences avec SAYC Tchad
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          navigator.share?.({
                            title: training.title,
                            text: training.description,
                            url: window.location.href
                          }).catch(() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Lien copi\u00e9 !");
                          });
                        }}
                      >
                        Partager
                      </Button>
                      <Link href="/contact">
                        <Button variant="outline" size="sm" className="w-full">
                          Aide
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader>
                    <CardTitle className="text-sm">Certificat inclus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">À la fin de ce programme, vous recevrez une certification reconnue par Smart Africa et ses partenaires.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        path={seoData.path}
        jsonLd={webPageJsonLd}
      />
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar to-sidebar/95 text-sidebar-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-12 left-16 w-28 h-28 border-2 border-sayc-teal/30 rounded-full" />
          <div className="absolute top-24 right-12 w-20 h-20 border-2 border-accent/30 rounded-full" />
          <div className="absolute bottom-20 left-1/3 w-16 h-16 bg-sayc-teal/20 rounded-full" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-6 bg-accent/20 text-accent border-accent/30" data-testid="badge-trainings-header">
              <GraduationCap className="w-3 h-3 mr-1" />
              SADA4Youth
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-trainings-title">
              Formations &{" "}
              <span className="text-accent">Programmes</span>
            </h1>
            <p className="text-lg text-sidebar-foreground/80 leading-relaxed mb-4" data-testid="text-trainings-description">
              Programmes certifiants de la Smart Africa Digital Academy (SADA) et de ses partenaires.
              Renforcez vos competences numeriques pour innover et etre competitifs dans l'economie mondiale.
            </p>
            <p className="text-sm text-sidebar-foreground/60 mb-8">
              Objectif SADA : Avoir un impact sur 100 millions de citoyens africains d'ici 2030
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://sada.smart.africa" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-accent text-accent-foreground border-accent-border" data-testid="button-trainings-sada">
                  Acceder a la plateforme SADA
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <Link href="/rejoindre">
                <Button size="lg" variant="outline" className="border-sidebar-foreground/20 text-sidebar-foreground" data-testid="button-trainings-join">
                  Rejoindre le SAYC
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {achievements.length > 0 && (
        <section className="py-12 bg-sidebar text-sidebar-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div key={achievement.id} className="text-center" data-testid={`stat-training-${index}`}>
                  <div className="font-heading text-2xl md:text-3xl font-bold text-accent mb-1">
                    {achievement.metricValue}
                  </div>
                  <div className="text-sidebar-foreground/70 text-sm">
                    {achievement.metricLabel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24">

        <div className="container mx-auto px-4 md:px-6">
          <Card className="mb-16 border-2 border-accent/20 bg-accent/5 overflow-hidden">
            <div className="grid md:grid-cols-3 gap-0">
              <div className="md:col-span-2 p-8 md:p-12">
                <Badge className="mb-4 bg-accent text-accent-foreground">Nouveau & Exclusif</Badge>
                <h3 className="text-3xl font-heading font-bold mb-4">Programme Thunderbird - Najafi 100 Million Learners</h3>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Rejoignez l'élite mondiale management et de l'innovation. Une opportunité unique pour
                  100 000 jeunes tchadiens de se former avec les meilleurs experts internationaux.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/programmes/thunderbird">
                    <Button size="lg" className="bg-accent text-accent-foreground">
                      Postuler à la cohorte
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex bg-sidebar items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-10 h-10 text-accent" />
                  </div>
                  <p className="text-sidebar-foreground font-bold">100 000</p>
                  <p className="text-sidebar-foreground/60 text-sm">Jeunes ciblés</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-catalog-title">
              Catalogue des Formations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-catalog-description">
              Formations certifiantes via la Smart Africa Digital Academy et ses partenaires internationaux.
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : trainings.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {trainings.map((training) => (
                <Card key={training.id} className="group hover-elevate transition-all overflow-hidden" data-testid={`card-training-${training.id}`}>
                  <div className="aspect-video w-full overflow-hidden bg-muted relative">
                    {training.imageUrl ? (
                      <img
                        src={training.imageUrl}
                        alt={training.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <GraduationCap className="w-12 h-12 text-primary/20" />
                      </div>
                    )}
                    {training.level && (
                      <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90">
                        {training.level}
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="font-heading text-xl group-hover:text-primary transition-colors">{training.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed line-clamp-2">
                      {training.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 flex-wrap gap-2">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {training.provider}
                      </span>
                      {training.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {training.duration}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                       <Link href={`/formations/${training.id}`} className="flex-1">
                        <Button variant="default" className="w-full" data-testid={`button-view-${training.id}`}>
                          D&eacute;tails
                        </Button>
                      </Link>
                      {training.link ? (
                        <a href={training.link} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" data-testid={`button-training-access-${training.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      ) : (
                        <Link href="/contact">
                          <Button variant="outline" data-testid={`button-training-info-${training.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
              <h3 className="font-heading text-xl font-bold mb-2">Formations à venir</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Notre catalogue de formations est en cours de préparation. En attendant, accédez aux formations sur la plateforme SADA.
              </p>
              <a href="https://sada.smart.africa" target="_blank" rel="noopener noreferrer">
                <Button data-testid="button-empty-sada">
                  Plateforme SADA
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Button>
              </a>
            </div>
          )}
        </div>
      </section >

      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-trainings-title">
              Accédez aux formations SADA
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto" data-testid="text-cta-trainings-description">
              Plus de 130 cours disponibles sur la plateforme SADA, incluant des cours de classe mondiale
              des universités internationales. Gratuit et accessible à tous.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://sada.smart.africa" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary" className="min-w-[200px]" data-testid="button-cta-sada">
                  Plateforme SADA
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground/30 text-primary-foreground" data-testid="button-cta-contact-trainings">
                  Demander des informations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div >
  );
}
