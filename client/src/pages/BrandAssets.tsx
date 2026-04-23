import { useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Loader2, Image as ImageIcon, Sparkles, Megaphone, Smartphone, Facebook, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Imports des logos
import logoSayc from "@assets/LOGO_SAYC_1770103155971.jpg";
import smartAfricaAllianceLogo from "@assets/SMART_AFRICA_LOGO_1770443171460.png";
import sadaLogo from "@assets/SADA_1770443171461.jpg";

export default function BrandAssets() {
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const downloadPoster = async (elementId: string, filename: string) => {
    setDownloadingId(elementId);
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error("Element not found");

      const dataUrl = await toPng(element, { 
        quality: 1, 
        pixelRatio: 2, 
        width: 1080,
        height: 1080,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      });
      
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Affiche générée !",
        description: "L'image est prête pour vos réseaux sociaux.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de générer l'image.",
        variant: "destructive"
      });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sayc-teal/10 text-sayc-teal rounded-full font-bold text-sm uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> Espace Branding & Marketing
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#0f172a] tracking-tight">
            SAYC <span className="text-sayc-teal">Creative</span> Studio
          </h1>
          <p className="text-slate-500 text-xl max-w-3xl mx-auto">
            Générez instantanément des supports de communication professionnels et percutants pour promouvoir les initiatives du Smart Africa Youth Chapter Tchad.
          </p>
        </div>

        {/* AWS re/Start Poster Section */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b pb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                <Megaphone className="w-8 h-8 text-orange-500" /> Campagne AWS re/Start
              </h2>
              <p className="text-slate-500 font-medium">Affiche promotionnelle Facebook/Instagram (1080x1080)</p>
            </div>
            <div className="flex gap-3">
               <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => {
                  toast({
                    title: "Format Mobile",
                    description: "Le format 1080x1080 est optimal pour Facebook, Instagram et WhatsApp.",
                  });
                }}
               >
                 <Smartphone className="w-4 h-4" /> 1080x1080
               </Button>
               <Button 
                onClick={() => downloadPoster('aws-promo-poster', 'SAYC_AWS_Promo_1.png')}
                disabled={downloadingId === 'aws-promo-poster'}
                className="bg-orange-600 hover:bg-orange-700 text-white shadow-xl h-12 px-8 font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
               >
                {downloadingId === 'aws-promo-poster' ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Download className="w-5 h-5 mr-2" />}
                Télécharger l'Affiche HD
               </Button>
            </div>
          </div>

          <div className="flex justify-center items-center py-10">
            {/* Visual Preview Container */}
            <div className="relative group p-4 bg-white rounded-[2rem] shadow-2xl border border-slate-100 transition-all hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]">
              {/* Scaled Preview for UI */}
              <div style={{ transform: 'scale(0.5)', transformOrigin: 'center center', width: '1080px', height: '1080px' }} className="my-[-270px]">
                {/* THE REAL POSTER ELEMENT (1080x1080) */}
                <div 
                  id="aws-promo-poster"
                  className="w-[1080px] h-[1080px] bg-[#020308] relative overflow-hidden flex flex-col font-sans"
                >
                  {/* Background Tech Layer */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-40 z-0" />
                  <div className="absolute top-[-300px] left-[-300px] w-[900px] h-[900px] bg-orange-600/10 rounded-full blur-[180px] z-0 animate-pulse" />
                  <div className="absolute bottom-[-200px] right-[-200px] w-[700px] h-[700px] bg-sayc-teal/10 rounded-full blur-[150px] z-0" />
                  
                  {/* Neon Circuit Overlay */}
                  <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]" />

                  {/* Left Accent Bar - Improved */}
                  <div className="absolute left-0 top-0 bottom-0 w-[60px] bg-gradient-to-b from-orange-600 via-[#ff8800] to-orange-900 z-20 shadow-[10px_0_40px_rgba(234,88,12,0.3)]">
                     <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')]" />
                  </div>

                  {/* Header Branding - Ultra Clean */}
                  <div className="absolute top-14 left-24 right-14 z-30 flex items-center justify-between">
                    <div className="flex items-center gap-8 bg-white px-10 py-5 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] border-b-8 border-orange-600">
                       <img src={logoSayc} alt="SAYC" className="h-16 object-contain" />
                       <div className="w-[1px] h-12 bg-slate-200" />
                       <img src={smartAfricaAllianceLogo} alt="Smart Africa" className="h-10 object-contain" />
                       <div className="w-[1px] h-12 bg-slate-200" />
                       <img src={sadaLogo} alt="SADA" className="h-14 object-contain" />
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                       <div className="bg-orange-600 text-white px-10 py-3 rounded-2xl shadow-[0_10px_30px_rgba(234,88,12,0.5)] border border-orange-400">
                          <span className="font-black text-2xl tracking-[0.2em] uppercase italic">SESSION 2026</span>
                       </div>
                       <div className="text-white/40 font-bold text-lg tracking-[0.3em] mr-4 uppercase">Smart Africa Academy</div>
                    </div>
                  </div>

                  {/* Main Content Area - Impactful */}
                  <div className="relative z-20 pl-32 pt-40 flex-1 flex flex-col justify-center">
                    <div className="space-y-12">
                       <div className="inline-flex items-center gap-6 bg-orange-600/10 border border-orange-500/40 text-orange-400 px-8 py-3 rounded-full">
                          <div className="w-4 h-4 bg-orange-500 rounded-full animate-ping" />
                          <span className="font-black text-2xl tracking-[0.4em] uppercase">Tchad Digital Transformation</span>
                       </div>
                       
                       <div className="space-y-2">
                          <h2 className="text-white/60 text-4xl font-bold tracking-[0.4em] mb-4 uppercase">Propulsez votre futur</h2>
                          <h1 className="text-[140px] font-black text-white leading-[0.8] tracking-[-0.04em] drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                            FORMATION <br/> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] via-[#ffcc00] to-[#ffaa00] drop-shadow-[0_0_30px_rgba(255,153,0,0.3)]">AWS RE/START</span>
                          </h1>
                       </div>
                       
                       <div className="h-2 w-96 bg-gradient-to-r from-orange-600 to-transparent rounded-full" />
                       
                       <div className="grid grid-cols-2 gap-10 pt-10 max-w-[900px]">
                          <div className="bg-white/5 backdrop-blur-2xl border-l-8 border-orange-500 p-10 rounded-tr-[3rem] rounded-br-[3rem] space-y-6 shadow-2xl relative group overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-10">
                                <ImageIcon className="w-20 h-20 text-white" />
                             </div>
                             <h3 className="text-orange-500 font-black text-3xl uppercase tracking-widest italic leading-none">Objectif 100% Emploi</h3>
                             <p className="text-white/90 text-2xl font-semibold leading-relaxed">
                               Un programme intensif conçu pour les jeunes talents afin d'intégrer l'écosystème Cloud mondial.
                             </p>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                             {[
                               "Cloud Practitioner Academy", 
                               "Infrastructures & Sécurité", 
                               "Python pour le Cloud", 
                               "Systèmes Linux & DevOps"
                             ].map((skill, i) => (
                               <div key={i} className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 flex items-center gap-6 transform hover:translate-x-2 transition-transform">
                                  <div className="w-5 h-5 bg-orange-600 rounded-lg rotate-45 shadow-[0_0_15px_#ea580c]" />
                                  <span className="text-white font-black text-2xl tracking-tighter uppercase">{skill}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Footer - Call to Action - High Contrast */}
                  <div className="relative z-20 pl-32 pr-16 py-16 flex items-end justify-between bg-black/40 backdrop-blur-xl border-t border-white/5">
                    <div className="flex items-center gap-8">
                       <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl shadow-[0_15px_40px_rgba(234,88,12,0.4)]">
                          <Sparkles className="w-12 h-12 text-white" />
                       </div>
                       <div>
                          <p className="text-white font-black text-[2.8rem] uppercase tracking-tighter leading-none mb-2">FORMATION GRATUITE</p>
                          <div className="flex items-center gap-3">
                             <span className="px-3 py-1 bg-sayc-teal text-white font-bold rounded-lg text-lg uppercase tracking-widest">SAYC TCHAD × AWS</span>
                          </div>
                       </div>
                    </div>

                    <div className="text-right">
                       <p className="text-white/40 font-bold uppercase tracking-[0.5em] text-xl mb-4">Postulez sur le portail</p>
                       <p className="text-[4.8rem] font-black text-white leading-none tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                          WWW.<span className="text-orange-500">SAYCTCHAD</span>.ORG
                       </p>
                    </div>
                  </div>

                  {/* Aesthetic Background Logo Overlay */}
                  <div className="absolute right-[-150px] top-1/2 -translate-y-1/2 opacity-[0.03] scale-[4] z-0 pointer-events-none grayscale invert rotate-12">
                    <img src={logoSayc} alt="" />
                  </div>
                </div>
              </div>

              {/* Interaction Hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-[2rem] pointer-events-none">
                 <div className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" /> Visionner le rendu HD
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informative Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t items-center text-center md:text-left">
           <div className="space-y-2">
              <h3 className="font-bold text-slate-800">Directives Branding</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Utilisez toujours les couleurs officielles (Orangé AWS, Teal SAYC) pour garantir la cohérence d'impact sur nos réseaux.
              </p>
           </div>
           <div className="flex justify-center gap-6">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Facebook className="w-6 h-6" /></div>
              <div className="p-3 bg-pink-100 text-pink-600 rounded-xl"><Instagram className="w-6 h-6" /></div>
              <div className="p-3 bg-slate-100 text-slate-600 rounded-xl"><Smartphone className="w-6 h-6" /></div>
           </div>
           <div className="text-slate-500 text-sm md:text-right font-medium">
              SAYC Tchad Marketing Central <br/> © 2026 Tous droits réservés
           </div>
        </div>
      </div>
    </div>
  );
}
