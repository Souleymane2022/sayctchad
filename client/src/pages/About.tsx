import { useMemo } from "react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Partner } from "@shared/schema";
import {
  ArrowRight,
  Target,
  Eye,
  Users,
  GraduationCap,
  Briefcase,
  Globe,
  Heart,
  ExternalLink,
  Rocket,
  Building2,
  Link as LinkIcon
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
    description: "Encourager la participation des jeunes dans l'élaboration des politiques numériques. Plaider pour des politiques inclusives et centrées sur les jeunes.",
  },
  {
    icon: Target,
    title: "Renforcement des compétences numériques",
    description: "Déployer des formations nationales et régionales en compétences numériques de base et avancées. Fournir des parcours de certification alignés sur les besoins du marché.",
  },
  {
    icon: Briefcase,
    title: "Compétences entrepreneuriales & innovation",
    description: "Organiser des bootcamps, concours de pitchs locaux et internationaux. Faciliter l'accès au financement et à l'accompagnement.",
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
  const { data: partnersList = [], isLoading: partnersLoading } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
  });

  const webPageJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "À propos de SAYC Tchad",
    description: "Découvrez SAYC Tchad, le 7ème chapitre jeunesse de Smart Africa Alliance. Point Focal National : Souleymane Mahamat Saleh. Missions, valeurs et piliers stratégiques pour la jeunesse tchadienne.",
    url: "https://sayctchad.org/a-propos",
    isPartOf: { "@type": "WebSite", name: "SAYC Tchad", url: "https://sayctchad.org" },
    mainEntity: {
      "@type": "Organization",
      name: "SAYC Tchad - Smart Africa Youth Chapter",
      foundingDate: "2024",
      founder: {
        "@type": "Person",
        "name": "Souleymane Mahamat Saleh",
        "jobTitle": "Point Focal National SAYC Tchad",
        "sameAs": [
          "https://www.linkedin.com/company/110439974/"
        ]
      },
      parentOrganization: {
        "@type": "Organization",
        name: "Smart Africa Alliance",
        url: "https://smartafrica.org",
      },
      contactPoint: {
        "@type": "ContactPoint",
        "contactType": "Point Focal National",
        "name": "Souleymane Mahamat Saleh",
        "description": "Représentant officiel et coordinateur national du Smart Africa Youth Chapter au Tchad",
        "availableLanguage": ["fr", "ar"]
      },
    },
  }), []);

  return (
    <div className="flex flex-col">
      <SEOHead
        title="À propos de SAYC Tchad | 7ème Chapitre Jeunesse de Smart Africa"
        description="SAYC Tchad, le 7ème chapitre jeunesse de Smart Africa Alliance au Tchad. Point Focal National : Souleymane Mahamat Saleh. Éducation, collaboration et innovation numérique pour les jeunes de 15 à 35 ans."
        path="/a-propos"
        keywords="Souleymane Mahamat Saleh, Point Focal, SAYC Tchad, Smart Africa Youth Chapter, chapitre jeunesse"
        jsonLd={webPageJsonLd}
      />
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar to-sidebar/95 text-sidebar-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-accent/30 rounded-full" />
          <div className="absolute top-20 right-20 w-24 h-24 border-2 border-sayc-teal/30 rounded-full" />
          <div className="absolute bottom-16 left-1/4 w-16 h-16 bg-accent/20 rounded-full" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-6 bg-accent/20 text-accent border-accent/30" data-testid="badge-about-tag">
              <Eye className="w-3 h-3 mr-1" />
              A propos de nous
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-about-title">
              Le Chapitre Jeunesse de{" "}
              <span className="text-accent">Smart Africa</span> au Tchad
            </h1>
            <p className="text-lg text-sidebar-foreground/80 leading-relaxed mb-4" data-testid="text-about-description">
              Le Smart Africa Youth Chapter - Tchad (SAYC Tchad) est la branche jeunesse de{" "}
              <a href="https://smartafrica.org" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
                Smart Africa Alliance
              </a>
              {" "}au Tchad. C'est une plateforme dediee aux jeunes de 15 a 35 ans,
              axee sur l'education, la collaboration, le mentorat et l'innovation numerique.
            </p>
            <p className="text-sidebar-foreground/70 leading-relaxed" data-testid="text-about-description-2">
              En tant que chapitre national, le SAYC Tchad travaille en coordination avec Smart Africa
              pour renforcer le leadership des jeunes, stimuler l'innovation et activer la collaboration
              au service de la transformation numerique du continent africain.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
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
              Les 3 Piliers du SAYC
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-pillars-description">
              Notre action repose sur trois piliers fondamentaux pour accompagner les jeunes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
              Point Focal National SAYC Tchad
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-governance-description">
              Le représentant officiel et coordinateur national du Smart Africa Youth Chapter au Tchad.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card data-testid="card-focal-point">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">Point Focal National</Badge>
                </div>
                <CardTitle className="font-heading text-2xl" data-testid="text-focal-point-name">
                  Souleymane Mahamat Saleh
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-2">
                  Souleymane Mahamat Saleh est le Point Focal National du Smart Africa Youth Chapter Tchad (SAYC Tchad). Il est le représentant officiel du 7ème chapitre jeunesse de Smart Africa Alliance au Tchad. Basé à N'Djamena, il coordonne l'ensemble des initiatives nationales, les programmes de formation en compétences numériques, et assure la liaison avec le réseau continental Smart Africa et ses partenaires stratégiques.
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

      {(partnersLoading || partnersList.length > 0) && (
        <section className="py-16 md:py-24 bg-muted/30" data-testid="section-about-partners">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4" data-testid="badge-about-partners-tag">
                <LinkIcon className="w-3 h-3 mr-1" />
                Partenaires
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-about-partners-title">
                Nos Partenaires
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Les organisations qui soutiennent le développement numérique de la jeunesse au Tchad.
              </p>
            </div>

            {partnersLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="text-center">
                    <CardHeader>
                      <Skeleton className="w-16 h-16 rounded-lg mx-auto mb-3" />
                      <Skeleton className="h-5 w-3/4 mx-auto" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-2/3 mx-auto" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {partnersList.map((partner) => (
                  <Card key={partner.id} className="hover-elevate transition-all text-center" data-testid={`card-about-partner-${partner.id}`}>
                    <CardHeader className="pb-3">
                      {partner.logoUrl ? (
                        <img src={partner.logoUrl} alt={partner.name} className="h-16 w-auto mx-auto mb-3 object-contain" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                          <Building2 className="w-8 h-8" />
                        </div>
                      )}
                      <CardTitle className="font-heading text-base">{partner.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {partner.description && (
                        <CardDescription className="text-xs leading-relaxed mb-3">
                          {partner.description.length > 100 ? partner.description.slice(0, 100) + "..." : partner.description}
                        </CardDescription>
                      )}
                      {partner.websiteUrl && (
                        <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary text-xs font-medium">
                          Visiter
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4" data-testid="badge-smart-africa-about-tag">
              <Globe className="w-3 h-3 mr-1" />
              Smart Africa
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-smart-africa-about-title">
              Notre Organisation M&egrave;re
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-smart-africa-about-description">
              Smart Africa est une alliance panafricaine dont la vision est de transformer l'Afrique en un
              march&eacute; num&eacute;rique unique. Le SAYC Tchad est son chapitre jeunesse au Tchad.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start mb-10">
            <div>
              <h3 className="font-heading text-xl font-semibold mb-4">
                &Agrave; propos de Smart Africa Alliance
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Smart Africa est un engagement audacieux pris par les chefs d'&Eacute;tat et de gouvernement
                africains pour acc&eacute;l&eacute;rer la transformation socio-&eacute;conomique durable du continent
                gr&acirc;ce aux technologies de l'information et de la communication (TIC).
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                L'alliance r&eacute;unit 40 &Eacute;tats membres et travaille avec le secteur priv&eacute; et les
                organisations internationales pour connecter, innover et transformer l'Afrique.
              </p>
              <a href="https://smartafrica.org/fr/page-daccueil/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" data-testid="button-about-visit-sa">
                  Visiter smartafrica.org
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Button>
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Card className="hover-elevate" data-testid="card-sa-sada">
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  <div className="w-10 h-10 rounded-lg bg-sayc-teal/10 text-sayc-teal flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base mb-1">
                      <a href="https://sada.smartafrica.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        SADA - Acad&eacute;mie Num&eacute;rique <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </a>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Formations certifiantes en comp&eacute;tences num&eacute;riques pour les jeunes africains.
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
              <Card className="hover-elevate" data-testid="card-sa-tas">
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base mb-1">
                      <a href="https://transformafricasummit.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        Transform Africa Summit <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </a>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Le sommet annuel pour acc&eacute;l&eacute;rer la transformation digitale de l'Afrique.
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
              <Card className="hover-elevate" data-testid="card-sa-blueprints">
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base mb-1">
                      <a href="https://smartafrica.org/blueprint/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        Plans Directeurs <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </a>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Strat&eacute;gies sectorielles pour le d&eacute;veloppement num&eacute;rique africain.
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>
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
                <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground/30 text-primary-foreground" data-testid="button-cta-contact">
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
