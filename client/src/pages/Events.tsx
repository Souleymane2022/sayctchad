import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock,
  Users,
  ChevronRight,
  ArrowRight,
  Rocket,
  Mic,
  Code,
  Globe
} from "lucide-react";

const upcomingEvents = [
  {
    title: "Hackathon Smart Cities Tchad 2026",
    date: "15-17 Mars 2026",
    time: "9h00 - 18h00",
    location: "N'Djamena, Centre de Conférences",
    type: "Hackathon",
    description: "48 heures intensives pour imaginer et développer des solutions innovantes pour les villes africaines de demain.",
    spots: "50 places",
    icon: Code,
    featured: true,
  },
  {
    title: "Demo Day Startups Q1 2026",
    date: "25 Avril 2026",
    time: "14h00 - 18h00",
    location: "N'Djamena, Hôtel Hilton",
    type: "Pitch",
    description: "Présentation des projets incubés du premier trimestre devant un panel d'investisseurs et de mentors.",
    spots: "100 places",
    icon: Rocket,
    featured: false,
  },
  {
    title: "Conférence AfricaTech 2026",
    date: "10-12 Mai 2026",
    time: "8h00 - 17h00",
    location: "N'Djamena, Palais des Congrès",
    type: "Conférence",
    description: "Rencontre annuelle des acteurs du numérique africain avec des speakers internationaux.",
    spots: "300 places",
    icon: Mic,
    featured: true,
  },
  {
    title: "Bootcamp Cybersécurité",
    date: "1-5 Juin 2026",
    time: "9h00 - 16h00",
    location: "N'Djamena, Campus SAYC",
    type: "Formation",
    description: "Formation intensive de 5 jours sur les fondamentaux de la cybersécurité.",
    spots: "20 places",
    icon: Globe,
    featured: false,
  },
];

const pastEvents = [
  {
    title: "Atelier Introduction au Cloud",
    date: "5 Janvier 2026",
    type: "Atelier",
    participants: "35 participants",
  },
  {
    title: "Meetup Développeurs Tchad",
    date: "20 Décembre 2025",
    type: "Meetup",
    participants: "60 participants",
  },
  {
    title: "Hackathon EdTech 2025",
    date: "10-12 Novembre 2025",
    type: "Hackathon",
    participants: "80 participants",
  },
];

export default function Events() {
  return (
    <div className="flex flex-col">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-muted/50 to-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6" data-testid="badge-events-header">
              <Calendar className="w-3 h-3 mr-1" />
              Événements
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-events-title">
              Nos{" "}
              <span className="text-primary">événements</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8" data-testid="text-events-description">
              Participez à nos hackathons, bootcamps, conférences et meetups pour développer 
              vos compétences et élargir votre réseau.
            </p>
            <Link href="/rejoindre">
              <Button size="lg" data-testid="button-events-join">
                Devenir membre
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <Badge variant="outline" className="mb-4" data-testid="badge-upcoming">
              <Calendar className="w-3 h-3 mr-1" />
              À venir
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-upcoming-title">
              Prochains Événements
            </h2>
            <p className="text-muted-foreground max-w-xl" data-testid="text-upcoming-description">
              Ne manquez pas nos prochains événements et inscrivez-vous dès maintenant.
            </p>
          </div>

          <div className="grid gap-6">
            {upcomingEvents.map((event, index) => (
              <Card 
                key={index} 
                className={`hover-elevate transition-all ${event.featured ? 'border-primary/50 shadow-lg' : ''}`}
                data-testid={`card-event-${index}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <event.icon className="w-8 h-8" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant={event.featured ? "default" : "secondary"}>
                          {event.type}
                        </Badge>
                        {event.featured && (
                          <Badge variant="outline" className="border-accent text-accent">
                            À ne pas manquer
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-2">{event.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{event.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-primary" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-primary" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-primary" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-primary" />
                          {event.spots}
                        </span>
                      </div>
                    </div>

                    <div className="lg:shrink-0">
                      <Button className="w-full lg:w-auto" data-testid={`button-register-event-${index}`}>
                        S'inscrire
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <Badge variant="outline" className="mb-4" data-testid="badge-past">
              <Calendar className="w-3 h-3 mr-1" />
              Passés
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-past-title">
              Événements Passés
            </h2>
            <p className="text-muted-foreground max-w-xl" data-testid="text-past-description">
              Découvrez nos événements précédents et leurs succès.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <Card key={index} className="hover-elevate transition-all" data-testid={`card-past-event-${index}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="secondary">{event.type}</Badge>
                    <span className="text-xs text-muted-foreground">{event.date}</span>
                  </div>
                  <CardTitle className="font-heading text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {event.participants}
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
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-events-title">
              Ne manquez aucun événement
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto" data-testid="text-cta-events-description">
              Inscrivez-vous à notre newsletter pour être informé de nos prochains événements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/rejoindre">
                <Button size="lg" variant="secondary" className="min-w-[200px]" data-testid="button-cta-join-events">
                  Devenir membre
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-cta-contact-events">
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
