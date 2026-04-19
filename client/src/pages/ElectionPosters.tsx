import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Loader2, Image as ImageIcon, Users } from "lucide-react";
import type { ElectionCandidate } from "@shared/schema";
import SEOHead from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";

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

      // We temporarily ensure the element is fully visible and not scaled for best quality
      const dataUrl = await toPng(element, { 
        quality: 1, 
        pixelRatio: 2,
        backgroundColor: '#1e3a8a' 
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
        <Loader2 className="w-8 h-8 animate-spin text-[#1e3a8a]" />
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
          <h1 className="text-4xl font-heading font-extrabold text-[#1e3a8a]">
            Générateur de Visuels
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Téléchargez les affiches officielles de campagne pour vos réseaux sociaux (Format Carré HD).
          </p>
        </div>

        {/* Section Affiche de Groupe */}
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
            <h2 className="text-2xl font-bold text-[#1e3a8a] flex items-center gap-2">
              <Users className="w-6 h-6 text-sayc-teal" /> Affiche de Groupe
            </h2>
            <Button 
                onClick={() => downloadPoster('group-poster', 'SAYC_Elections_Tous_Candidats.png', 'group')}
                disabled={downloadingId === 'group'}
                className="bg-sayc-teal hover:bg-sayc-teal/90 text-white shadow-lg"
            >
              {downloadingId === 'group' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
              Télécharger l'Affiche Complète
            </Button>
          </div>

          <div className="overflow-x-auto pb-8">
            <div className="mx-auto bg-slate-200 border-8 border-slate-300 rounded-lg p-2 w-fit shadow-2xl">
                {/* 1080x1350 is Instagram Portrait, let's build a nice group grid */}
                <div 
                    id="group-poster" 
                    className="w-[1080px] h-[1350px] bg-[#1e3a8a] relative overflow-hidden flex flex-col"
                >
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sayc-teal/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
                    
                    {/* Header */}
                    <div className="p-16 pb-8 z-10 text-center space-y-6">
                        <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-8 py-3">
                            <span className="text-sayc-teal font-bold uppercase tracking-widest text-2xl">Élections Officielles SAYC Tchad</span>
                        </div>
                        <h1 className="text-7xl font-extrabold text-white font-heading leading-tight drop-shadow-lg">
                            DÉCOUVREZ NOS <br/>
                            <span className="text-sayc-teal">{candidates.length} CANDIDATS</span>
                        </h1>
                    </div>

                    {/* Grid of Candidates */}
                    <div className="flex-1 px-12 py-8 z-10 flex flex-col items-center justify-center">
                        <div className="grid grid-cols-3 gap-6 w-full max-h-full">
                            {candidates.slice(0, 9).map((c) => ( // limit to 9 for a perfect grid look if more
                                <div key={c.id} className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                                    <div className="h-48 relative">
                                        <img src={c.photoUrl} alt={c.firstName} className="w-full h-full object-cover object-top" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        <div className="absolute bottom-3 left-4 right-4">
                                            <h3 className="text-white font-bold text-xl leading-tight">{c.firstName} {c.nomSpecifiqueUnique}</h3>
                                        </div>
                                    </div>
                                    <div className="bg-sayc-teal p-3 text-center">
                                        <span className="text-white text-sm font-bold uppercase">{c.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {candidates.length > 9 && (
                            <p className="text-white/60 mt-8 text-xl font-medium">Et d'autres candidats exceptionnels à découvrir...</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-12 z-10 bg-black/20 backdrop-blur-sm border-t border-white/10 flex items-center justify-between">
                        <div className="text-white">
                            <p className="text-2xl font-bold">www.sayctchad.org</p>
                            <p className="text-sayc-teal text-xl">L'avenir se construit avec vous</p>
                        </div>
                        {/* Fake Logo Placeholder as it's better to render text than missing asset if link broken */}
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#1e3a8a] font-bold text-2xl border-4 border-sayc-teal shadow-xl">
                            SAYC
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Section Affiches Individuelles */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <h2 className="text-2xl font-bold text-[#1e3a8a] flex items-center gap-2">
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
                        className="bg-[#1e3a8a] hover:bg-blue-900"
                    >
                        {downloadingId === candidate.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                        Télécharger
                    </Button>
                </div>

                {/* 1080x1080 Actual Square Poster Wrapper */}
                <div className="w-full flex items-center justify-center bg-slate-800 rounded-lg p-4 overflow-x-auto">
                    {/* The HD element */}
                    <div 
                        id={`poster-${candidate.id}`}
                        className="w-[1080px] h-[1080px] flex-shrink-0 bg-[#0f172a] relative overflow-hidden flex flex-row"
                        style={{ transform: 'scale(0.4)', transformOrigin: 'top left', marginBottom: '-648px', marginRight: '-648px' }} // Scale for preview
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-[800px] h-[1080px] bg-[#1e3a8a] -skew-x-12 translate-x-32 z-0" />
                        <div className="absolute top-0 right-0 w-[600px] h-[1080px] bg-sayc-teal -skew-x-12 translate-x-48 z-0" />

                        {/* Text Content (Left Side) */}
                        <div className="w-1/2 p-16 z-10 flex flex-col justify-center text-white h-full relative">
                            {/* Logo corner */}
                            <div className="absolute top-16 left-16">
                                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-[#1e3a8a] font-bold text-3xl shadow-2xl">
                                    SAYC
                                </div>
                            </div>

                            <div className="space-y-8 mt-20">
                                <div className="inline-block bg-sayc-teal text-white font-bold uppercase tracking-widest text-2xl px-6 py-2 rounded-lg shadow-xl">
                                    Élections 2024
                                </div>
                                <h1 className="text-8xl font-extrabold font-heading leading-none drop-shadow-xl">
                                    {candidate.firstName.toUpperCase()} <br/>
                                    <span className="text-sayc-teal">{candidate.nomSpecifiqueUnique.toUpperCase()}</span>
                                </h1>
                                <div className="w-32 h-2 bg-white/20 rounded-full" />
                                <div>
                                    <p className="text-3xl text-white/80 font-medium">Candidat officiel au poste de</p>
                                    <p className="text-4xl font-bold mt-2 text-white">{candidate.role}</p>
                                </div>
                            </div>

                            <div className="absolute bottom-16 left-16">
                                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20">
                                    <VoteIcon /> 
                                    <p className="text-2xl font-bold">Votez sur www.sayctchad.org</p>
                                </div>
                            </div>
                        </div>

                        {/* Image Content (Right Side) */}
                        <div className="w-1/2 h-full z-10 relative">
                            <div className="absolute inset-y-16 inset-x-8 rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 border-white">
                                <img src={candidate.photoUrl} alt={candidate.firstName} className="w-full h-full object-cover" />
                                {/* Inner gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sayc-teal"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/></svg>
    )
}
