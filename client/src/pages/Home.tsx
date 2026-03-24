import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Users, 
  Target, 
  Globe, 
  Zap, 
  Award,
  Calendar,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Smartphone,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import type { NewsArticle, Event } from "@shared/schema";

export default function Home() {
  const { t } = useTranslation();

  const { data: news = [] } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  return (
    <div className="flex flex-col">
      <SEOHead 
        title={t("home.seo.title")}
        description={t("home.seo.description")}
        path="/"
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-sidebar text-sidebar-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sayc-teal/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sayc-orange/20 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-accent/20 text-accent border-accent/30 hover:bg-accent/30 px-4 py-1.5 text-sm">
              <Globe className="w-4 h-4 mr-2" />
              Smart Africa Youth Chapter Tchad
            </Badge>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-8 leading-[1.1] tracking-tight">
              {t("home.hero_title")}
            </h1>
            <p className="text-xl md:text-2xl text-sidebar-foreground/80 mb-10 max-w-2xl leading-relaxed">
              {t("home.hero_subtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/rejoindre">
                <Button size="lg" className="h-14 px-8 text-lg font-bold group">
                  {t("home.cta_join")}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/a-propos">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold bg-white/5 border-white/20 hover:bg-white/10">
                  {t("home.cta_learn")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Badge Section */}
      <section className="py-12 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-sayc-teal mb-2">35+</h3>
              <p className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">États Membres</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-sayc-orange mb-2">1M+</h3>
              <p className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Jeunes d'ici 2030</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-sayc-teal mb-2">5</h3>
              <p className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Piliers d'Action</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-sayc-orange mb-2">100%</h3>
              <p className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Vision Africaine</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">{t("home.pillars_title")}</h2>
            <div className="h-1.5 w-24 bg-sayc-orange mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
             <Card className="hover-elevate">
               <CardHeader>
                 <Cpu className="w-12 h-12 text-sayc-teal mb-4" />
                 <CardTitle>{t("home.pilar_edu_title")}</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground leading-relaxed">{t("home.pilar_edu_desc")}</p>
               </CardContent>
             </Card>
             <Card className="hover-elevate">
               <CardHeader>
                 <TrendingUp className="w-12 h-12 text-sayc-orange mb-4" />
                 <CardTitle>{t("home.pilar_policy_title")}</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground leading-relaxed">{t("home.pilar_policy_desc")}</p>
               </CardContent>
             </Card>
             <Card className="hover-elevate">
               <CardHeader>
                 <Smartphone className="w-12 h-12 text-sayc-teal mb-4" />
                 <CardTitle>{t("home.pilar_infra_title")}</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground leading-relaxed">{t("home.pilar_infra_desc")}</p>
               </CardContent>
             </Card>
          </div>
        </div>
      </section>

      {/* Focus Points Section */}
      <section className="py-24 bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-4">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                 <div className="absolute -top-4 -left-4 w-24 h-24 bg-sayc-teal/20 rounded-full blur-2xl" />
                 <h2 className="text-4xl font-heading font-bold mb-8 leading-tight">{t("home.focus_title")}</h2>
                 <div className="space-y-6">
                    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                       <ShieldCheck className="w-8 h-8 text-sayc-orange shrink-0" />
                       <div>
                          <h4 className="font-bold mb-1">Protection des Données</h4>
                          <p className="text-sm text-sidebar-foreground/70">Assurer la souveraineté numérique du continent.</p>
                       </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                       <Globe className="w-8 h-8 text-sayc-teal shrink-0" />
                       <div>
                          <h4 className="font-bold mb-1">Intelligence Artificielle</h4>
                          <p className="text-sm text-sidebar-foreground/70">Une IA au service des problématiques africaines.</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-4 pt-8">
                    <div className="aspect-square bg-sayc-teal/20 rounded-3xl flex items-center justify-center">
                       <Users className="w-16 h-16 text-sayc-teal" />
                    </div>
                    <div className="aspect-video bg-sayc-orange/20 rounded-3xl flex items-center justify-center">
                       <Zap className="w-12 h-12 text-sayc-orange" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="aspect-video bg-sayc-orange/20 rounded-3xl flex items-center justify-center">
                       <Target className="w-12 h-12 text-sayc-orange" />
                    </div>
                    <div className="aspect-square bg-sayc-teal/20 rounded-3xl flex items-center justify-center">
                       <Award className="w-16 h-16 text-sayc-teal" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto bg-muted rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-sayc-teal/10 -mr-20 -mt-20 rounded-full" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-sayc-orange/10 -ml-20 -mb-20 rounded-full" />
            
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">{t("home.cta_title")}</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              {t("home.cta_desc")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/rejoindre">
                <Button size="lg" className="h-14 px-10 text-lg font-bold">
                  Rejoindre SAYC
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold border-2">
                  Contactez-nous
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
