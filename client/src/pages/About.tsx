import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Target, 
  Eye, 
  Users, 
  GraduationCap,
  Briefcase,
  Globe,
  Heart
} from "lucide-react";

import galleryImg1 from "@assets/UniPod_Mamou_J3_95_1770104422778.JPG";
import galleryImg2 from "@assets/UniPod_Mamou_J2_48_1770104422783.JPG";
import galleryImg3 from "@assets/UniPod_Mamou_J2_21_1770104422785.JPG";
import galleryImg4 from "@assets/UniPod_Mamou_J2_15_1770104422788.JPG";
import galleryImg5 from "@assets/604871340_122096798553190973_93826767380244901_n_1770104422796.jpg";
import galleryImg6 from "@assets/607158151_122096792241190973_7868278716369897210_n_(1)_1770104422799.jpg";

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

const galleryImages = [
  { src: galleryImg1, alt: "Formation en cours" },
  { src: galleryImg2, alt: "Participants en formation" },
  { src: galleryImg3, alt: "Session de travail collaboratif" },
  { src: galleryImg4, alt: "Photo de groupe des participants" },
  { src: galleryImg5, alt: "Conférence Smart Africa" },
  { src: galleryImg6, alt: "Smart Africa Alliance" },
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
            <Badge variant="outline" className="mb-4" data-testid="badge-governance-tag">
              <Users className="w-3 h-3 mr-1" />
              Coordination Nationale
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-governance-title">
              Point Focal Tchad
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-governance-description">
              Le représentant officiel de Smart Africa Youth Chapter au Tchad.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-l-4 border-l-primary" data-testid="card-focal-point">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">Point Focal</Badge>
                </div>
                <CardTitle className="font-heading text-xl" data-testid="text-focal-point-name">
                  Souleymane Mahamat Saleh
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-2">
                  Chargé de coordonner les initiatives nationales du SAYC et d'assurer le lien avec le réseau continental Smart Africa.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4" data-testid="badge-gallery-tag">
              <Eye className="w-3 h-3 mr-1" />
              Nos Activités
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-gallery-title">
              En Images
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-gallery-description">
              Découvrez nos formations, événements et activités à travers l'Afrique.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-video overflow-hidden rounded-lg hover-elevate transition-all"
                data-testid={`img-gallery-${index}`}
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
