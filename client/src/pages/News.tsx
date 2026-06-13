import { useMemo } from "react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { NewsArticle } from "@shared/schema";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Newspaper, 
  Calendar,
  ArrowRight,
  FileText,
  X
} from "lucide-react";

export default function News() {
  const { data: newsArticles = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
  });

  const webPageJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Actualités SAYC Tchad",
    description: "Dernières nouvelles et annonces du SAYC Tchad et de Smart Africa.",
    url: "https://sayctchad.org/actualites",
    isPartOf: { "@type": "WebSite", name: "SAYC Tchad", url: "https://sayctchad.org" }  }), []);

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Actualités - SAYC Tchad"
        description="Suivez les dernières nouvelles et annonces du Smart Africa Youth Chapter Tchad."
        path="/actualites"
        jsonLd={webPageJsonLd}
      />
      
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-sidebar via-sidebar/95 to-sidebar/90 text-sidebar-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-16 w-28 h-28 border-2 border-accent/30 rounded-full" />
          <div className="absolute bottom-16 left-10 w-20 h-20 border-2 border-sayc-teal/30 rounded-full" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-accent/20 text-accent border-accent/20" data-testid="badge-news-hero">
              <Newspaper className="w-3 h-3 mr-2" />
              SAYC Media
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-news-title">
              Nos <span className="text-accent">actualités</span>
            </h1>
            <p className="text-lg text-sidebar-foreground/80 leading-relaxed" data-testid="text-news-description">
              Restez informé des dernières nouvelles du SAYC Tchad et de Smart Africa.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-heading text-2xl font-bold mb-6" data-testid="text-latest-news">
                Dernières actualités
              </h2>
              
              {isLoading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-5 w-20 mb-2" />
                        <Skeleton className="h-6 w-3/4" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : newsArticles.length > 0 ? (
                newsArticles.map((article) => (
                  <Dialog key={article.id}>
                    <Card 
                      className="group hover-elevate transition-all overflow-hidden"
                      data-testid={`card-news-${article.id}`}
                    >
                      {(article.imageUrls?.[0] || article.imageUrl) && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={article.imageUrls?.[0] || article.imageUrl || ""}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            data-testid={`img-news-${article.id}`}
                          />
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {article.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {article.publishedAt}
                          </span>
                        </div>
                        <CardTitle className="font-heading text-xl leading-snug">
                          {article.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription className="text-sm leading-relaxed">
                          {article.excerpt}
                        </CardDescription>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent font-medium" data-testid={`btn-read-more-${article.id}`}>
                            Lire la suite
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                      </CardContent>
                    </Card>

                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="font-heading text-2xl md:text-3xl lg:text-4xl text-left leading-tight">
                          {article.title}
                        </DialogTitle>
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {article.publishedAt}
                          </span>
                        </div>
                        <DialogDescription className="hidden">
                          Détails de l'article : {article.title}
                        </DialogDescription>
                      </DialogHeader>

                      <article className="space-y-8">
                        {/* Image Gallery */}
                        {(article.imageUrls || article.imageUrl) && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {article.imageUrls && article.imageUrls.length > 0 ? (
                                article.imageUrls.map((img, idx) => (
                                  <div key={idx} className={`relative rounded-xl overflow-hidden shadow-lg ${article.imageUrls!.length === 1 ? 'md:col-span-2 aspect-video' : 'aspect-square'}`}>
                                    <img 
                                      src={img} 
                                      alt={`${article.title} - ${idx + 1}`} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))
                              ) : article.imageUrl ? (
                                <div className="md:col-span-2 aspect-video rounded-xl overflow-hidden shadow-lg">
                                  <img 
                                    src={article.imageUrl} 
                                    alt={article.title} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )}

                        {/* Article Content */}
                        <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">
                          {article.content || article.excerpt}
                        </div>
                      </article>
                    </DialogContent>
                  </Dialog>
                ))
              ) : (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
                  <h3 className="font-heading text-xl font-bold mb-2">Actualités à venir</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Les actualités du SAYC Tchad seront publiées prochainement. 
                    En attendant, suivez Smart Africa pour les dernières nouvelles.
                  </p>
                  <a href="https://smartafrica.org/fr/page-daccueil/" target="_blank" rel="noopener noreferrer">
                    <Button data-testid="button-visit-sa-news">
                      Actualités Smart Africa
                    </Button>
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-primary text-primary-foreground" data-testid="card-join-cta">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Rejoignez-nous</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Devenez membre du SAYC Tchad et participez à la transformation numérique.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/rejoindre">
                    <Button variant="secondary" className="w-full" data-testid="button-sidebar-join">
                      Devenir membre
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card data-testid="card-smart-africa-news">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Smart Africa</CardTitle>
                  <CardDescription>
                    Suivez les actualités de Smart Africa Alliance et SADA.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="https://smartafrica.org/fr/page-daccueil/" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full" data-testid="button-sa-site">
                      Smart Africa Alliance
                    </Button>
                  </a>
                  <a href="https://sada.smart.africa" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full" data-testid="button-sada-site">
                      Plateforme SADA
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
