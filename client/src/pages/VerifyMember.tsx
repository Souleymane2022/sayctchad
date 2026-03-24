import { useMemo } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Loader2, ShieldCheck, Calendar, MapPin, ArrowRight, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";

export default function VerifyMember() {
  const { membershipId } = useParams<{ membershipId: string }>();

  const { data: member, isLoading, error } = useQuery<{
    firstName: string;
    nomSpecifiqueUnique: string;
    membershipId: string;
    createdAt: string;
    chapter: string;
  }>({
    queryKey: [`/api/members/verify/${membershipId}`],
    retry: false,
  });

  const pageJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Vérification de Membre SAYC Tchad",
    description: "Vérification officielle de l'adhésion au Smart Africa Youth Chapter Tchad.",
    url: `https://sayctchad.org/verify/${membershipId}`,
  }), [membershipId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Vérification du statut de membre...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
      <SEOHead
        title="Vérification Officielle | SAYC Tchad"
        description="Vérifiez l'authenticité d'une carte de membre SAYC Tchad."
        path={`/verify/${membershipId}`}
        jsonLd={pageJsonLd}
      />

      <div className="max-w-md w-full">
        {error || !member ? (
          <Card className="border-destructive/20 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="h-2 bg-destructive" />
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl font-heading font-bold text-destructive">Non Vérifié</CardTitle>
              <CardDescription>
                Cette carte de membre n'a pas pu être authentifiée.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-sm text-balance text-muted-foreground">
                Le numéro de membre <span className="font-mono font-bold text-foreground">"{membershipId}"</span> ne correspond à aucun membre actif dans notre base de données officielle.
              </p>
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/contact">
                  <Button variant="outline" className="w-full">Signaler une anomalie</Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" className="w-full">Retour à l'accueil</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-sayc-teal/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="h-2 bg-gradient-to-r from-sayc-teal to-accent" />
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-20 h-20 bg-sayc-teal/10 text-sayc-teal rounded-full flex items-center justify-center mb-4 relative">
                <CheckCircle2 className="h-12 w-12" />
                <div className="absolute -top-1 -right-1">
                  <ShieldCheck className="h-6 w-6 text-accent fill-accent/20" />
                </div>
              </div>
              <CardTitle className="text-3xl font-heading font-bold text-[#1e3a8a]">Membre Vérifié</CardTitle>
              <Badge variant="secondary" className="mt-2 bg-sayc-teal/10 text-sayc-teal border-sayc-teal/20">
                Statut : Actif
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
                    <Award className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Nom Complet</p>
                    <p className="font-heading font-bold text-lg">{member.firstName} {member.nomSpecifiqueUnique}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
                    <ShieldCheck className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">ID Membre</p>
                    <p className="font-mono font-bold text-sayc-teal">{member.membershipId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Chapitre {member.chapter}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Inscrit en {new Date(member.createdAt).getFullYear()}</span>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-xs text-muted-foreground">
                  Cette vérification confirme l'authenticité du membre au sein du Smart Africa Youth Chapter.
                </p>
                <Link href="/rejoindre">
                  <Button className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] gap-2">
                    Devenir membre aussi
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <img src="/favicon.png" alt="SAYC Logo" className="w-10 h-10 mx-auto opacity-50 grayscale mt-4" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
