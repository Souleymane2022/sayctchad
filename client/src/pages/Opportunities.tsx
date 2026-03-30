import { useMemo, useEffect } from "react";
import { Link, useRoute } from "wouter";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Opportunity } from "@shared/schema";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  ExternalLink,
  GraduationCap,
  MapPin,
  FileText,
  Users,
  Building2,
  Filter,
  Clock,
  Rocket,
  X
} from "lucide-react";
import { useState } from "react";

const categoryConfig: Record<string, { icon: typeof Briefcase; colorClass: string }> = {
  "Formation": { icon: GraduationCap, colorClass: "bg-primary/10 text-primary" },
  "Bourse": { icon: GraduationCap, colorClass: "bg-sayc-teal/10 text-sayc-teal" },
  "Appel d'offres": { icon: FileText, colorClass: "bg-accent/10 text-accent" },
  "Incubation": { icon: Building2, colorClass: "bg-primary/10 text-primary" },
  "Recrutement": { icon: Users, colorClass: "bg-accent/10 text-accent" },
};

const categoryBadgeVariant = (category: string): string => {
  switch (category) {
    case "Formation": return "bg-primary/10 text-primary border-primary/20";
    case "Bourse": return "bg-sayc-teal/10 text-sayc-teal border-sayc-teal/20";
    case "Appel d'offres": return "bg-accent/10 text-accent border-accent/20";
    case "Incubation": return "bg-primary/10 text-primary border-primary/20";
    case "Recrutement": return "bg-accent/10 text-accent border-accent/20";
    default: return "";
  }
};

