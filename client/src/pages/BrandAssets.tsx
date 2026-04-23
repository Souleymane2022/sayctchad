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
                  className="w-[1080px] h-[1080px] bg-[#020202] relative overflow-hidden font-sans"
                >
                  {/* Background Accents */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1a1a1a,transparent)] z-0" />
                  <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[150px] z-0" />
                  
                  {/* HUGE Background Logo (The "Cool" SAYC background) */}
                  <div className="absolute top-[15%] right-[-200px] scale-[4] opacity-[0.04] grayscale invert select-none pointer-events-none z-0">
                    <img src={logoSayc} alt="" className="w-[500px]" />
                  </div>

                  {/* Left Decoration Bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-orange-600 z-50 shadow-[5px_0_30px_#ea580c]" />

                  {/* HEADER AREA */}
                  <div className="absolute top-12 left-20 right-20 flex justify-between items-center z-30">
                    <div className="bg-white flex items-center gap-8 px-10 py-5 rounded-3xl shadow-2xl border-b-[10px] border-orange-600">
                       <img src={logoSayc} alt="SAYC" className="h-[60px]" />
                       <div className="w-[2px] h-10 bg-slate-100" />
                       <img src={smartAfricaAllianceLogo} alt="Smart Africa" className="h-[45px]" />
                       <div className="w-[2px] h-10 bg-slate-100" />
                       <img src={sadaLogo} alt="SADA" className="h-[55px]" />
                    </div>
                    <div className="text-right">
                       <p className="text-orange-500 font-black text-2xl tracking-[0.3em] uppercase mb-1">Session 2026</p>
                       <div className="h-1 w-32 bg-orange-600 ml-auto rounded-full" />
                    </div>
                  </div>

                  {/* TARGET DESIGN IMPLEMENTATION - EXACTLY AS REQUESTED */}
                  
                  {/* Left Accent Bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-orange-600 z-50 shadow-[10px_0_40px_rgba(234,88,12,0.3)]" />

                  {/* HUGE Background Logo */}
                  <div className="absolute top-[20%] right-[-200px] scale-[4.5] opacity-[0.03] grayscale invert select-none pointer-events-none z-0">
                    <img src={logoSayc} alt="" className="w-[500px]" />
                  </div>

                  {/* HEADER AREA */}
                  <div className="absolute top-12 left-24 right-16 flex justify-between items-start z-30">
                    <div className="bg-white flex items-center gap-8 px-10 py-5 rounded-3xl shadow-2xl">
                       <img src={logoSayc} alt="SAYC" className="h-[55px]" />
                       <div className="w-[1px] h-10 bg-slate-200" />
                       <img src={smartAfricaAllianceLogo} alt="Smart Africa" className="h-[40px]" />
                       <div className="w-[1px] h-10 bg-slate-200" />
                       <img src={sadaLogo} alt="SADA" className="h-[50px]" />
                    </div>
                    <div className="bg-[#e65100] px-10 py-6 rounded-3xl shadow-2xl border-b-8 border-black/20">
                       <p className="text-white font-black text-[2.2rem] leading-[1.0] uppercase italic tracking-tighter">
                          FORMATION <br/> AWS
                       </p>
                    </div>
                  </div>

                  {/* SUBTITLE */}
                  <div className="absolute top-[210px] left-24 z-20">
                     <div className="px-8 py-3 border-2 border-orange-600/50 rounded-full inline-block">
                        <p className="text-orange-500 font-black text-2xl uppercase tracking-[0.3em]">
                           PROCHAINEMENT AU TCHAD
                        </p>
                     </div>
                  </div>

                  {/* MAIN TITLE - ADJUSTED POSITION TO PREVENT OVERLAP */}
                  <div className="absolute top-[260px] left-24 z-20">
                     <h1 className="text-[115px] font-black text-white leading-none tracking-tighter m-0 uppercase">
                        LANCEZ VOTRE
                     </h1>
                     <h1 className="text-[155px] font-black text-orange-500 leading-none tracking-tighter m-0 uppercase mt-[10px]">
                        CARRIÈRE
                     </h1>
                     <h1 className="text-[165px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ffcc00] leading-none tracking-[-0.05em] m-0 uppercase">
                        CLOUD
                     </h1>
                  </div>

                  {/* TWO COLUMNS SECTION - SHIFTED DOWN FOR CLEARANCE */}
                  <div className="absolute top-[690px] left-24 right-16 grid grid-cols-2 gap-10 z-20">
                     {/* Left Column: Le Programme */}
                     <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl h-[230px] flex flex-col justify-center">
                        <h3 className="text-orange-500 font-black text-3xl uppercase tracking-widest mb-4 italic leading-none">LE PROGRAMME</h3>
                        <p className="text-white/80 text-[1.4rem] font-bold leading-[1.3]">
                           Un cursus intensif de 12 semaines pour maîtriser les technologies Amazon Web Services (AWS).
                        </p>
                     </div>

                     {/* Right Column: Skills Stack */}
                     <div className="flex flex-col gap-3">
                        {[
                           "CLOUD ARCHITECTURE",
                           "PYTHON & LINUX",
                           "NETWORKING & SECURITY",
                           "DATABASE MANAGEMENT"
                        ].map((skill, i) => (
                           <div key={i} className="bg-white/10 backdrop-blur-md px-8 py-3 rounded-2xl border border-white/10 flex items-center gap-6">
                              <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_15px_#ea580c]" />
                              <span className="text-white font-black text-xl tracking-tight uppercase leading-none">{skill}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* FOOTER AREA - FINAL REFINEMENT FOR PERFECT ALIGNMENT */}
                  <div className="absolute bottom-12 left-24 right-20 flex justify-between items-end z-40">
                     {/* Left: Scholarship Info */}
                     <div className="flex items-center gap-8">
                        <div className="p-7 bg-orange-600 rounded-[2rem] shadow-2xl">
                           <Sparkles className="w-12 h-12 text-white" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-white font-black text-[2.8rem] uppercase tracking-tighter leading-none">FORMATION 100% GRATUITE</p>
                           <p className="text-orange-500 font-bold text-2xl uppercase tracking-[0.2em] leading-none">SOUTENUE PAR SMART AFRICA ACADEMY</p>
                        </div>
                     </div>

                     {/* Right: Registration URL */}
                     <div className="text-right pb-1">
                        <p className="text-white/30 font-black uppercase tracking-[0.6em] text-xl mb-4">INCRIVEZ-VOUS SUR</p>
                        <p className="text-[5.8rem] font-black text-white leading-none tracking-tighter uppercase">
                           WWW.<span className="text-orange-500">SAYCTCHAD</span>.ORG
                        </p>
                     </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_bottom_right,#ea580c22,transparent)] z-10" />
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
