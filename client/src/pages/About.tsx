import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowRight, 
  Target, 
  Eye, 
  Users, 
  GraduationCap,
  Briefcase,
  Globe,
  Heart,
  ChevronRight
} from "lucide-react";

const focalPoint = {
  name: "Souleymane Mahamat Saleh",
  role: "Point Focal Tchad",
  initials: "SMS",
};

const team = [
  {
    name: "Dr. Moussa Ibrahim",
    role: "Président",
    initials: "MI",
  },
  {
    name: "Fatima Abakar",
    role: "Vice-Présidente",
    initials: "FA",
  },
  {
    name: "Hassan Djibrine",
    role: "Secrétaire Général",
    initials: "HD",
  },
  {
    name: "Mariam Oumar",
    role: "Trésorière",
    initials: "MO",
  },
  {
    name: "Youssouf Ali",
    role: "Resp. Communication",
    initials: "YA",
  },
  {
    name: "Adèle Ngarmbaye",
    role: "Resp. Programmes",
    initials: "AN",
  },
];

const values = [
  {
    icon: Heart,
    title: "Engagement",
    description: "Nous nous engageons pleinement pour le développement numérique de la jeunesse tchadienne.",
  },
  {
    icon: Users,
    title: "Inclusion",
    description: "Nous croyons en l'accès égal aux opportunités numériques pour tous les jeunes.",
  },
  {
    icon: Briefcase,
    title: "Excellence",
    description: "Nous visons l'excellence dans tous nos programmes et initiatives.",
  },
  {
    icon: Globe,
    title: "Ouverture",
    description: "Nous favorisons les échanges et la collaboration au niveau continental.",
  },
];

const pillars = [
  {
    icon: GraduationCap,
    title: "Engagement des jeunes dans les politiques numériques",
    description: "Impliquer les jeunes dans la conception et la mise en œuvre des politiques numériques au Tchad.",
  },
  {
    icon: Target,
    title: "Renforcement des compétences numériques",
    description: "Programmes de formation pour développer les compétences techniques et digitales des jeunes.",
  },
  {
    icon: Briefcase,
    title: "Compétences entrepreneuriales & innovation",
    description: "Accompagnement des jeunes entrepreneurs dans le développement de solutions innovantes.",
  },
  {
    icon: Globe,
    title: "Réseau & collaboration continentale",
    description: "Connexion avec les chapitres Smart Africa pour favoriser les échanges et opportunités.",
  },
];

export default function About() {
  return (
    <div className="flex flex-col">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-muted/50 to-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6" data-testid="badge-about-tag">
              <Eye className="w-3 h-3 mr-1" />
              À propos de nous
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-about-title">
              Le Chapitre Jeunes de{" "}
              <span className="text-primary">Smart Africa</span> au Tchad
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-about-description">
              Le Smart Africa Youth Chapter – Tchad est une plateforme dédiée aux jeunes de 15 à 35 ans, 
              axée sur l'éducation, la collaboration, le mentorat et l'innovation, afin de renforcer le leadership, 
              stimuler l'innovation et activer la collaboration au service de la transformation numérique.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4" data-testid="badge-vision-tag">
                <Eye className="w-3 h-3 mr-1" />
                Notre Vision
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" data-testid="text-vision-title">
                Transformer l'Afrique par la jeunesse et l'innovation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6" data-testid="text-vision-description">
                Inspirer une nouvelle génération de jeunes Africains à utiliser la technologie et l'innovation 
                pour transformer l'Afrique, créer des opportunités, renforcer la solidarité régionale et bâtir 
                un avenir durable.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Notre vision est de faire du Tchad un hub d'innovation numérique où chaque jeune a accès 
                aux compétences et ressources nécessaires pour réussir dans l'économie digitale.
              </p>
              <Link href="/programmes">
                <Button data-testid="button-vision-programs">
                  Découvrir nos programmes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="w-3/4 h-3/4 rounded-xl bg-card border shadow-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <Target className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="font-heading text-xl font-bold mb-2">15-35 ans</h3>
                    <p className="text-muted-foreground text-sm">
                      Notre cible principale pour l'éducation et l'autonomisation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4" data-testid="badge-pillars-tag">
              <Target className="w-3 h-3 mr-1" />
              Nos Piliers
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-pillars-title">
              Les 4 Piliers du SAYC
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-pillars-description">
              Notre action repose sur quatre piliers fondamentaux pour accompagner les jeunes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((pillar, index) => (
              <Card key={index} className="hover-elevate transition-all" data-testid={`card-pillar-${index}`}>
                <CardHeader className="flex flex-row items-start gap-4 pb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <pillar.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-lg mb-2">{pillar.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {pillar.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4" data-testid="badge-values-tag">
              <Heart className="w-3 h-3 mr-1" />
              Nos Valeurs
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-values-title">
              Ce qui nous guide
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-values-description">
              Nos valeurs fondamentales orientent chacune de nos actions et décisions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover-elevate transition-all" data-testid={`card-value-${index}`}>
                <CardHeader className="pb-3">
                  <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="font-heading text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {value.description}
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
            <Badge variant="outline" className="mb-4" data-testid="badge-team-tag">
              <Users className="w-3 h-3 mr-1" />
              Gouvernance
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-team-title">
              Notre Équipe
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-team-description">
              Des leaders engagés pour le développement numérique de la jeunesse tchadienne.
            </p>
          </div>

          <Card className="mb-8 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground" data-testid="card-focal-point">
            <CardHeader className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <Avatar className="w-24 h-24 border-4 border-accent">
                <AvatarFallback className="bg-accent text-accent-foreground text-2xl font-heading font-bold">
                  {focalPoint.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <Badge className="mb-2 bg-accent text-accent-foreground">{focalPoint.role}</Badge>
                <CardTitle className="font-heading text-2xl text-primary-foreground" data-testid="text-focal-point-name">
                  {focalPoint.name}
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 mt-2">
                  Représentant officiel de Smart Africa Youth Chapter au Tchad, chargé de coordonner les initiatives nationales et de faire le lien avec le réseau continental.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover-elevate transition-all" data-testid={`card-team-${index}`}>
                <CardHeader className="pb-4">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-heading font-bold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="font-heading text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-accent font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-title">
              Envie de faire partie de l'aventure?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto" data-testid="text-cta-description">
              Rejoignez le SAYC Tchad et contribuez à la transformation numérique de notre pays.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/rejoindre">
                <Button size="lg" variant="secondary" className="min-w-[200px]" data-testid="button-cta-join">
                  Rejoindre le SAYC
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
