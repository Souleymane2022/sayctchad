import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Newspaper, 
  Calendar,
  ChevronRight,
  ArrowRight,
  Clock
} from "lucide-react";

const newsCategories = ["Tous", "Communiqués", "Opportunités", "Événements", "Partenariats"];

const newsArticles = [
  {
    title: "Lancement du programme de formation en cybersécurité 2026",
    excerpt: "Le SAYC Tchad lance un nouveau programme intensif pour former les jeunes aux enjeux de la sécurité numérique. Ce programme de 10 semaines permettra aux participants d'acquérir les compétences essentielles.",
    date: "25 Janvier 2026",
    readTime: "5 min",
    category: "Communiqués",
    featured: true,
  },
  {
    title: "Hackathon Smart Cities Tchad 2026 : Inscriptions ouvertes",
    excerpt: "48 heures pour imaginer les solutions urbaines de demain avec la technologie. Le hackathon se tiendra du 15 au 17 mars et accueillera 50 participants.",
    date: "18 Janvier 2026",
    readTime: "3 min",
    category: "Événements",
    featured: true,
  },
  {
    title: "Partenariat stratégique avec l'Union Africaine",
    excerpt: "Le SAYC Tchad renforce sa collaboration avec l'Union Africaine pour l'inclusion numérique des jeunes africains à travers de nouveaux programmes.",
    date: "10 Janvier 2026",
    readTime: "4 min",
    category: "Partenariats",
    featured: false,
  },
  {
    title: "Appel à candidatures : Incubateur de startups 2026",
    excerpt: "Vous avez un projet innovant? Rejoignez notre programme d'incubation de 6 mois avec mentorat, financement et accès aux investisseurs.",
    date: "5 Janvier 2026",
    readTime: "3 min",
    category: "Opportunités",
    featured: false,
  },
  {
    title: "Bilan 2025 : Une année de croissance pour le SAYC Tchad",
    excerpt: "Retour sur les réalisations de l'année 2025 : formations, événements, partenariats et impact sur la jeunesse tchadienne.",
    date: "28 Décembre 2025",
    readTime: "8 min",
    category: "Communiqués",
    featured: false,
  },
  {
    title: "Bourses d'études en technologie : Postulez maintenant",
    excerpt: "20 bourses d'études complètes disponibles pour les jeunes Tchadiens souhaitant se former aux métiers du numérique.",
    date: "20 Décembre 2025",
    readTime: "4 min",
    category: "Opportunités",
    featured: false,
  },
];

export default function News() {
  return (
    <div className="flex flex-col">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-muted/50 to-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6" data-testid="badge-news-header">
              <Newspaper className="w-3 h-3 mr-1" />
              Actualités
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6" data-testid="text-news-title">
              Nos{" "}
              <span className="text-primary">actualités</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-news-description">
              Restez informé des dernières nouvelles, communiqués, opportunités et événements du SAYC Tchad.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap gap-2">
            {newsCategories.map((category, index) => (
              <Badge
                key={category}
                variant={index === 0 ? "default" : "outline"}
                className="cursor-pointer hover-elevate"
                data-testid={`badge-category-${category.toLowerCase()}`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-heading text-2xl font-bold mb-6" data-testid="text-latest-news">
                Dernières actualités
              </h2>
              
              {newsArticles.map((article, index) => (
                <Card 
                  key={index} 
                  className={`group hover-elevate cursor-pointer transition-all ${article.featured ? 'border-primary/30' : ''}`}
                  data-testid={`card-news-${index}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant={article.featured ? "default" : "secondary"} className="text-xs">
                        {article.category}
                      </Badge>
                      {article.featured && (
                        <Badge variant="outline" className="text-xs border-accent text-accent">
                          À la une
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="font-heading text-xl leading-snug group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed mb-4">
                      {article.excerpt}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <span className="flex items-center text-primary text-sm font-medium">
                        Lire la suite
                        <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="text-center pt-6">
                <Button variant="outline" data-testid="button-load-more">
                  Charger plus d'articles
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <Card data-testid="card-newsletter">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Newsletter</CardTitle>
                  <CardDescription>
                    Recevez nos actualités directement dans votre boîte mail.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <input
                      type="email"
                      placeholder="Votre email"
                      className="w-full px-4 py-2 rounded-md border bg-background"
                      data-testid="input-newsletter-email"
                    />
                    <Button className="w-full" data-testid="button-subscribe-newsletter">
                      S'abonner
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card data-testid="card-categories">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Catégories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {newsCategories.slice(1).map((category) => (
                    <div
                      key={category}
                      className="flex items-center justify-between p-2 rounded-md hover-elevate cursor-pointer"
                      data-testid={`link-category-${category.toLowerCase()}`}
                    >
                      <span className="text-sm">{category}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </CardContent>
              </Card>

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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
