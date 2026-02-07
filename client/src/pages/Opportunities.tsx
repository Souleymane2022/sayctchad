import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Opportunity } from "@shared/schema";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  ExternalLink,
  GraduationCap,
  MapPin,
  Search,
  FileText,
  Users,
  Loader2,
  Building2
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
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");

  const { data: opportunities = [], isLoading } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities"],
  });

  const categories = ["Tous", ...Array.from(new Set(opportunities.map((o) => o.category)))];

  const filtered = selectedCategory === "Tous"
    ? opportunities
    : opportunities.filter((o) => o.category === selectedCategory);

  return (
    <div className="flex flex-col">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar to-sidebar/95 text-sidebar-foreground overflow-hidden">
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
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-opportunities-title">
              Opportunit&eacute;s &{" "}
              <span className="text-accent">Appels d'offres</span>
            </h1>
            <p className="text-lg text-sidebar-foreground/80 leading-relaxed" data-testid="text-opportunities-description">
              D&eacute;couvrez les derni&egrave;res opportunit&eacute;s de Smart Africa et de ses partenaires :
              formations, bourses, appels d'offres, recrutements et programmes d'incubation.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-8 border-b bg-muted/30 sticky top-16 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground mr-1" />
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                data-testid={`button-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">Aucune opportunit&eacute; disponible</h3>
              <p className="text-muted-foreground">
                Revenez bient&ocirc;t pour de nouvelles opportunit&eacute;s.
              </p>
            </div>
          ) : (
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
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-lg ${config.colorClass} flex items-center justify-center shrink-0`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <Badge variant="outline" className={`text-xs shrink-0 ${categoryBadgeVariant(opportunity.category)}`}>
                          {opportunity.category}
                        </Badge>
                      </div>
                      <CardTitle className="font-heading text-lg leading-snug">
                        {opportunity.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed mb-4">
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
                          <Calendar className="w-4 h-4 shrink-0" />
                          <span>Date limite: {opportunity.deadline}</span>
                        </div>
                      </div>
                      {opportunity.link && (
                        <a href={opportunity.link} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" data-testid={`button-apply-${opportunity.id}`}>
                            En savoir plus
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" data-testid="text-opportunities-cta-title">
              Vous avez une opportunit&eacute; &agrave; partager?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Contactez-nous pour publier vos appels d'offres, bourses ou opportunit&eacute;s
              sur la plateforme SAYC Tchad.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="min-w-[200px]" data-testid="button-opportunities-contact">
                Nous contacter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