export default function Opportunities() {
  const [match, params] = useRoute("/opportunites/:id");
  const detailId = params?.id;
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");

  // Scroll to top on mount or when detailId changes (with timeout for mobile Safari/Chrome behavior)
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timer);
  }, [detailId]);

  const { data: opportunities = [], isLoading } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities"],
  });

  const opportunity = useMemo(() => 
    detailId ? opportunities.find(o => o.id === detailId) : null
  , [detailId, opportunities]);

  const categories = ["Tous", ...Array.from(new Set(opportunities.map((o) => o.category)))];

  const filtered = selectedCategory === "Tous"
    ? opportunities
    : opportunities.filter((o) => o.category === selectedCategory);

  const stats = [
    { label: "Opportunit\u00e9s actives", value: opportunities.length.toString(), icon: Briefcase },
    { label: "Cat\u00e9gories", value: new Set(opportunities.map(o => o.category)).size.toString(), icon: Filter },
    { label: "Organisations", value: new Set(opportunities.map(o => o.organization)).size.toString(), icon: Building2 },
  ];

  const seoData = useMemo(() => {
    if (opportunity) {
      return {
        title: `${opportunity.title} | Opportunité SAYC Tchad`,
        description: opportunity.description.substring(0, 160),
        image: opportunity.imageUrl || undefined,
        path: `/opportunites/${opportunity.id}`
      };
    }
    return {
      title: "Opportunités SAYC Tchad | Appels d'offres Smart Africa",
      description: "Découvrez les opportunités de formation, bourses, appels d'offres, recrutement et incubation disponibles via Smart Africa et le SAYC Tchad pour les jeunes tchadiens.",
      path: "/opportunites"
    };
  }, [opportunity]);

  const webPageJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seoData.title,
    description: seoData.description,
    url: `https://sayctchad.org${seoData.path}`,
    isPartOf: { "@type": "WebSite", name: "SAYC Tchad", url: "https://sayctchad.org" },
  }), [seoData]);

  if (opportunity) {
    const config = categoryConfig[opportunity.category] || { icon: Briefcase, colorClass: "bg-muted text-muted-foreground" };
    const IconComponent = config.icon;

    return (
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
        <SEOHead
          title={seoData.title}
          description={seoData.description}
          image={seoData.image}
          path={seoData.path}
          jsonLd={webPageJsonLd}
        />
        <section className="pt-24 md:pt-32 pb-12 md:pb-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <Link href="/opportunites">
              <Button variant="ghost" className="mb-8 hover:bg-transparent p-0 flex items-center gap-2">
                <X className="w-4 h-4" />
                Retour aux opportunit&eacute;s
              </Button>
            </Link>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                <div className="space-y-4">
                  <Badge variant="outline" className={categoryBadgeVariant(opportunity.category)}>
                    {opportunity.category}
                  </Badge>
                  <h1 className="text-3xl md:text-5xl font-heading font-bold">{opportunity.title}</h1>
                  <div className="flex flex-wrap gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      <span>{opportunity.organization}</span>
                    </div>
                    {opportunity.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{opportunity.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>Date limite : {opportunity.deadline}</span>
                    </div>
                  </div>
                </div>

                {opportunity.imageUrl && (
                  <div className="rounded-2xl overflow-hidden shadow-2xl bg-muted aspect-video">
                    <img 
                      src={opportunity.imageUrl} 
                      alt={opportunity.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {opportunity.description}
                </div>
              </div>

              <div className="space-y-6">
                <Card className="border-2 border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-xl font-heading">Int&eacute;ress&eacute; ?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {opportunity.link && (
                      <a href={opportunity.link} target="_blank" rel="noopener noreferrer" className="block">
                        <Button className="w-full py-6 text-lg font-bold">
                          Postuler Maintenant
                          <ExternalLink className="ml-2 w-5 h-5" />
                        </Button>
                      </a>
                    )}
                    <p className="text-xs text-center text-muted-foreground">
                      Partagez cette opportunit&eacute; avec votre r&eacute;seau
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          navigator.share?.({
                            title: opportunity.title,
                            text: opportunity.description,
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
    <div className="flex flex-col w-full overflow-x-hidden">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        path={seoData.path}
        jsonLd={webPageJsonLd}
      />
      <section className="relative py-12 md:py-28 bg-[#1E3A5F] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-accent/30 rounded-full" />
          <div className="absolute top-20 right-20 w-24 h-24 border-2 border-sayc-teal/30 rounded-full" />
          <div className="absolute bottom-16 left-1/4 w-16 h-16 bg-accent/20 rounded-full" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-6 bg-accent/20 text-accent border-accent/30" data-testid="badge-opportunities-tag">
              <Briefcase className="w-3 h-3 mr-1" />
              Appels d'offres & Opportunit&eacute;s
            </Badge>
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-6 break-words" data-testid="text-opportunities-title">
              Opportunit&eacute;s &{" "}
              <span className="text-accent underline decoration-accent/30 decoration-2 underline-offset-4">Appels d'offres</span>
            </h1>
            <p className="text-lg text-sidebar-foreground/80 leading-relaxed" data-testid="text-opportunities-description">
              D&eacute;couvrez les derni&egrave;res opportunit&eacute;s de Smart Africa et de ses partenaires :
              formations, bourses, appels d'offres, recrutements et programmes d'incubation
              pour les jeunes tchadiens.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {!isLoading && opportunities.length > 0 && (
        <section className="py-8 bg-muted/30 border-b" data-testid="section-opportunities-stats">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
              {stats.map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <StatIcon className="w-4 h-4 text-accent" />
                      <span className="text-2xl md:text-3xl font-bold font-heading" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-6 border-b sticky top-16 z-40 backdrop-blur-sm bg-background/95">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground mr-1" />
            <span className="text-sm text-muted-foreground mr-2">Filtrer :</span>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-md" />
              ))
            ) : (
              categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  data-testid={`button-filter-${cat.toLowerCase().replace(/\s+/g, "-").replace(/'/g, "")}`}
                >
                  {cat}
                </Button>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <Skeleton className="h-5 w-20 rounded-md" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-4" />
                    <div className="space-y-2 mb-4">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                    <Skeleton className="h-8 w-32 rounded-md" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2" data-testid="text-no-opportunities">
                {selectedCategory === "Tous"
                  ? "Aucune opportunit\u00e9 disponible"
                  : `Aucune opportunit\u00e9 dans la cat\u00e9gorie "${selectedCategory}"`}
              </h3>
              <p className="text-muted-foreground mb-6">
                Revenez bient\u00f4t pour de nouvelles opportunit\u00e9s.
              </p>
              {selectedCategory !== "Tous" && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory("Tous")}
                  data-testid="button-reset-filter"
                >
                  Voir toutes les opportunit\u00e9s
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                  {filtered.length} opportunit\u00e9{filtered.length > 1 ? "s" : ""} trouv\u00e9e{filtered.length > 1 ? "s" : ""}
                  {selectedCategory !== "Tous" && ` dans "${selectedCategory}"`}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {filtered.map((opportunity) => {
                  const config = categoryConfig[opportunity.category] || { icon: Briefcase, colorClass: "bg-muted text-muted-foreground" };
                  const IconComponent = config.icon;
                  return (
                    <Card
                      key={opportunity.id}
                      className="group hover-elevate transition-all duration-300"
                      data-testid={`card-opportunity-${opportunity.id}`}
                    >
                      <CardHeader className="p-0 overflow-hidden">
                        {opportunity.imageUrl ? (
                          <div className="aspect-video w-full overflow-hidden">
                            <img
                              src={opportunity.imageUrl}
                              alt={opportunity.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className={`aspect-video w-full ${config.colorClass} flex items-center justify-center`}>
                            <IconComponent className="w-12 h-12 opacity-40" />
                          </div>
                        )}
                        <div className="p-6 pb-2">
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <Badge variant="outline" className={`text-xs shrink-0 ${categoryBadgeVariant(opportunity.category)}`}>
                              {opportunity.category}
                            </Badge>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Building2 className="w-3 h-3" />
                              <span className="truncate max-w-[120px]">{opportunity.organization}</span>
                            </div>
                          </div>
                          <CardTitle className="font-heading text-lg leading-snug group-hover:text-primary transition-colors">
                            {opportunity.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 pt-2">
                        <CardDescription className="text-sm leading-relaxed mb-4 line-clamp-3">
                          {opportunity.description}
                        </CardDescription>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="w-4 h-4 shrink-0" />
                            <span>{opportunity.organization}</span>
                          </div>
                          {opportunity.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4 shrink-0" />
                              <span>{opportunity.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-accent font-medium">
                            <Clock className="w-4 h-4 shrink-0" />
                            <span>Date limite : {opportunity.deadline}</span>
                          </div>
                        </div>
                        {opportunity.link && (
                          <div className="flex gap-2">
                             <Link href={`/opportunites/${opportunity.id}`} className="flex-1">
                              <Button variant="default" size="sm" className="w-full" data-testid={`button-view-${opportunity.id}`}>
                                Voir d&eacute;tails
                              </Button>
                            </Link>
                            <a href={opportunity.link} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" data-testid={`button-apply-${opportunity.id}`}>
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30 border-t" data-testid="section-how-it-works">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Rocket className="w-3 h-3 mr-1" />
              Comment postuler
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-how-to-apply-title">
              Comment saisir ces opportunit&eacute;s ?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              SAYC Tchad facilite l'acc&egrave;s aux opportunit&eacute;s de Smart Africa
              pour les jeunes tchadiens.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "D\u00e9couvrez",
                description: "Parcourez les opportunit\u00e9s disponibles et filtrez par cat\u00e9gorie pour trouver celles qui vous correspondent.",
                icon: Briefcase,
              },
              {
                step: "02",
                title: "Postulez",
                description: "Cliquez sur l'opportunit\u00e9 qui vous int\u00e9resse et suivez les instructions pour soumettre votre candidature.",
                icon: FileText,
              },
              {
                step: "03",
                title: "Contactez SAYC Tchad",
                description: "Besoin d'aide ? Le Point Focal national vous accompagne dans vos d\u00e9marches de candidature.",
                icon: Users,
              },
            ].map((item) => {
              const StepIcon = item.icon;
              return (
                <Card key={item.step} className="text-center" data-testid={`card-step-${item.step}`}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
                      <StepIcon className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-accent mb-1">ÉTAPE {item.step}</div>
                    <CardTitle className="font-heading text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" data-testid="text-opportunities-cta-title">
              Vous avez une opportunit&eacute; &agrave; partager ?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Organisations, partenaires et institutions : contactez-nous pour publier
              vos appels d'offres, bourses ou opportunit&eacute;s sur la plateforme SAYC Tchad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="min-w-[200px]" data-testid="button-opportunities-contact">
                  Nous contacter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/adhesion">
                <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground/30 text-primary-foreground backdrop-blur-sm" data-testid="button-opportunities-join">
                  Rejoindre SAYC Tchad
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
