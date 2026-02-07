import { useMemo } from "react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@shared/schema";
import { 
  Calendar, 
  MapPin, 
  Clock,
  ArrowRight,
  ExternalLink,
  CalendarDays
} from "lucide-react";

export default function Events() {
  const { data: eventsList = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const webPageJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Événements SAYC Tchad",
    description: "Hackathons, bootcamps, conférences et ateliers organisés par le SAYC Tchad et Smart Africa.",
    url: `${window.location.origin}/evenements`,
    isPartOf: { "@type": "WebSite", name: "SAYC Tchad", url: window.location.origin },
  }), []);

  return (
    <div className="flex flex-col">
      <SEOHead
        title="Événements SAYC Tchad | Activités et Rencontres"
        description="Participez aux hackathons, bootcamps, conférences et ateliers organisés par le SAYC Tchad et Smart Africa pour développer vos compétences et élargir votre réseau."
        path="/evenements"
        jsonLd={webPageJsonLd}
      />
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar to-sidebar/95 text-sidebar-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-14 left-12 w-28 h-28 border-2 border-accent/30 rounded-full" />
          <div className="absolute bottom-20 right-16 w-24 h-24 border-2 border-sayc-teal/30 rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-14 h-14 bg-accent/20 rounded-full" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-6 bg-accent/20 text-accent border-accent/30" data-testid="badge-events-header">
              <Calendar className="w-3 h-3 mr-1" />
              SAYC Tchad
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-events-title">
              Nos{" "}
              <span className="text-accent">evenements</span>
            </h1>
            <p className="text-lg text-sidebar-foreground/80 leading-relaxed mb-8" data-testid="text-events-description">
              Participez aux hackathons, bootcamps, conferences et ateliers organises par le SAYC Tchad
              et Smart Africa pour developper vos competences et elargir votre reseau.
            </p>
            <Link href="/rejoindre">
              <Button size="lg" className="bg-accent text-accent-foreground border-accent-border" data-testid="button-events-join">
                Devenir membre
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <Badge variant="outline" className="mb-4" data-testid="badge-upcoming">
              <Calendar className="w-3 h-3 mr-1" />
              Événements
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-upcoming-title">
              Nos Événements
            </h2>
            <p className="text-muted-foreground max-w-xl" data-testid="text-upcoming-description">
              Découvrez les événements organisés par le SAYC Tchad et Smart Africa.
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      <Skeleton className="w-16 h-16 rounded-md" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-20 mb-2" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : eventsList.length > 0 ? (
            <div className="grid gap-6">
              {eventsList.map((event) => (
                <Card 
                  key={event.id} 
                  className="hover-elevate transition-all"
                  data-testid={`card-event-${event.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      <div className="w-16 h-16 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <CalendarDays className="w-8 h-8" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="secondary">
                            {event.type}
                          </Badge>
                        </div>
                        <h3 className="font-heading text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-primary" />
                            {event.date}
                          </span>
                          {event.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-primary" />
                              {event.time}
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-primary" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="lg:shrink-0">
                        {event.registrationLink ? (
                          <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                            <Button className="w-full lg:w-auto" data-testid={`button-register-event-${event.id}`}>
                              S'inscrire
                              <ExternalLink className="ml-1 h-4 w-4" />
                            </Button>
                          </a>
                        ) : (
                          <Link href="/contact">
                            <Button variant="outline" className="w-full lg:w-auto" data-testid={`button-info-event-${event.id}`}>
                              Plus d'infos
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <CalendarDays className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
              <h3 className="font-heading text-xl font-bold mb-2">Événements à venir</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Les prochains événements du SAYC Tchad seront annoncés bientôt.
                Rejoignez-nous pour ne rien manquer.
              </p>
              <Link href="/rejoindre">
                <Button data-testid="button-empty-join">
                  Devenir membre
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-events-title">
              Ne manquez aucun événement
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto" data-testid="text-cta-events-description">
              Rejoignez le SAYC Tchad pour être informé de nos prochains événements, 
              hackathons, bootcamps et conférences.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/rejoindre">
                <Button size="lg" variant="secondary" className="min-w-[200px]" data-testid="button-cta-join-events">
                  Devenir membre
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground/30 text-primary-foreground" data-testid="button-cta-contact-events">
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
