import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Loader2, Image as ImageIcon, Users, CheckCircle2 } from "lucide-react";
import type { ElectionCandidate } from "@shared/schema";
import SEOHead from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";

// Imports officiels de tous les logos
import logoSayc from "@assets/LOGO_SAYC_1770103155971.jpg";
import smartAfricaAllianceLogo from "@assets/SMART_AFRICA_LOGO_1770443171460.png";
import sadaLogo from "@assets/SADA_1770443171461.jpg";

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

      const dataUrl = await toPng(element, { 
        quality: 1, 
        pixelRatio: 2, 
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

  // Calcul du nombre optimal de colonnes pour l'affiche de groupe
  // Si plus de 12 candidats, 4 colonnes. 9-12 : 4 colonnes mais plus grand. Moins de 9 : 3 colonnes.
  const colsClass = candidates.length > 12 ? "grid-cols-4 gap-3 lg:gap-4" 
                  : candidates.length > 8 ? "grid-cols-4 gap-5" 
                  : "grid-cols-3 gap-6";
  const cardHeightClass = candidates.length > 12 ? "h-40" : "h-56";

  // Grouper les candidats par rôle pour les affiches par poste
  const candidatesByRole = candidates?.reduce((acc, candidate) => {
    const roleKey = candidate.role.trim();
    if (!acc[roleKey]) acc[roleKey] = [];
    acc[roleKey].push(candidate);
    return acc;
  }, {} as Record<string, ElectionCandidate[]>) || {};

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 pb-20">
      <SEOHead title="Générateur d'Affiches - Élections" path="/elections/posters" />
      
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-heading font-extrabold text-sidebar">
            Générateur de Visuels Premium
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Générez des affiches électorales dynamiques, ultra-modernes et percutantes incluant tous les logos institutionnels.
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
            <div className="bg-slate-200 border-8 border-slate-300 rounded-xl shadow-2xl overflow-hidden flex items-start justify-start" style={{ width: '448px', height: '640px' }}>
                <div style={{ transform: 'scale(0.35)', transformOrigin: 'top left', width: '1080px', height: '1920px', margin: '4px' }}>
                    <div 
                        id="group-poster" 
                        className="w-[1080px] h-[1920px] bg-gradient-to-br from-sidebar via-[#0a1536] to-black relative overflow-hidden flex flex-col"
                    >
                        {/* Glow and Elements */}
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sayc-teal/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 z-0 mix-blend-screen" />
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 z-0 mix-blend-screen" />
                        <div className="absolute top-1/2 left-1/2 w-full h-[2px] bg-white/5 -translate-y-1/2 z-0" />
                        <div className="absolute top-1/2 left-1/2 w-[2px] h-full bg-white/5 -translate-x-1/2 z-0" />
                        
                        {/* Header & Logos */}
                        <div className="p-8 pb-4 z-10 flex flex-col items-center space-y-4">
                            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-2xl">
                                <div className="h-12 bg-white rounded-xl p-2"><img src={logoSayc} alt="SAYC Logo" className="h-full object-contain" /></div>
                                <div className="h-12 bg-white rounded-xl p-2"><img src={smartAfricaAllianceLogo} alt="Smart Africa Logo" className="h-full object-contain" /></div>
                                <div className="h-12 bg-white rounded-xl p-2"><img src={sadaLogo} alt="SADA Logo" className="h-full object-contain" /></div>
                            </div>

                            <div className="text-center space-y-1">
                                <h1 className="text-[3.5rem] font-extrabold text-white font-heading leading-tight drop-shadow-2xl">
                                    ÉLECTIONS <span className="text-transparent bg-clip-text bg-gradient-to-r from-sayc-teal to-accent">SAYC</span>
                                </h1>
                                <p className="text-xl text-white/80 font-medium tracking-widest uppercase mb-1">Nos {candidates.length} candidats officiels</p>
                            </div>
                        </div>

                        {/* Grid of Candidates - Adaptative */}
                        <div className="flex-1 px-8 z-10 flex flex-col items-center justify-center -mt-2">
                            <div className={`grid ${colsClass} w-full`}>
                                {/* Afficher jusqu'à 16 ou 20 candidats */}
                                {candidates.slice(0, 20).map((c) => (
                                    <div key={c.id} className="group bg-sidebar rounded-xl overflow-hidden shadow-2xl border border-white/20 flex flex-col shrink-0">
                                        <div className={`${cardHeightClass} relative`}>
                                            <img src={c.photoUrl} alt={c.firstName} className="w-full h-full object-cover object-top opacity-100" />
                                        </div>
                                        <div className="p-4 text-center border-t border-sayc-teal/40 flex-1 flex flex-col justify-center bg-gradient-to-b from-[#0a1536] to-black min-h-[90px]">
                                            <h3 className="text-white font-extrabold text-[0.95rem] leading-[1.2] mb-1 break-words">{c.firstName} <br/> {c.nomSpecifiqueUnique}</h3>
                                            <div className="w-8 h-[2px] bg-sayc-teal mx-auto mb-2" />
                                            <span className="text-sayc-teal/90 text-[0.7rem] font-bold uppercase tracking-wider line-clamp-2 leading-[1.1]">{c.role}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-10 py-6 z-10 bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-4 text-white">
                                <VoteIcon />
                                <span className="text-[1.4rem] font-bold uppercase tracking-wider">Votez pour le changement</span>
                            </div>
                            
                            <div className="text-right">
                                <p className="text-[2rem] font-black bg-clip-text text-transparent bg-gradient-to-r from-sayc-teal to-accent drop-shadow-md">WWW.SAYCTCHAD.ORG</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Section Affiches par Poste */}
        {Object.keys(candidatesByRole).length > 0 && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <h2 className="text-2xl font-bold text-sidebar flex items-center gap-2">
              <Users className="w-6 h-6 text-accent" /> Affiches par Poste (1080x1350)
            </h2>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {Object.entries(candidatesByRole).map(([role, roleCandidates], idx) => {
              const safeRoleId = `role-${idx}`;
              return (
              <Card key={idx} className="p-6 overflow-hidden bg-slate-200 border-4 border-slate-300 shadow-xl flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-slate-700">Poste : {role}</h3>
                    <Button 
                        onClick={() => downloadPoster(safeRoleId, `Affiche_Poste_${role.replace(/[^a-z0-9]/gi, '_')}.png`, safeRoleId)}
                        disabled={downloadingId === safeRoleId}
                        className="bg-accent hover:bg-accent/90 text-white shadow-lg transition-all"
                    >
                        {downloadingId === safeRoleId ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                        Télécharger
                    </Button>
                </div>

                {/* Conteneur prévisualisation */}
                <div className="w-full flex justify-center bg-slate-800 rounded-lg overflow-hidden py-4 h-[640px] shadow-inner">
                    <div style={{ transform: 'scale(0.35)', transformOrigin: 'top center', width: '1080px', height: '1920px' }}>
                        <div id={safeRoleId} className="w-[1080px] h-[1920px] bg-[#0a1536] relative overflow-hidden flex flex-col items-center justify-between py-16">
                            {/* Graphic elements */}
                            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-sayc-teal/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 z-0 mix-blend-screen" />
                            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 z-0 mix-blend-screen" />
                            
                            {/* Header */}
                            <div className="z-10 flex flex-col items-center space-y-6 w-full px-16">
                                <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-2xl">
                                    <div className="h-12 bg-white rounded-xl p-2"><img src={logoSayc} alt="SAYC Logo" className="h-full object-contain" /></div>
                                    <div className="h-12 bg-white rounded-xl p-2"><img src={smartAfricaAllianceLogo} alt="Smart Africa Logo" className="h-full object-contain" /></div>
                                    <div className="h-12 bg-white rounded-xl p-2"><img src={sadaLogo} alt="SADA Logo" className="h-full object-contain" /></div>
                                </div>
                                <div className="text-center">
                                    <span className="text-sayc-teal font-extrabold tracking-[0.3em] uppercase text-xl">Candidats au poste de</span>
                                    <h1 className="text-[3.2rem] font-black text-white font-heading leading-tight drop-shadow-2xl mt-4 break-words max-w-[950px] mx-auto">
                                        {role.toUpperCase()}
                                    </h1>
                                </div>
                            </div>
                            
                            {/* Candidates flex grid */}
                            <div className="flex flex-wrap items-center justify-center gap-10 z-10 w-full px-10 my-auto">
                                {roleCandidates.slice(0, 10).map(c => (
                                    <div key={c.id} className="w-[280px] bg-sidebar rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/20 flex flex-col shrink-0">
                                        <div className="h-[300px] relative">
                                            <img src={c.photoUrl} alt={c.firstName} className="w-full h-full object-cover object-top opacity-100" />
                                        </div>
                                        <div className="p-6 text-center border-t border-sayc-teal/40 bg-gradient-to-b from-[#0a1536] to-black min-h-[110px] flex items-center justify-center">
                                            <h3 className="text-white font-extrabold text-[1.2rem] leading-[1.3] break-words">{c.firstName} <br/> {c.nomSpecifiqueUnique}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Footer */}
                            <div className="z-10 w-full px-16 flex items-center justify-between pt-8 pb-6 border-t border-white/10 mt-auto bg-black/40 backdrop-blur-xl">
                                <div className="flex items-center gap-4 text-white">
                                    <VoteIcon />
                                    <span className="text-[1.4rem] font-bold uppercase tracking-wider">Élections 2026</span>
                                </div>
                                <p className="text-[1.8rem] font-black bg-clip-text text-transparent bg-gradient-to-r from-sayc-teal to-accent">WWW.SAYCTCHAD.ORG</p>
                            </div>
                        </div>
                    </div>
                </div>
              </Card>
              );
            })}
          </div>
        </div>
        )}

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
                        className="bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground shadow-lg hover:shadow-xl transition-all"
                    >
                        {downloadingId === candidate.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                        Télécharger HD
                    </Button>
                </div>

                {/* 1080x1080 Conteneur de prévisualisation */}
                <div className="w-full flex justify-center bg-slate-800 rounded-lg overflow-hidden py-4 h-[460px] shadow-inner">
                    <div style={{ transform: 'scale(0.4)', transformOrigin: 'top center', width: '1080px', height: '1080px' }}>
                        {/* LE VRAI ÉLÉMENT CAPTURÉ (Enlève Flex pour position absolue et garantir l'emplacement exact sans débordement) */}
                        <div 
                            id={`poster-${candidate.id}`}
                            className="w-[1080px] h-[1080px] bg-sidebar relative overflow-hidden block"
                        >
                            {/* Futuristic Background */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sidebar via-[#0a1536] to-black z-0" />
                            <div className="absolute top-0 right-0 w-[1000px] h-[1080px] bg-primary/20 -skew-x-12 translate-x-48 z-0 mix-blend-screen" />
                            <div className="absolute top-0 right-0 w-[800px] h-[1080px] bg-sayc-teal/20 -skew-x-12 translate-x-64 z-0 mix-blend-screen blur-[50px]" />
                            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-accent/10 to-transparent z-0 opacity-50" />

                            {/* Text Content Block (Left absolute) */}
                            <div className="absolute left-0 top-0 w-[540px] h-[1080px] p-16 pt-14 pr-4 z-20 flex flex-col justify-between">
                                {/* Triple Logo Row */}
                                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] w-fit mt-4">
                                    <div className="h-14 w-auto bg-white p-2 rounded-xl shadow-inner flex items-center justify-center">
                                        <img src={logoSayc} alt="SAYC Logo" className="h-full object-contain" />
                                    </div>
                                    <div className="h-14 w-auto bg-white p-2 rounded-xl shadow-inner flex items-center justify-center">
                                        <img src={smartAfricaAllianceLogo} alt="Smart Africa Logo" className="h-full object-contain" />
                                    </div>
                                    <div className="h-14 w-auto bg-white p-2 rounded-xl shadow-inner flex items-center justify-center">
                                        <img src={sadaLogo} alt="SADA Logo" className="h-full object-contain" />
                                    </div>
                                </div>

                                <div className="space-y-6 mt-20">
                                    <div className="flex items-center gap-3">
                                        <div className="h-px w-12 bg-sayc-teal" />
                                        <div className="text-sayc-teal font-extrabold uppercase tracking-[0.3em] text-[1.1rem]">
                                            Candidat Officiel
                                        </div>
                                    </div>
                                    <h1 className="text-[5.2rem] font-black font-heading leading-[1] drop-shadow-2xl text-white break-words">
                                        {candidate.firstName.toUpperCase()} <br/>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sayc-teal to-accent">{candidate.nomSpecifiqueUnique.toUpperCase()}</span>
                                    </h1>
                                    
                                    <div className="bg-white/5 backdrop-blur-sm border-l-4 border-accent p-6 rounded-r-2xl mt-6 w-full">
                                        <p className="text-xl text-white/60 font-medium uppercase tracking-widest mb-2">Visant le poste de</p>
                                        <p className="text-3xl font-extrabold text-white leading-[1.1] pr-2">{candidate.role}</p>
                                    </div>
                                </div>

                                {/* Call to action button style */}
                                <div className="mt-8 pb-10">
                                    <div className="inline-flex items-center gap-6 bg-gradient-to-r from-sayc-teal to-blue-600 px-8 py-5 rounded-2xl shadow-[0_10px_40px_rgba(45,212,191,0.4)] border border-white/20">
                                        <div className="bg-white text-sayc-teal p-2 rounded-full shadow-inner flex shrink-0">
                                            <CheckCircle2 size={32} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <p className="text-white/90 text-[1.1rem] font-medium leading-none mb-[2px]">SOUTENEZ CE PROFIL SUR</p>
                                            <p className="text-[1.3rem] font-black text-white leading-none tracking-wider font-heading mt-2">WWW.SAYCTCHAD.ORG</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Image Content absolute (Right Side) */}
                            <div className="absolute right-10 bottom-14 w-[460px] h-[850px] z-10 flex">
                                {/* Premium Glass Image Frame */}
                                <div className="w-full h-full relative rounded-[40px] overflow-hidden shadow-[0_30px_80px_-15px_rgba(0,0,0,0.8)] bg-sidebar">
                                    {/* Subtle glowing animated border effect using gradients */}
                                    <div className="absolute inset-0 p-[4px] bg-gradient-to-bl from-accent via-sayc-teal to-sidebar rounded-[40px]">
                                        <div className="w-full h-full rounded-[36px] overflow-hidden relative bg-black">
                                            <img src={candidate.photoUrl} alt={candidate.firstName} className="w-full h-full object-cover object-top" />
                                            {/* Dramatic lighting on photo */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1536] via-[#0a1536]/10 to-transparent" />
                                        </div>
                                    </div>
                                    
                                    {/* Overlay aesthetic badge */}
                                    <div className="absolute bottom-10 -right-5 bg-white text-sidebar font-black uppercase tracking-widest px-8 py-3 -rotate-90 origin-bottom-right shadow-2xl rounded-t-xl text-[1.2rem]">
                                        ÉLECTIONS '26
                                    </div>
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
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sayc-teal drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/></svg>
    )
}
