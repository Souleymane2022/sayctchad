import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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

const galleryImages = [
  { src: galleryImg1, alt: "Formation en cours" },
  { src: galleryImg2, alt: "Participants en formation" },
  { src: galleryImg3, alt: "Session de travail collaboratif" },
  { src: galleryImg4, alt: "Photo de groupe des participants" },
  { src: galleryImg5, alt: "Conférence Smart Africa" },
  { src: galleryImg6, alt: "Smart Africa Alliance" },
];

export default function About() {
  const { t } = useTranslation();
  
  // Helper to ensure we always get a string for SEO/Props
  const v = (res: any, fallback: string) => typeof res === "string" ? res : fallback;

  const values = useMemo(() => [
    {
      icon: Heart,
      title: t("about.values.engagement.title"),
      description: t("about.values.engagement.desc"),
    },
    {
      icon: Users,
      title: t("about.values.inclusion.title"),
      description: t("about.values.inclusion.desc"),
    },
    {
      icon: Briefcase,
      title: t("about.values.excellence.title"),
      description: t("about.values.excellence.desc"),
    },
    {
      icon: Globe,
      title: t("about.values.ouverture.title"),
      description: t("about.values.ouverture.desc"),
    },
  ], [t]);

  const pillars = useMemo(() => [
    {
      icon: GraduationCap,
      title: t("about.pillars.engagement.title"),
      description: t("about.pillars.engagement.desc"),
    },
    {
      icon: Target,
      title: t("about.pillars.skills.title"),
      description: t("about.pillars.skills.desc"),
    },
    {
      icon: Briefcase,
      title: t("about.pillars.innovation.title"),
      description: t("about.pillars.innovation.desc"),
    },
  ], [t]);

  const { data: partnersList = [], isLoading: partnersLoading } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
  });

  const organizationJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `À propos de SAYC Tchad - ${t("common.about")}`,
    description: v(t("about.seo_desc"), "SAYC Tchad"),
    url: "https://sayctchad.org/a-propos",
    isPartOf: { "@type": "WebSite", name: "SAYC Tchad", url: "https://sayctchad.org" },
    mainEntity: {
      "@type": "Organization",
      name: "SAYC Tchad - Smart Africa Youth Chapter",
      foundingDate: "2024",
      founder: {
        "@type": "Person",
        "name": "Souleymane Mahamat Saleh",
        "jobTitle": v(t("about.focal_point_title"), "Point Focal National"),
        "image": [
          "https://sayctchad.org/images/souleymane-1.jpg",
          "https://sayctchad.org/images/souleymane-2.jpg",
          "https://sayctchad.org/images/souleymane-3.jpg"
        ],
        "description": v(t("about.focal_point_desc"), "Expert en Ingénierie Logicielle"),
        "knowsAbout": ["Software Engineering", "Digital Transformation", "Leadership", "Smart Africa", "Youth"],
        "sameAs": [
          "https://www.linkedin.com/in/souleymane-mahamat-saleh-559097359/",
          "https://github.com/Souleymane2022/",
          "https://www.facebook.com/souleymane.mhtsaleh"
        ]
      },
      parentOrganization: {
        "@type": "Organization",
        name: "Smart Africa Alliance",
        url: "https://smartafrica.org",
      },
      "sameAs": [
        "https://www.linkedin.com/company/smart-africa-youth-chapter-tchad/",
        "https://www.facebook.com/profile.php?id=61585729201040"
      ],
      contactPoint: {
        "@type": "ContactPoint",
        "contactType": v(t("about.focal_point_title"), "Point Focal National"),
        "name": "Souleymane Mahamat Saleh",
        "telephone": "+23566161753",
        "description": t("about.focal_point_desc"),
        "availableLanguage": ["fr", "ar", "en"]
      },
    },
  }), [t]);

  return (
    <div className="flex flex-col">
      <SEOHead
        title={`${v(t("common.about"), "À propos")} - SAYC Tchad` as any}
        description={v(t("about.seo_desc"), "SAYC Tchad, le 7ème chapitre jeunesse de Smart Africa au Tchad, dédié à l'autonomisation des jeunes par le numérique.") as any}
        path="/a-propos"
        keywords={v(t("about.seo_keywords"), "Souleymane Mahamat Saleh, Point Focal, SAYC Tchad, Smart Africa Youth Chapter, chapitre jeunesse") as any}
        jsonLd={organizationJsonLd}
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
              <Eye className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
              {t("about.hero_tag")}
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-about-title">
              {t("about.hero_title")}
            </h1>
            <p className="text-lg text-sidebar-foreground/80 leading-relaxed mb-4" data-testid="text-about-description">
              {t("about.hero_desc")}
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
                <Eye className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
                {t("about.vision_tag")}
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" data-testid="text-vision-title">
                {t("about.vision_title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6" data-testid="text-vision-description">
                {t("about.vision_desc")}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t("about.vision_desc_long")}
              </p>
              <Link href="/programmes">
                <Button data-testid="button-vision-programs">
                  {t("common.learn_more")}
                  <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
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
              {t("home.pillars_tag", { defaultValue: t("home.objectives_tag") })}
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-pillars-title">
              {t("about.pillars_title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-pillars-description">
              {t("home.objectives_desc")}
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
              {t("about.values_title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-values-description">
              {t("about.values.inclusion.desc")}
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
              {t("home.initiatives_tag")}
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-governance-title">
              {t("about.focal_point_title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-governance-description">
              {t("about.focal_point_desc")}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card data-testid="card-focal-point">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">{t("about.focal_point_title")}</Badge>
                </div>
                <CardTitle className="font-heading text-2xl" data-testid="text-focal-point-name">
                  Souleymane Mahamat Saleh
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-2">
                  {t("about.focal_point_desc")}
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
              {t("home.gallery_tag")}
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-gallery-title">
              {t("home.gallery_title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-gallery-description">
              {t("home.gallery_desc")}
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
                {t("home.partners_tag")}
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-about-partners-title">
                {t("home.partners_title")}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t("home.partners_desc")}
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
                          {t("common.visit_site")}
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
              {t("home.initiatives_title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-smart-africa-about-description">
              {t("home.initiatives_desc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start mb-10">
            <div>
              <h3 className="font-heading text-xl font-semibold mb-4">
                {t("home.initiatives.alliance.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("home.initiatives.alliance.desc")}
              </p>
              <a href="https://smartafrica.org/fr/page-daccueil/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" data-testid="button-about-visit-sa">
                  {t("common.visit_site")} smartafrica.org
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
                      <a href="https://sada.smart.africa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        {t("home.initiatives.sada.title")} <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </a>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {t("home.initiatives.sada.desc")}
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
                        {t("home.initiatives.tas.title")} <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </a>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {t("home.initiatives.tas.desc")}
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
                        {t("home.blueprints")} <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </a>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {t("about.hero_tag")}
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
              {t("home.cta_title")}
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto" data-testid="text-cta-description">
              {t("home.cta_desc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/rejoindre">
                <Button size="lg" variant="secondary" className="min-w-[200px]" data-testid="button-cta-join">
                  {t("hero.cta_join")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground/30 text-primary-foreground" data-testid="button-cta-contact">
                  {t("common.contact_us")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
