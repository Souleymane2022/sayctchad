import { Link } from "wouter";
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
  TrendingUp
} from "lucide-react";

export default function Trainings() {
  const { data: trainings = [], isLoading } = useQuery<Training[]>({
    queryKey: ["/api/trainings"],
  });

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  return (
    <div className="flex flex-col">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-muted/50 to-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6" data-testid="badge-trainings-header">
              <GraduationCap className="w-3 h-3 mr-1" />
              SADA4Youth
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-trainings-title">
              Formations &{" "}
              <span className="text-primary">Programmes</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4" data-testid="text-trainings-description">
              Programmes certifiants de la Smart Africa Digital Academy (SADA) et de ses partenaires.
              Renforcez vos compétences numériques pour innover et être compétitifs dans l'économie mondiale.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Objectif SADA : Avoir un impact sur 100 millions de citoyens africains d'ici 2030
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://sada.smartafrica.org" target="_blank" rel="noopener noreferrer">
                <Button size="lg" data-testid="button-trainings-sada">
                  Accéder à la plateforme SADA
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <Link href="/rejoindre">
                <Button size="lg" variant="outline" data-testid="button-trainings-join">
                  Rejoindre le SAYC
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
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
                <Card key={training.id} className="hover-elevate transition-all" data-testid={`card-training-${training.id}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                      <div className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <GraduationCap className="w-7 h-7" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        {training.level && (
                          <Badge variant="outline" className="text-xs">
                            {training.level}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="font-heading text-xl">{training.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
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
                    {training.link ? (
                      <a href={training.link} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full" data-testid={`button-training-access-${training.id}`}>
                          Accéder à la formation
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </Button>
                      </a>
                    ) : (
                      <Link href="/contact">
                        <Button variant="outline" className="w-full" data-testid={`button-training-info-${training.id}`}>
                          Demander des informations
                        </Button>
                      </Link>
                    )}
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
              <a href="https://sada.smartafrica.org" target="_blank" rel="noopener noreferrer">
                <Button data-testid="button-empty-sada">
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
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-trainings-title">
              Accédez aux formations SADA
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto" data-testid="text-cta-trainings-description">
              Plus de 130 cours disponibles sur la plateforme SADA, incluant des cours de classe mondiale
              des universités internationales. Gratuit et accessible à tous.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://sada.smartafrica.org" target="_blank" rel="noopener noreferrer">
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
    </div>
  );
}
