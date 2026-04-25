import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Download, Loader2, Image as ImageIcon, Sparkles, Megaphone, 
  Smartphone, Facebook, Instagram, MessageSquare, Calendar, 
  Award, Briefcase, GraduationCap, MapPin, Zap, Upload, Quote, Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Imports des logos
import logoSayc from "@assets/LOGO_SAYC_1770103155971.jpg";
import smartAfricaAllianceLogo from "@assets/SMART_AFRICA_LOGO_1770443171460.png";
import sadaLogo from "@assets/SADA_1770443171461.jpg";

type Category = "formation" | "news" | "testimony" | "event";

export default function BrandAssets() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("formation");
  
  // Dynamic State for Editor
  const [formData, setFormData] = useState({
    titleLine1: "LANCEZ VOTRE",
    titleLine2: "CARRIÈRE",
    titleLine3: "CLOUD",
    subtitle: "PROCHAINEMENT AU TCHAD",
    badge: "FORMATION AWS",
    mainText: "Un cursus intensif de 12 semaines pour maîtriser les technologies Amazon Web Services (AWS).",
    skill1: "ARCHITECTURES CLOUD",
    skill2: "DEV OPS & LINUX",
    skill3: "SÉCURITÉ RÉSEAU",
    date: "Mai - Juillet 2026",
    location: "N'Djamena & En ligne",
    personName: "MAHAMAT SALEH",
    personRole: "Ancien Étudiant SADA",
    quote: "Grâce à SAYC, j'ai pu obtenir ma certification AWS et décrocher mon premier emploi dans le Cloud.",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=60"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
      toast({ title: "Image importée !", description: "Votre photo a été chargée dans le design." });
    }
  };

  const downloadPoster = async (elementId: string, filename: string) => {
    setDownloadingId(elementId);
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error("Element not found");

      await new Promise(resolve => setTimeout(resolve, 800)); // Longer wait for font rendering

      const dataUrl = await toPng(element, { 
        quality: 1, 
        pixelRatio: 2.5, // Even higher quality
        width: 1080,
        height: 1080,
        cacheBust: true,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
      
      toast({ title: "Visuel d'Élite Généré !", description: "Votre support est prêt pour une diffusion nationale." });
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur", description: "Échec de la génération HD.", variant: "destructive" });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 pt-24 pb-12 px-4 md:px-8 font-sans selection:bg-orange-500/30">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT PANEL: ELITE DASHBOARD */}
        <Card className="lg:col-span-4 bg-[#14171f] border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden h-fit sticky top-24">
          <div className="bg-gradient-to-r from-[#0f172a] to-slate-900 p-8 border-b border-slate-800">
            <h2 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3 text-white">
              <div className="p-2 bg-sayc-teal/20 rounded-xl">
                 <Sparkles className="w-6 h-6 text-sayc-teal" />
              </div>
              Creative Studio
            </h2>
            <p className="text-slate-400 font-medium">Design System automatisé pour SAYC Tchad</p>
          </div>
          
          <CardContent className="p-8 space-y-8">
            {/* Category Selector */}
            <div className="space-y-4">
              <Label className="uppercase text-xs font-bold text-slate-500 tracking-[0.2em]">TYPE DE COMMUNICATION</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "formation", icon: GraduationCap, label: "Formation" },
                  { id: "news", icon: Megaphone, label: "Actualité" },
                  { id: "event", icon: Calendar, label: "Événement" },
                  { id: "testimony", icon: MessageSquare, label: "Témoignage" }
                ].map((cat) => (
                  <Button
                    key={cat.id}
                    variant="outline"
                    className={`h-14 rounded-2xl font-black transition-all border-slate-800 hover:bg-slate-800/50 ${activeCategory === cat.id ? 'bg-orange-600 border-orange-500 text-white hover:bg-orange-700' : 'bg-transparent text-slate-400'}`}
                    onClick={() => setActiveCategory(cat.id as Category)}
                  >
                    <cat.icon className="w-5 h-5 mr-2" /> {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Dynamic Content Form */}
            <div className="space-y-6 pt-6 border-t border-slate-800">
               <Label className="uppercase text-xs font-bold text-slate-500 tracking-[0.2em]">CONFIGURATION DU CONTENU</Label>
               
               <div className="grid gap-5">
                  {(activeCategory === "formation" || activeCategory === "news" || activeCategory === "event") && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-400 text-xs font-bold">ACCROCHE HAUTE</Label>
                          <Input name="titleLine1" value={formData.titleLine1} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl h-12 text-white font-bold" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-400 text-xs font-bold">MOT CLÉ IMPACT</Label>
                          <Input name="titleLine2" value={formData.titleLine2} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl h-12 text-orange-500 font-bold" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-xs font-bold">SUR-TITRE (BADGE)</Label>
                        <Input name="subtitle" value={formData.subtitle} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl h-12" />
                      </div>
                    </>
                  )}

                  {activeCategory === "testimony" && (
                    <>
                       <div className="space-y-2">
                          <Label className="text-slate-400 text-xs font-bold">NOM COMPLET</Label>
                          <Input name="personName" value={formData.personName} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl h-12 font-bold" />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-slate-400 text-xs font-bold">RÔLE / TITRE</Label>
                          <Input name="personRole" value={formData.personRole} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl h-12" />
                       </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label className="text-slate-400 text-xs font-bold">{activeCategory === "testimony" ? "LE TÉMOIGNAGE (CITATION)" : "DÉTAILS OU DESCRIPTION"}</Label>
                    <Textarea name="mainText" value={formData.mainText} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl min-h-[100px] text-white" />
                  </div>

                  {(activeCategory === "event" || activeCategory === "formation") && (
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="text-slate-400 text-xs font-bold">{activeCategory === "event" ? "DATE / HEURE" : "COMPÉTENCE 1"}</Label>
                          <Input name={activeCategory === "event" ? "date" : "skill1"} value={activeCategory === "event" ? formData.date : formData.skill1} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl h-12" />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-slate-400 text-xs font-bold">{activeCategory === "event" ? "LIEU" : "COMPÉTENCE 2"}</Label>
                          <Input name={activeCategory === "event" ? "location" : "skill2"} value={activeCategory === "event" ? formData.location : formData.skill2} onChange={handleInputChange} className="bg-slate-900 border-slate-800 rounded-xl h-12" />
                       </div>
                    </div>
                  )}

                  <div className="space-y-4 pt-4">
                    <Label className="text-slate-400 text-xs font-bold">VISUEL / PHOTO</Label>
                    <div className="flex gap-3">
                       <Input 
                        placeholder="URL de l'image..." 
                        name="imageUrl" 
                        value={formData.imageUrl} 
                        onChange={handleInputChange} 
                        className="bg-slate-900 border-slate-800 rounded-xl h-12 flex-1" 
                       />
                       <Button 
                        variant="secondary" 
                        className="rounded-xl h-12 px-6 font-bold bg-slate-800 hover:bg-slate-700 text-white"
                        onClick={() => fileInputRef.current?.click()}
                       >
                         <Upload className="w-4 h-4 mr-2" /> Import
                       </Button>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>
               </div>
            </div>

            <Button 
              className="w-full h-16 rounded-[1.5rem] bg-orange-600 hover:bg-orange-700 text-white font-black text-xl gap-3 shadow-[0_10px_30px_rgba(234,88,12,0.4)] transition-all active:scale-95"
              disabled={downloadingId !== null}
              onClick={() => downloadPoster(`poster-render`, `SAYC_Creative_${activeCategory}_${Date.now()}.png`)}
            >
              {downloadingId ? <Loader2 className="w-7 h-7 animate-spin" /> : <Download className="w-7 h-7" />}
              EXPORTATION HAUTE DÉFINITION
            </Button>
          </CardContent>
        </Card>

        {/* RIGHT PANEL: ELITE PREVIEW ENGINE */}
        <div className="lg:col-span-8 flex flex-col items-center w-full px-0 space-y-10">
          
          <div className="text-center space-y-3">
            <div className="inline-block px-4 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
               <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Aperçu Réel 1080x1080</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Vérification de Rendu</h1>
          </div>

          <div className="relative group bg-[#1a1d27] p-8 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] border border-slate-800 w-fit mx-auto overflow-hidden">
            <div className="overflow-hidden w-[600px] h-[600px] relative rounded-[2rem] bg-[#020202] ring-1 ring-white/10 shadow-2xl">
              <div 
                style={{ 
                  transform: 'scale(0.5555)', // To fit 1080 into 600
                  transformOrigin: 'top center', 
                  width: '1080px', 
                  height: '1080px',
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-540px'
                }} 
              >
                <div 
                  id="poster-render"
                  className="w-[1080px] h-[1080px] relative overflow-hidden text-white font-sans"
                >
                  {/* --- ULTIMATE TEMPLATE ENGINE --- */}
                  
                  {activeCategory === "formation" && (
                    <div className="w-full h-full bg-[#020202]">
                       {/* Background FX */}
                       <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c0c] to-black z-0" />
                       <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[180px] z-0 animate-pulse" />
                       <div className="absolute top-[20%] right-[-200px] scale-[4] opacity-[0.03] grayscale invert select-none pointer-events-none z-0">
                          <img src={logoSayc} alt="" className="w-[500px]" />
                       </div>

                       {/* Decorative sidebar */}
                       <div className="absolute left-0 top-0 bottom-0 w-8 bg-orange-600 z-50" />
                       <div className="absolute left-8 top-0 bottom-0 w-8 bg-orange-600/20 z-40" />

                       {/* Header Bar */}
                       <div className="absolute top-12 left-28 right-20 flex justify-between items-center z-30">
                          <div className="bg-white flex items-center gap-10 px-12 py-5 rounded-[2rem] shadow-2xl">
                             <img src={logoSayc} alt="SAYC" className="h-[55px]" />
                             <div className="w-[1px] h-10 bg-slate-200" />
                             <img src={smartAfricaAllianceLogo} alt="Smart Africa" className="h-[40px]" />
                             <div className="w-[1px] h-10 bg-slate-200" />
                             <img src={sadaLogo} alt="SADA" className="h-[50px]" />
                          </div>
                          <div className="bg-orange-600 px-10 py-5 rounded-[2rem] shadow-2xl">
                             <span className="text-white font-black text-2xl uppercase tracking-widest">{formData.badge}</span>
                          </div>
                       </div>

                       {/* Headline */}
                       <div className="absolute top-[210px] left-28 z-20">
                          <p className="text-orange-500 font-black text-[2.2rem] uppercase tracking-[0.5em] mb-4 drop-shadow-md">{formData.subtitle}</p>
                          <h1 className="text-[120px] font-black text-white leading-[0.85] tracking-tighter m-0 uppercase drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
                             {formData.titleLine1} <br/>
                             <span className="text-orange-600">{formData.titleLine2}</span> <br/>
                             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ffcc00] leading-none tracking-[-0.05em]">{formData.titleLine3}</span>
                          </h1>
                       </div>

                       {/* Content Split */}
                       <div className="absolute top-[710px] left-28 right-20 grid grid-cols-2 gap-12 z-20">
                          <div className="bg-white/5 border-l-8 border-orange-600 p-10 shadow-2xl backdrop-blur-3xl rounded-[2.5rem]">
                             <h4 className="text-orange-500 font-black text-2xl uppercase tracking-widest mb-4">PROGRAMME</h4>
                             <p className="text-slate-300 font-bold text-[1.4rem] leading-[1.3]">{formData.mainText}</p>
                          </div>
                          <div className="flex flex-col gap-4 justify-center">
                             {[formData.skill1, formData.skill2, formData.skill3].map((s, i) => (
                                <div key={i} className="flex items-center gap-6 bg-white/10 px-8 py-4 rounded-2xl border border-white/5">
                                   <div className="w-4 h-4 bg-orange-600 rounded-full shadow-[0_0_20px_#ea580c]" />
                                   <span className="text-white font-black text-xl uppercase tracking-tight">{s}</span>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  )}

                  {activeCategory === "news" && (
                    <div className="w-full h-full bg-[#050510]">
                       <div className="absolute inset-0 bg-gradient-to-tr from-[#1e40af] via-black to-[#1e1e1e] opacity-80 z-0" />
                       <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] grayscale z-0" />
                       
                       <div className="absolute top-12 left-16 right-16 flex justify-between items-center z-30">
                          <img src={logoSayc} alt="SAYC" className="h-[60px] bg-white p-3 rounded-2xl shadow-xl" />
                          <div className="px-10 py-4 bg-orange-600 rounded-full shadow-[0_0_40px_rgba(234,88,12,0.3)]">
                             <span className="text-white font-black text-2xl uppercase tracking-[0.3em]">BREAKING NEWS</span>
                          </div>
                       </div>

                       <div className="absolute top-[220px] left-16 right-16 z-20">
                          <p className="text-sayc-teal font-black text-4xl uppercase tracking-[0.5em] mb-10">{formData.subtitle}</p>
                          <h1 className="text-[140px] font-black text-white leading-[0.9] tracking-tighter uppercase italic select-none">
                             {formData.titleLine1} <br/>
                             <span className="text-transparent bg-clip-text bg-gradient-to-r from-sayc-teal to-blue-400 drop-shadow-2xl">{formData.titleLine2}</span>
                          </h1>
                       </div>

                       <div className="absolute bottom-[200px] left-16 right-16 z-20">
                          <div className="bg-white/5 border border-white/10 backdrop-blur-3xl p-16 rounded-[4rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                             <Quote className="w-20 h-20 text-sayc-teal opacity-20 absolute top-[-30px] right-8" />
                             <p className="text-white font-bold text-[2.6rem] leading-[1.3] text-left">
                                {formData.mainText}
                             </p>
                          </div>
                       </div>
                    </div>
                  )}

                  {activeCategory === "testimony" && (
                    <div className="w-full h-full bg-slate-50 text-slate-900">
                       <div className="absolute top-0 right-0 w-[550px] h-full bg-[#0f172a] clip-path-polygon-[20%_0,100%_0,100%_100%,0_%100%]" 
                          style={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)' }} />
                       
                       <div className="absolute top-12 left-16 z-30 flex items-center gap-10">
                          <img src={logoSayc} alt="SAYC" className="h-[50px]" />
                          <div className="w-[1px] h-8 bg-slate-300" />
                          <img src={smartAfricaAllianceLogo} alt="Smart Africa" className="h-[40px] grayscale" />
                       </div>

                       <div className="absolute top-[200px] left-16 w-[550px] z-20">
                          <Quote className="w-[150px] h-[150px] text-sayc-teal/10 absolute -top-12 -left-12" />
                          <p className="text-[#0f172a] font-black text-[3.2rem] leading-[1.15] italic mb-16 relative z-10">
                             "{formData.mainText}"
                          </p>
                          <div className="space-y-2">
                             <div className="w-20 h-2 bg-orange-600 rounded-full" />
                             <h4 className="text-4xl font-black uppercase tracking-tight text-[#0f172a]">{formData.personName}</h4>
                             <p className="text-sayc-teal font-bold text-xl uppercase tracking-widest">{formData.personRole}</p>
                          </div>
                       </div>

                       <div className="absolute inset-y-0 right-[-50px] w-[650px] z-10 p-24 pr-[150px] flex items-center">
                          <div className="w-full aspect-square rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-[15px] border-white overflow-hidden rotate-[3deg]">
                             <img src={formData.imageUrl} alt="Profile" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" />
                          </div>
                       </div>
                    </div>
                  )}

                  {activeCategory === "event" && (
                     <div className="w-full h-full bg-[#050510] overflow-hidden">
                        <img src={formData.imageUrl} className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm opacity-40" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/80 to-transparent z-0" />
                        
                        <div className="absolute top-12 left-16 right-16 flex justify-between items-center z-30">
                           <img src={logoSayc} alt="SAYC" className="h-[55px] bg-white p-3 rounded-2xl" />
                           <div className="bg-orange-600 px-8 py-3 rounded-full">
                              <span className="text-white font-black text-2xl uppercase tracking-widest">{formData.badge}</span>
                           </div>
                        </div>

                        <div className="absolute top-[280px] left-16 right-16 z-20 space-y-10 group">
                           <div className="inline-block px-6 py-2 bg-sayc-teal/20 border border-sayc-teal/30 rounded-xl">
                              <span className="text-sayc-teal font-black text-[2.2rem] uppercase italic tracking-[0.4em]">{formData.subtitle}</span>
                           </div>
                           <h1 className="text-[130px] font-black text-white leading-none tracking-tighter uppercase drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                              {formData.titleLine1} <br/>
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sayc-teal to-blue-400">{formData.titleLine2}</span>
                           </h1>
                        </div>

                        <div className="absolute top-[700px] left-16 right-16 z-20 grid grid-cols-2 gap-12">
                           <div className="flex items-center gap-8 bg-white/5 border border-white/10 p-8 rounded-[3rem] shadow-2xl backdrop-blur-xl">
                              <div className="p-5 bg-sayc-teal/20 rounded-[1.5rem]"><Clock className="w-10 h-10 text-sayc-teal" /></div>
                              <div>
                                 <p className="text-slate-400 font-bold uppercase text-sm tracking-widest mb-1">HORAIRE & DATE</p>
                                 <p className="text-white font-black text-[2rem] leading-none">{formData.date}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-8 bg-white/5 border border-white/10 p-8 rounded-[3rem] shadow-2xl backdrop-blur-xl">
                              <div className="p-5 bg-orange-600/20 rounded-[1.5rem]"><MapPin className="w-10 h-10 text-orange-600" /></div>
                              <div>
                                 <p className="text-slate-400 font-bold uppercase text-sm tracking-widest mb-1">LOCALISATION</p>
                                 <p className="text-white font-black text-[2rem] leading-none">{formData.location}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* UNIVERSAL ELITE FOOTER */}
                  <div className="absolute bottom-0 inset-x-0 h-[170px] z-[60] px-16 flex items-center justify-between border-t border-white/10 bg-black/50 backdrop-blur-3xl">
                    <div className="flex items-center gap-6">
                      <div className="p-6 bg-orange-600 rounded-[2rem] shadow-[0_0_40px_rgba(234,88,12,0.5)]">
                        <Zap className="w-10 h-10 text-white animate-pulse" />
                      </div>
                      <div>
                        <p className="text-white font-black text-3xl uppercase tracking-tighter leading-none">SAYC TCHAD</p>
                        <p className="text-orange-500 font-black text-xl uppercase tracking-[0.3em] mt-2">SMART AFRICA YOUTH CHAPTER</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 font-bold uppercase tracking-[0.5em] text-lg mb-2">OFFICIEL</p>
                      <p className="text-[3.8rem] font-black text-white leading-none tracking-tighter uppercase">
                        WWW.<span className="text-orange-500">SAYCTCHAD</span>.ORG
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Elite Hint Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-[3.5rem] pointer-events-none z-[100]">
              <div className="bg-white text-[#0f172a] px-10 py-5 rounded-full font-black text-xl flex items-center gap-4 shadow-2xl transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                <div className="w-3 h-3 bg-sayc-teal rounded-full animate-ping" />
                DÉTAILS HD PRÊTS
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* DASHBOARD BOTTOM INFO */}
      <div className="max-w-[1600px] mx-auto mt-20 pt-16 border-t border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-12 text-slate-400">
         <div className="space-y-4">
            <h4 className="text-white font-black text-lg uppercase tracking-widest">SAYC STUDIO</h4>
            <p className="text-sm leading-relaxed italic">"Propulser le leadership des jeunes tchadiens par une identité visuelle forte et inspirante."</p>
         </div>
         <div className="space-y-4">
            <h4 className="text-white font-black text-lg uppercase tracking-widest">RÉSEAUX</h4>
            <p className="text-sm">Optimisé pour Facebook, Instagram, LinkedIn et WhatsApp Business.</p>
         </div>
         <div className="space-y-4">
            <h4 className="text-white font-black text-lg uppercase tracking-widest">QUALITÉ</h4>
            <p className="text-sm font-bold text-orange-500">Résolution 4K Supersampling <br/> export HDR via HTML-to-Image.</p>
         </div>
         <div className="text-right space-y-4">
            <h4 className="text-white font-black text-lg uppercase tracking-widest">CRÉDITS</h4>
            <p className="text-xs">© 2026 Smart Africa Youth Chapter Tchad <br/> Marketing & Branding Division</p>
         </div>
      </div>
    </div>
  );
}
