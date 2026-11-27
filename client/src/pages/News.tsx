import { useMemo, useState } from "react";
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
  ImageIcon,
} from "lucide-react";

const articleImage = (a: NewsArticle) => a.imageUrls?.[0] || a.imageUrl || null;

function ArticleDialogContent({ article }: { article: NewsArticle }) {
  const images = article.imageUrls && article.imageUrls.length > 0
    ? article.imageUrls
    : article.imageUrl ? [article.imageUrl] : [];
  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader className="mb-4">
        <DialogTitle className="font-heading text-2xl md:text-3xl text-left leading-tight">
          {article.title}
        </DialogTitle>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <Badge variant="outline" className="text-xs">{article.category}</Badge>
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
        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative rounded-xl overflow-hidden shadow-lg bg-muted ${images.length === 1 ? "md:col-span-2 aspect-video" : "aspect-square"}`}
              >
                <img src={img} alt={`${article.title} - ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
        <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">
          {article.content || article.excerpt}
        </div>
      </article>
    </DialogContent>
  );
}

function FeaturedArticle({ article }: { article: NewsArticle }) {
  const img = articleImage(article);
  return (
    <Dialog>
      <Card className="group overflow-hidden hover-elevate transition-all lg:grid lg:grid-cols-2" data-testid={`card-news-featured-${article.id}`}>
        <div className="relative aspect-video lg:aspect-auto lg:h-full overflow-hidden bg-gradient-to-br from-sidebar to-primary min-h-[220px]">
          {img ? (
            <img
              src={img}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Newspaper className="w-16 h-16 text-white/30" />
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge className="bg-accent text-accent-foreground shadow-lg hover:bg-accent">À la une</Badge>
          </div>
        </div>
        <div className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">{article.category}</Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {article.publishedAt}
              </span>
            </div>
            <CardTitle className="font-heading text-xl md:text-2xl leading-snug">
              {article.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1">
            <CardDescription className="text-sm leading-relaxed line-clamp-5 mb-4">
              {article.excerpt}
            </CardDescription>
            <div className="mt-auto">
              <DialogTrigger asChild>
                <Button className="font-medium" data-testid={`btn-read-featured-${article.id}`}>
                  Lire l'article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </DialogTrigger>
            </div>
          </CardContent>
        </div>
      </Card>
      <ArticleDialogContent article={article} />
    </Dialog>
  );
}

function ArticleCard({ article }: { article: NewsArticle }) {
  const img = articleImage(article);
  const extraImages = (article.imageUrls?.length || 0) - 1;
  return (
    <Dialog>
      <Card className="group flex flex-col overflow-hidden hover-elevate transition-all" data-testid={`card-news-${article.id}`}>
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-sidebar to-primary">
          {img ? (
            <img
              src={img}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              data-testid={`img-news-${article.id}`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Newspaper className="w-10 h-10 text-white/30" />
            </div>
          )}
          {extraImages > 0 && (
            <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/60 text-white text-[11px] font-medium px-2 py-1">
              <ImageIcon className="w-3 h-3" /> +{extraImages} photo{extraImages > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">{article.category}</Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {article.publishedAt}
            </span>
          </div>
          <CardTitle className="font-heading text-base leading-snug line-clamp-3">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 pt-0">
          <CardDescription className="text-sm leading-relaxed line-clamp-3 mb-3">
            {article.excerpt}
          </CardDescription>
          <div className="mt-auto">
            <DialogTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent font-medium" data-testid={`btn-read-more-${article.id}`}>
                Lire la suite
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
          </div>
        </CardContent>
      </Card>
      <ArticleDialogContent article={article} />
    </Dialog>
  );
}

export default function News() {
  const { data: newsArticles = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
  });
  const [activeCategory, setActiveCategory] = useState<string>("Toutes");

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const a of newsArticles) {
      const c = (a.category || "").trim();
      if (c && !seen.has(c.toLowerCase())) seen.set(c.toLowerCase(), c);
    }
    return ["Toutes", ...Array.from(seen.values())];
  }, [newsArticles]);

  const filtered = useMemo(
    () =>
      activeCategory === "Toutes"
        ? newsArticles
        : newsArticles.filter((a) => (a.category || "").trim().toLowerCase() === activeCategory.toLowerCase()),
    [newsArticles, activeCategory],
  );

  const [featured, ...rest] = filtered;

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
              Projets, opportunités, événements : suivez toute l'actualité du SAYC Tchad et de Smart Africa.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          {!isLoading && newsArticles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10" data-testid="news-category-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {isLoading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <Skeleton className="aspect-video w-full" />
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
              ) : filtered.length > 0 ? (
                <>
                  {featured && <FeaturedArticle article={featured} />}
                  {rest.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {rest.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
                  <h3 className="font-heading text-xl font-bold mb-2">Aucun article dans cette catégorie</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    {newsArticles.length === 0
                      ? "Les actualités du SAYC Tchad seront publiées prochainement. En attendant, suivez Smart Africa pour les dernières nouvelles."
                      : "Essayez une autre catégorie pour découvrir nos autres articles."}
                  </p>
                  {newsArticles.length === 0 && (
                    <a href="https://smartafrica.org/fr/page-daccueil/" target="_blank" rel="noopener noreferrer">
                      <Button data-testid="button-visit-sa-news">
                        Actualités Smart Africa
                      </Button>
                    </a>
                  )}
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

              <Card data-testid="card-projects-sidebar">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Nos projets phares</CardTitle>
                  <CardDescription>Les grands programmes du SAYC Tchad.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/programmes/aws-restart">
                    <div className="flex items-center gap-3 rounded-lg border p-2.5 hover-elevate cursor-pointer">
                      <img src="/images/chad-cloud-talent-logo.png" alt="Chad Cloud Talent" className="h-10 w-14 object-contain shrink-0" />
                      <div>
                        <p className="text-sm font-semibold leading-tight">Chad Cloud Talent</p>
                        <p className="text-xs text-muted-foreground">AWS re/Start — N'Djamena</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/programmes/invest-ready-tchad">
                    <div className="flex items-center gap-3 rounded-lg border p-2.5 hover-elevate cursor-pointer">
                      <img src="/images/invest-ready-logo.png" alt="Invest Ready Tchad" className="h-10 w-14 object-contain rounded shrink-0" />
                      <div>
                        <p className="text-sm font-semibold leading-tight">Invest Ready Tchad</p>
                        <p className="text-xs text-muted-foreground">Bootcamp investissement</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/programmes/thunderbird">
                    <div className="flex items-center gap-3 rounded-lg border p-2.5 hover-elevate cursor-pointer">
                      <img src="/images/partners/thunderbird-logo.png" alt="Thunderbird" className="h-10 w-14 object-contain shrink-0" />
                      <div>
                        <p className="text-sm font-semibold leading-tight">SAYC × Thunderbird</p>
                        <p className="text-xs text-muted-foreground">Bourses de certification</p>
                      </div>
                    </div>
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
