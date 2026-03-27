import { useMemo } from "react";
import { Link, useRoute } from "wouter";
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
  CalendarDays,
  X
} from "lucide-react";

export default function Events() {
  const [match, params] = useRoute("/evenements/:id");
  const detailId = params?.id;

  const { data: eventsList = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const event = useMemo(() => 
    detailId ? eventsList.find(e => e.id === detailId) : null
  , [detailId, eventsList]);

  const seoData = useMemo(() => {
    if (event) {
      return {
        title: `${event.title} | Événement SAYC Tchad`,
        description: event.description.substring(0, 160),
        image: event.imageUrl || undefined,
        path: `/evenements/${event.id}`
      };
    }
    return {
      title: "Événements SAYC Tchad | Activités et Rencontres",
      description: "Participez aux hackathons, bootcamps, conférences et ateliers organisés par le SAYC Tchad et Smart Africa pour développer vos compétences et élargir votre réseau.",
      path: "/evenements"
    };
  }, [event]);

  const webPageJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seoData.title,
    description: seoData.description,
    url: `https://sayctchad.org${seoData.path}`,
    isPartOf: { "@type": "WebSite", name: "SAYC Tchad", url: "https://sayctchad.org" },
  }), [seoData]);

  if (event) {
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
            <Link href="/evenements">
              <Button variant="ghost" className="mb-8 hover:bg-transparent p-0 flex items-center gap-2">
                <X className="w-4 h-4" />
                Retour aux &eacute;v&eacute;nements
              </Button>
            </Link>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                <div className="space-y-4">
                  <Badge variant="outline" className="bg-primary/5">
                    {event.type}
                  </Badge>
                  <h1 className="text-3xl md:text-5xl font-heading font-bold">{event.title}</h1>
                  <div className="flex flex-wrap gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-primary" />
                      <span>{event.date}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {event.imageUrl && (
                  <div className="rounded-2xl overflow-hidden shadow-2xl bg-muted aspect-video">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>

              <div className="space-y-6">
                <Card className="border-2 border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-xl font-heading">Participer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.registrationLink ? (
                      <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="block">
                        <Button className="w-full py-6 text-lg font-bold">
                          S'inscrire Maintenant
                          <ExternalLink className="ml-2 w-5 h-5" />
                        </Button>
                      </a>
                    ) : (
                       <Link href="/contact" className="block">
                        <Button className="w-full py-6 text-lg font-bold" variant="outline">
                          Plus d'informations
                        </Button>
                      </Link>
                    )}
                    <p className="text-xs text-center text-muted-foreground">
                      Ne manquez pas cet &eacute;v&eacute;nement !
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          navigator.share?.({
                            title: event.title,
                            text: event.description,
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
                          Contact
                        </Button>
                      </Link>
                    </div>
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
                  <CardContent className="p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row gap-0">
                      <div className="lg:w-72 h-48 lg:h-auto shrink-0 bg-muted relative overflow-hidden">
                        {event.imageUrl ? (
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5">
                            <CalendarDays className="w-12 h-12 text-primary/20" />
                          </div>
                        )}
                        <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90">
                          {event.type}
                        </Badge>
                      </div>
                      
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="font-heading text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>
                          
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={14} className="text-primary" />
                              {event.date}
                            </span>
                            {event.time && (
                              <span className="flex items-center gap-1.5">
                                <Clock size={14} className="text-primary" />
                                {event.time}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-primary" />
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-auto">
                          <Link href={`/evenements/${event.id}`} className="flex-1">
                            <Button size="sm" variant="default" className="w-full" data-testid={`button-view-${event.id}`}>
                              D&eacute;tails
                            </Button>
                          </Link>
                          {event.registrationLink ? (
                            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="shrink-0">
                              <Button size="sm" variant="outline" data-testid={`button-register-event-${event.id}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </a>
                          ) : (
                            <Link href="/contact" className="shrink-0">
                              <Button variant="outline" size="sm" data-testid={`button-info-event-${event.id}`}>
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                        </div>
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
