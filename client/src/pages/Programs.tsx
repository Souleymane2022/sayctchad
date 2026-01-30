import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  GraduationCap, 
  Rocket, 
  Code,
  Shield,
  Cloud,
  Users,
  Briefcase,
  Globe,
  Calendar,
  Clock,
  ChevronRight,
  Target
} from "lucide-react";

const mainPrograms = [
  {
    icon: GraduationCap,
    title: "Formations Numériques",
    description: "Programmes intensifs de renforcement des compétences en technologies de l'information, développement web, mobile et data science.",
    features: ["Certifications reconnues", "Formateurs experts", "Projets pratiques"],
    duration: "3-6 mois",
    badge: "Populaire",
  },
  {
    icon: Rocket,
    title: "Programme d'Incubation",
    description: "Accompagnement complet des jeunes entrepreneurs dans le développement et le lancement de leurs startups technologiques.",
    features: ["Mentorat personnalisé", "Accès aux investisseurs", "Espace de travail"],
    duration: "6-12 mois",
    badge: "Nouveau",
  },
  {
    icon: Code,
    title: "Bootcamps Techniques",
    description: "Formations intensives sur des technologies spécifiques : développement web, mobile, intelligence artificielle, blockchain.",
    features: ["Format intensif", "Projets réels", "Certification"],
    duration: "4-8 semaines",
    badge: null,
  },
  {
    icon: Briefcase,
    title: "Entrepreneuriat Digital",
    description: "Programme de développement des compétences entrepreneuriales adaptées à l'économie numérique africaine.",
    features: ["Business planning", "Pitch training", "Networking"],
    duration: "3 mois",
    badge: null,
  },
];

const specializations = [
  {
    icon: Code,
    title: "Développement Web & Mobile",
    description: "Apprenez à créer des applications web et mobiles modernes.",
    level: "Débutant à Avancé",
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    description: "Maîtrisez les technologies cloud et l'infrastructure moderne.",
    level: "Intermédiaire",
  },
  {
    icon: Shield,
    title: "Cybersécurité",
    description: "Protégez les systèmes et données contre les menaces numériques.",
    level: "Intermédiaire à Avancé",
  },
  {
    icon: Target,
    title: "Data Science & IA",
    description: "Explorez l'analyse de données et l'intelligence artificielle.",
    level: "Avancé",
  },
];

const events = [
  {
    title: "Hackathon Smart Cities 2026",
    date: "15-17 Mars 2026",
    type: "Hackathon",
    description: "48 heures pour créer des solutions innovantes pour les villes africaines.",
  },
  {
    title: "Demo Day Startups",
    date: "25 Avril 2026",
    type: "Pitch",
    description: "Présentation des projets incubés devant un panel d'investisseurs.",
  },
  {
    title: "Conférence AfricaTech",
    date: "10-12 Mai 2026",
    type: "Conférence",
    description: "Rencontre annuelle des acteurs du numérique africain.",
  },
];

export default function Programs() {
  return (
    <div className="flex flex-col">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-muted/50 to-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6" data-testid="badge-programs-header">
              <Rocket className="w-3 h-3 mr-1" />
              Programmes & Formations
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-programs-title">
              Développez vos{" "}
              <span className="text-primary">compétences numériques</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8" data-testid="text-programs-description">
              Découvrez nos programmes de formation et d'accompagnement conçus pour préparer 
              les jeunes Tchadiens aux métiers du numérique et de l'innovation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/formations">
                <Button size="lg" data-testid="button-view-trainings">
                  Voir les formations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" data-testid="button-contact-programs">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4" data-testid="badge-main-programs">
              <GraduationCap className="w-3 h-3 mr-1" />
              Programmes Principaux
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-main-programs-title">
              Nos Programmes Phares
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-main-programs-description">
              Des programmes structurés pour accompagner votre parcours vers l'excellence numérique.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {mainPrograms.map((program, index) => (
              <Card key={index} className="hover-elevate transition-all" data-testid={`card-main-program-${index}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <program.icon className="w-7 h-7" />
                    </div>
                    <div className="flex items-center gap-2">
                      {program.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {program.badge}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {program.duration}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="font-heading text-xl">{program.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {program.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {program.features.map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full" data-testid={`button-program-details-${index}`}>
                    En savoir plus
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4" data-testid="badge-specializations">
              <Code className="w-3 h-3 mr-1" />
              Spécialisations
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-specializations-title">
              Domaines de Spécialisation
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-specializations-description">
              Choisissez votre domaine d'expertise parmi nos spécialisations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specializations.map((spec, index) => (
              <Card key={index} className="text-center hover-elevate transition-all cursor-pointer group" data-testid={`card-specialization-${index}`}>
                <CardHeader className="pb-3">
                  <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <spec.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="font-heading text-lg">{spec.title}</CardTitle>
                  <Badge variant="outline" className="text-xs mt-2">
                    {spec.level}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {spec.description}
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
              <Badge variant="outline" className="mb-4" data-testid="badge-events">
                <Calendar className="w-3 h-3 mr-1" />
                Événements
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-events-title">
                Prochains Événements
              </h2>
              <p className="text-muted-foreground max-w-xl" data-testid="text-events-description">
                Hackathons, bootcamps et conférences pour dynamiser votre parcours.
              </p>
            </div>
            <Link href="/evenements">
              <Button variant="outline" className="shrink-0" data-testid="button-view-all-events">
                Tous les événements
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <Card key={index} className="hover-elevate transition-all cursor-pointer group" data-testid={`card-event-${index}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {event.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {event.date}
                    </span>
                  </div>
                  <CardTitle className="font-heading text-lg group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {event.description}
                  </CardDescription>
                  <Button variant="link" className="p-0 mt-4 h-auto text-primary" data-testid={`button-event-register-${index}`}>
                    S'inscrire
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-programs-title">
              Prêt à développer vos compétences?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto" data-testid="text-cta-programs-description">
              Inscrivez-vous à nos programmes et rejoignez une communauté de jeunes innovateurs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/formations">
                <Button size="lg" variant="secondary" className="min-w-[200px]" data-testid="button-cta-trainings">
                  S'inscrire aux formations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-cta-contact-programs">
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
