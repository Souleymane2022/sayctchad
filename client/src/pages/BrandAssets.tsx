import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Download, Loader2, Image as ImageIcon, Sparkles, Megaphone, 
  Smartphone, Facebook, Instagram, MessageSquare, Calendar, 
  Award, Briefcase, User, GraduationCap, MapPin, Clock 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Imports des logos
import logoSayc from "@assets/LOGO_SAYC_1770103155971.jpg";
import smartAfricaAllianceLogo from "@assets/SMART_AFRICA_LOGO_1770443171460.png";
import sadaLogo from "@assets/SADA_1770443171461.jpg";

type Category = "formation" | "news" | "testimony" | "event";

export default function BrandAssets() {
  const { toast } = useToast();
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
    skill1: "CLOUD ARCHITECTURE",
    skill2: "PYTHON & LINUX",
    skill3: "NETWORKING & SECURITY",
    date: "Mai - Juillet 2026",
    location: "N'Djamena & En ligne",
    personName: "Mahamat Saleh",
    personRole: "Ancien Étudiant SADA",
    quote: "Grâce à SAYC, j'ai pu obtenir ma certification AWS et décrocher mon premier emploi dans le Cloud.",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=60"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const downloadPoster = async (elementId: string, filename: string) => {
    setDownloadingId(elementId);
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error("Element not found");

      // Give browser time to stabilize
      await new Promise(resolve => setTimeout(resolve, 500));

      const dataUrl = await toPng(element, { 
        quality: 1, 
        pixelRatio: 2, 
        width: 1080,
        height: 1080,
        cacheBust: true,
        skipFonts: true,
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
        title: "Support généré !",
        description: "Votre visuel HD est prêt pour les réseaux sociaux.",
      });
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-[#f1f5f9] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: EDITOR */}
        <Card className="lg:col-span-4 border-none shadow-xl rounded-3xl overflow-hidden h-fit sticky top-24">
          <div className="bg-[#0f172a] p-6 text-white text-center">
            <h2 className="text-2xl font-black tracking-tight mb-1 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-sayc-teal" /> Creative Studio
            </h2>
            <p className="text-slate-400 text-sm">Gérez le branding du chapitre en un clic</p>
          </div>
          
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <Label className="uppercase text-xs font-bold text-slate-500 tracking-widest">Catégorie de Visuel</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "formation", icon: GraduationCap, label: "Formation" },
                  { id: "news", icon: Megaphone, label: "Actualité" },
                  { id: "event", icon: Calendar, label: "Événement" },
                  { id: "testimony", icon: MessageSquare, label: "Témoignage" }
                ].map((cat) => (
                  <Button
                    key={cat.id}
                    variant={activeCategory === cat.id ? "default" : "outline"}
                    className={`gap-2 h-12 rounded-xl font-bold transition-all ${activeCategory === cat.id ? 'bg-sayc-teal hover:bg-sayc-teal/90 text-white' : ''}`}
                    onClick={() => setActiveCategory(cat.id as Category)}
                  >
                    <cat.icon className="w-4 h-4" /> {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <Label className="uppercase text-xs font-bold text-slate-500 tracking-widest">Contenu du Design</Label>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Ligne Titre 1</Label>
                    <Input name="titleLine1" value={formData.titleLine1} onChange={handleInputChange} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Ligne Titre 2</Label>
                    <Input name="titleLine2" value={formData.titleLine2} onChange={handleInputChange} className="rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Slogan / Sur-titre</Label>
                  <Input name="subtitle" value={formData.subtitle} onChange={handleInputChange} className="rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Badge de Catégorie</Label>
                  <Input name="badge" value={formData.badge} onChange={handleInputChange} className="rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Texte Principal / Citation</Label>
                  <Textarea name="mainText" value={formData.mainText} onChange={handleInputChange} className="rounded-xl min-h-[100px]" />
                </div>

                {activeCategory === "formation" && (
                   <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Compétence 1</Label>
                        <Input name="skill1" value={formData.skill1} onChange={handleInputChange} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Compétence 2</Label>
                        <Input name="skill2" value={formData.skill2} onChange={handleInputChange} className="rounded-xl" />
                      </div>
                   </div>
                )}

                {(activeCategory === "testimony" || activeCategory === "event") && (
                   <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label className="text-xs">Nom de la Personne / Lieu</Label>
                        <Input name="personName" value={formData.personName} onChange={handleInputChange} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">URL Photo / Date</Label>
                        <Input name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="rounded-xl" />
                      </div>
                   </div>
                )}
              </div>
            </div>

            <Button 
              className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-lg gap-3 shadow-lg transition-all active:scale-95"
              disabled={downloadingId !== null}
              onClick={() => downloadPoster(`poster-render`, `SAYC_Tchad_${activeCategory}_${Date.now()}.png`)}
            >
              {downloadingId ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
              GÉNÉRER LE VISUEL HD
            </Button>
          </CardContent>
        </Card>

        {/* RIGHT PANEL: PREVIEW & RENDER */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center space-y-8">
          
          <div className="text-center space-y-2">
            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm italic">Prévisualisation du Rendu Final</h3>
            <p className="text-slate-500 font-medium">Capture HD (1080x1080) garantie</p>
          </div>

          <div className="relative group bg-white p-4 rounded-[2.5rem] shadow-2xl border border-white/50 transition-all hover:scale-[1.02]">
            {/* SCALED PREVIEW ENGINE */}
            <div 
              style={{ transform: 'scale(0.6)', transformOrigin: 'center center', width: '1080px', height: '1080px' }} 
              className="my-[-216px]" // Adjusted overflow margin for 0.6 scale
            >
              <div 
                id="poster-render"
                className="w-[1080px] h-[1080px] relative overflow-hidden font-sans"
              >
                {/* --- TEMPLATE ENGINE --- */}
                
                {activeCategory === "formation" && (
                  <div className="w-full h-full bg-[#020202]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1a1a1a,transparent)] z-0" />
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[150px] z-0" />
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-orange-600 z-50 shadow-[10px_0_40px_rgba(234,88,12,0.3)]" />
                    
                    {/* Header Logos */}
                    <div className="absolute top-10 left-24 right-16 flex justify-between items-center z-30">
                      <div className="bg-white flex items-center gap-8 px-10 py-4 rounded-2xl shadow-xl border-b-4 border-slate-100">
                        <img src={logoSayc} alt="SAYC" className="h-[45px]" />
                        <div className="w-[1px] h-8 bg-slate-200" />
                        <img src={smartAfricaAllianceLogo} alt="Smart Africa" className="h-[32px]" />
                        <div className="w-[1px] h-8 bg-slate-200" />
                        <img src={sadaLogo} alt="SADA" className="h-[40px]" />
                      </div>
                      <div className="bg-[#e65100]/90 border border-white/20 px-8 py-4 rounded-2xl shadow-lg">
                        <p className="text-white font-black text-2xl uppercase italic tracking-tighter">{formData.badge}</p>
                      </div>
                    </div>

                    {/* Subtitle */}
                    <div className="absolute top-[180px] left-24 z-20">
                      <div className="px-6 py-2 border border-orange-600/40 rounded-full inline-block">
                        <p className="text-orange-500 font-extrabold text-xl uppercase tracking-[0.4em]">{formData.subtitle}</p>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="absolute top-[250px] left-24 z-20" style={{ fontFamily: 'sans-serif' }}>
                      <h1 className="text-[100px] font-black text-white leading-none tracking-tighter m-0 uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">{formData.titleLine1}</h1>
                      <h1 className="text-[140px] font-black text-orange-500 leading-none tracking-tighter m-0 uppercase mt-[10px] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">{formData.titleLine2}</h1>
                      <h1 className="text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ffcc00] leading-none tracking-[-0.05em] m-0 uppercase">{formData.titleLine3}</h1>
                    </div>

                    {/* Programme Blocks */}
                    <div className="absolute top-[650px] left-24 right-16 grid grid-cols-2 gap-10 z-20 items-stretch">
                      <div className="bg-white/10 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl h-full flex flex-col justify-center">
                        <h3 className="text-orange-500 font-black text-2xl uppercase tracking-widest mb-3 italic leading-none text-left">LE PROGRAMME</h3>
                        <p className="text-white/80 text-[1.2rem] font-bold leading-[1.3] text-left">{formData.mainText}</p>
                      </div>
                      <div className="flex flex-col gap-3 justify-center">
                        {[formData.skill1, formData.skill2, formData.skill3].map((skill, i) => (
                           <div key={i} className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4">
                              <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_15px_#ea580c]" />
                              <span className="text-white font-black text-[1.1rem] tracking-tight uppercase leading-none">{skill}</span>
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === "news" && (
                  <div className="w-full h-full bg-[#0a1d4a]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] to-black opacity-60 z-0" />
                    <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-sayc-teal/20 rounded-full blur-[120px] z-0" />
                    <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] z-0" />
                    
                    {/* Header Logos */}
                    <div className="absolute top-10 left-16 right-16 flex justify-between items-center z-30">
                      <div className="flex items-center gap-6">
                        <img src={logoSayc} alt="SAYC" className="h-[50px] bg-white p-2 rounded-xl" />
                      </div>
                      <div className="px-6 py-2 bg-orange-600 rounded-full">
                        <span className="text-white font-black text-xl uppercase tracking-widest">ACTUALITÉ</span>
                      </div>
                    </div>

                    <div className="absolute top-[200px] left-16 right-16 z-20 space-y-6">
                       <p className="text-orange-500 font-black text-3xl uppercase tracking-[0.5em]">{formData.subtitle}</p>
                       <h1 className="text-[120px] font-black text-white leading-[0.9] tracking-tighter uppercase break-words border-l-[15px] border-sayc-teal pl-10">
                          {formData.titleLine1} <br/>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sayc-teal to-blue-400">{formData.titleLine2}</span>
                       </h1>
                    </div>

                    <div className="absolute top-[650px] left-16 right-16 z-20 bg-white/5 border border-white/10 p-12 rounded-[3rem] shadow-2xl">
                       <p className="text-white font-bold text-[2rem] leading-[1.4] opacity-90 italic">
                          "{formData.mainText}"
                       </p>
                    </div>
                  </div>
                )}

                {activeCategory === "testimony" && (
                  <div className="w-full h-full bg-[#f8fafc]">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-white z-0" />
                    <div className="absolute top-0 right-0 w-full h-[400px] bg-[#0f172a] clip-path-polygon-[0_0,100%_0,100%_80%,0_100%] z-0" 
                      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)' }} 
                    />
                    
                    {/* Logos Fixed */}
                    <div className="absolute top-10 left-16 flex items-center gap-8 z-30">
                       <img src={logoSayc} alt="SAYC" className="h-[45px]" />
                       <div className="w-[1px] h-8 bg-white/20" />
                       <img src={smartAfricaAllianceLogo} alt="Smart Africa" className="h-[35px] brightness-0 invert" />
                    </div>

                    <div className="absolute top-[280px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                       <div className="w-[350px] h-[350px] rounded-full border-[15px] border-white shadow-2xl overflow-hidden bg-slate-200">
                          <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Profile" />
                       </div>
                    </div>

                    <div className="absolute top-[680px] left-0 w-full z-20 px-24 text-center">
                       <div className="relative inline-block mb-10">
                          <MessageSquare className="absolute -top-10 -left-12 w-20 h-20 text-sayc-teal/10 rotate-12" />
                          <p className="text-slate-800 font-bold text-[2.4rem] leading-[1.3] relative z-10 italic">
                             "{formData.mainText}"
                          </p>
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-[#0f172a] font-black text-4xl uppercase tracking-tight">{formData.personName}</h4>
                          <p className="text-sayc-teal font-bold text-xl uppercase tracking-widest">{formData.personRole}</p>
                       </div>
                    </div>
                  </div>
                )}

                {activeCategory === "event" && (
                  <div className="w-full h-full bg-slate-900">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1080&auto=format&fit=crop&q=80')] bg-cover bg-center brightness-[0.3] z-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-0" />
                    
                    {/* Event Logos */}
                    <div className="absolute top-10 left-16 right-16 flex justify-between items-center z-30">
                       <img src={logoSayc} alt="SAYC" className="h-[50px] bg-white p-2 rounded-xl" />
                       <div className="px-6 py-2 bg-sayc-teal rounded-full shadow-[0_0_30px_rgba(20,184,166,0.3)]">
                          <span className="text-white font-black text-xl uppercase tracking-[0.2em]">{formData.badge}</span>
                       </div>
                    </div>

                    <div className="absolute top-[250px] left-16 right-16 z-20 space-y-8">
                       <div className="flex items-center gap-4">
                          <div className="px-4 py-1 bg-white/10 border border-white/20 rounded-lg backdrop-blur-md">
                             <span className="text-sayc-teal font-black text-2xl uppercase">{formData.subtitle}</span>
                          </div>
                          <div className="h-[2px] w-20 bg-white/20" />
                       </div>
                       
                       <h1 className="text-[110px] font-black text-white leading-none tracking-tighter uppercase drop-shadow-2xl">
                          {formData.titleLine1} <br/>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sayc-teal to-blue-300">{formData.titleLine2}</span>
                       </h1>
                    </div>

                    <div className="absolute top-[680px] left-16 right-16 z-20 grid grid-cols-2 gap-8">
                       <div className="flex items-start gap-4">
                          <div className="p-4 bg-sayc-teal/20 rounded-2xl border border-sayc-teal/30">
                             <Calendar className="w-8 h-8 text-sayc-teal" />
                          </div>
                          <div>
                             <p className="text-white/40 font-bold uppercase text-sm tracking-widest mb-1">DATE & HEURE</p>
                             <p className="text-white font-bold text-2xl">{formData.date}</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-4">
                          <div className="p-4 bg-orange-600/20 rounded-2xl border border-orange-600/30">
                             <MapPin className="w-8 h-8 text-orange-500" />
                          </div>
                          <div>
                             <p className="text-white/40 font-bold uppercase text-sm tracking-widest mb-1">LIEU / PLATEFORME</p>
                             <p className="text-white font-bold text-2xl">{formData.location}</p>
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {/* --- UNIVERSAL FOOTER (Absolute Bottom) --- */}
                <div className="absolute bottom-0 inset-x-0 h-[150px] z-[60] px-16 flex items-center justify-between border-t border-white/5 bg-black/40 backdrop-blur-sm">
                  <div className="flex items-center gap-5">
                    <div className="p-5 bg-orange-600 rounded-2xl shadow-xl">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-black text-2xl uppercase leading-none">SAYC TCHAD</p>
                      <p className="text-orange-500 font-black text-lg uppercase tracking-widest mt-1">SMART AFRICA YOUTH CHAPTER</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[3.2rem] font-black text-white leading-none tracking-tighter uppercase whitespace-nowrap">
                      WWW.<span className="text-orange-500">SAYCTCHAD</span>.ORG
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Interaction Hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-[2.5rem] pointer-events-none z-[100]">
              <div className="bg-white text-[#0f172a] px-8 py-4 rounded-full font-black text-lg flex items-center gap-3 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <ImageIcon className="w-6 h-6 text-orange-500" /> MODE ÉDITION EN DIRECT
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* DASHBOARD BOTTOM INFO */}
      <div className="max-w-[1600px] mx-auto mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-8">
         <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-3">
            <Smartphone className="w-10 h-10 text-sayc-teal" />
            <h4 className="font-black uppercase tracking-tight">Format Social</h4>
            <p className="text-slate-500 text-sm">Visuels optimisés en 1080x1080 pour Instagram, Facebook et WhatsApp.</p>
         </div>
         <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-3">
            <Award className="w-10 h-10 text-orange-500" />
            <h4 className="font-black uppercase tracking-tight">Qualité Master</h4>
            <p className="text-slate-500 text-sm">Génération HD sans perte pour une impression ou un affichage premium.</p>
         </div>
         <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-3 md:col-span-2">
            <Briefcase className="w-10 h-10 text-[#0f172a]" />
            <h4 className="font-black uppercase tracking-tight">Identité Intégrée</h4>
            <p className="text-slate-500 text-sm">Chaque visuel intègre automatiquement les logos de SADA, Smart Africa et SAYC Tchad pour garantir la crédibilité du chapitre.</p>
         </div>
      </div>
    </div>
  );
}

function Zap({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
