import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Loader2, Image as ImageIcon, Users } from "lucide-react";
import type { ElectionCandidate } from "@shared/schema";
import SEOHead from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import logoSayc from "@assets/LOGO_SAYC_1770103155971.jpg";

const SMART_AFRICA_LOGO = "data:image/jpeg;base64,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";

export default function ElectionPosters() {
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: candidates, isLoading } = useQuery<ElectionCandidate[]>({
    queryKey: ["/api/elections/candidates"],
  });

  const downloadPoster = async (elementId: string, filename: string, id: string) => {
    setDownloadingId(id);
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error("Element not found");

      // Appliquer une méthode robuste pour html-to-image avec le transform parent
      const dataUrl = await toPng(element, { 
        quality: 1, 
        pixelRatio: 2, // Pour de la vraie HD (2160x2160)
        backgroundColor: '#0a1d4a',
        width: element.offsetWidth,
        height: element.offsetHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          margin: '0'
        }
      });
      
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Affiche téléchargée avec succès",
        description: `L'affiche pour ${filename} a été générée.`,
      });
    } catch (err) {
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer l'affiche.",
        variant: "destructive"
      });
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-sidebar" />
      </div>
    );
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
        <div>
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-600">Aucun candidat approuvé</h2>
          <p className="text-slate-500 mt-2">Veuillez approuver des candidats dans l'espace admin pour générer leurs affiches.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 pb-20">
      <SEOHead title="Générateur d'Affiches - Élections" path="/elections/posters" />
      
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-heading font-extrabold text-sidebar">
            Générateur de Visuels HD
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Téléchargez les affiches officielles de campagne pour vos réseaux sociaux avec un design respectant la charte graphique.
          </p>
        </div>

        {/* Section Affiche de Groupe */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border shadow-sm gap-4">
            <h2 className="text-2xl font-bold text-sidebar flex items-center gap-2">
              <Users className="w-6 h-6 text-sayc-teal" /> Affiche de Groupe
            </h2>
            <Button 
                onClick={() => downloadPoster('group-poster', 'SAYC_Elections_Tous_Candidats.png', 'group')}
                disabled={downloadingId === 'group'}
                className="bg-sayc-teal hover:bg-sayc-teal/90 text-white shadow-lg w-full sm:w-auto"
            >
              {downloadingId === 'group' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
              Télécharger l'Affiche Complète (1080x1350)
            </Button>
          </div>

          <div className="overflow-hidden pb-8 flex justify-center">
            {/* Conteneur pour la prévisualisation (redimensionne visuellement sans altérer l'élément cible pour html-to-image) */}
            <div className="bg-slate-200 border-8 border-slate-300 rounded-xl shadow-2xl overflow-hidden flex items-start justify-start" style={{ width: '448px', height: '556px' }}>
                {/* Scale wrapper pour le visuel à l'écran uniquement */}
                <div style={{ transform: 'scale(0.4)', transformOrigin: 'top left', width: '1080px', height: '1350px', margin: '4px' }}>
                    {/* LE VRAI ÉLÉMENT CAPTURÉ (Taille Réelle - Aucune modification de transform inline) */}
                    <div 
                        id="group-poster" 
                        className="w-[1080px] h-[1350px] bg-gradient-to-br from-sidebar via-sidebar to-sidebar/95 relative overflow-hidden flex flex-col"
                    >
                        {/* Background Decor - consistent with Home */}
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sayc-teal/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 z-0" />
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 z-0" />
                        
                        {/* Header */}
                        <div className="p-16 pb-8 z-10 text-center space-y-6">
                            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-8 py-3 shadow-lg">
                                <span className="text-sayc-teal font-bold uppercase tracking-widest text-2xl">Élections Officielles SAYC Tchad</span>
                            </div>
                            <h1 className="text-7xl font-extrabold text-sidebar-foreground font-heading leading-tight drop-shadow-lg">
                                DÉCOUVREZ NOS <br/>
                                <span className="text-accent">{candidates.length} CANDIDATS</span>
                            </h1>
                        </div>

                        {/* Grid of Candidates */}
                        <div className="flex-1 px-12 py-4 z-10 flex flex-col items-center justify-center">
                            <div className="grid grid-cols-3 gap-6 w-full max-h-full">
                                {candidates.slice(0, 9).map((c) => ( // limit to 9 for a perfect grid look if more
                                    <div key={c.id} className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-border/50">
                                        <div className="h-48 relative bg-muted">
                                            <img src={c.photoUrl} alt={c.firstName} className="w-full h-full object-cover object-top" />
                                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                                            <div className="absolute bottom-3 left-4 right-4">
                                                <h3 className="text-white font-bold text-xl leading-tight">{c.firstName} {c.nomSpecifiqueUnique}</h3>
                                            </div>
                                        </div>
                                        <div className="bg-sayc-teal/10 p-3 text-center border-t border-sayc-teal/20">
                                            <span className="text-sayc-teal text-sm font-extrabold uppercase tracking-wide">{c.role}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {candidates.length > 9 && (
                                <p className="text-sidebar-foreground/60 mt-8 text-xl font-medium">Et d'autres candidats exceptionnels à découvrir...</p>
                            )}
                        </div>

                        {/* Footer aligned with logos */}
                        <div className="p-10 z-10 bg-black/20 backdrop-blur-sm border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="bg-white p-3 rounded-2xl shadow-xl h-24 w-auto flex items-center justify-center">
                                    <img src={logoSayc} alt="SAYC Logo" className="h-full object-contain" />
                                </div>
                                <div className="bg-white p-3 rounded-2xl shadow-xl h-24 w-auto flex items-center justify-center">
                                    <img src={SMART_AFRICA_LOGO} alt="Smart Africa Logo" className="h-full object-contain" />
                                </div>
                            </div>
                            
                            <div className="text-right text-sidebar-foreground space-y-1">
                                <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sayc-teal to-accent">www.sayctchad.org</p>
                                <p className="text-sidebar-foreground/80 text-xl font-medium">L'avenir se construit avec vous</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Section Affiches Individuelles */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <h2 className="text-2xl font-bold text-sidebar flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-sayc-teal" /> Affiches Individuelles (1080x1080)
            </h2>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {candidates.map((candidate) => (
              <Card key={candidate.id} className="p-6 overflow-hidden bg-slate-200 border-4 border-slate-300 shadow-xl flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-slate-700">{candidate.firstName} {candidate.nomSpecifiqueUnique}</h3>
                    <Button 
                        onClick={() => downloadPoster(`poster-${candidate.id}`, `Affiche_${candidate.firstName}_${candidate.nomSpecifiqueUnique}.png`, candidate.id)}
                        disabled={downloadingId === candidate.id}
                        className="bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground"
                    >
                        {downloadingId === candidate.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                        Télécharger
                    </Button>
                </div>

                {/* 1080x1080 Conteneur de prévisualisation */}
                <div className="w-full flex justify-center bg-slate-800 rounded-lg overflow-hidden py-4 h-[460px]">
                    <div style={{ transform: 'scale(0.4)', transformOrigin: 'top center', width: '1080px', height: '1080px' }}>
                        {/* LE VRAI ÉLÉMENT CAPTURÉ */}
                        <div 
                            id={`poster-${candidate.id}`}
                            className="w-[1080px] h-[1080px] bg-gradient-to-br from-sidebar via-sidebar to-sidebar/95 relative overflow-hidden flex flex-row"
                        >
                            {/* Background Decor aligned to Home components */}
                            <div className="absolute top-0 right-0 w-[800px] h-[1080px] bg-primary/20 -skew-x-12 translate-x-32 z-0" />
                            <div className="absolute top-0 right-0 w-[600px] h-[1080px] bg-sayc-teal/30 -skew-x-12 translate-x-48 z-0" />

                            {/* Text Content (Left Side) */}
                            <div className="w-1/2 p-14 z-10 flex flex-col text-sidebar-foreground h-full relative">
                                {/* Logo Row */}
                                <div className="absolute top-14 left-14 flex items-center gap-4">
                                    <div className="h-20 w-auto bg-white p-2 rounded-xl shadow-2xl flex items-center justify-center">
                                        <img src={logoSayc} alt="SAYC Logo" className="h-full object-contain" />
                                    </div>
                                    <div className="h-20 w-auto bg-white p-2 rounded-xl shadow-2xl flex items-center justify-center">
                                        <img src={SMART_AFRICA_LOGO} alt="Smart Africa Logo" className="h-full object-contain" />
                                    </div>
                                </div>

                                <div className="space-y-6 mt-40">
                                    <div className="inline-block bg-accent/20 border border-accent/30 text-accent font-bold uppercase tracking-widest text-xl px-4 py-2 rounded-lg shadow-xl">
                                        Élections du Chapitre
                                    </div>
                                    <h1 className="text-[5.5rem] font-extrabold font-heading leading-tight drop-shadow-xl text-sidebar-foreground">
                                        {candidate.firstName.toUpperCase()} <br/>
                                        <span className="text-accent">{candidate.nomSpecifiqueUnique.toUpperCase()}</span>
                                    </h1>
                                    <div className="w-24 h-2 bg-sayc-teal rounded-full" />
                                    <div>
                                        <p className="text-2xl text-sidebar-foreground/70 font-medium">Je me porte candidat(e) au rôle de</p>
                                        <p className="text-4xl font-extrabold mt-2 text-sayc-teal uppercase tracking-wide">{candidate.role}</p>
                                    </div>
                                </div>

                                <div className="absolute bottom-14 left-14">
                                    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl px-8 py-5 rounded-2xl border border-white/10 shadow-lg">
                                        <div className="bg-accent/20 p-3 rounded-full text-accent">
                                            <VoteIcon /> 
                                        </div>
                                        <div>
                                            <p className="text-xl text-sidebar-foreground/70">Votez en ligne sur</p>
                                            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sayc-teal to-accent">www.sayctchad.org</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Image Content (Right Side) */}
                            <div className="w-1/2 h-full z-10 relative">
                                <div className="absolute inset-y-14 inset-x-10 rounded-[30px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-4 border-sayc-teal/50 bg-sidebar/50">
                                    <img src={candidate.photoUrl} alt={candidate.firstName} className="w-full h-full object-cover object-top" />
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VoteIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/></svg>
    )
}
