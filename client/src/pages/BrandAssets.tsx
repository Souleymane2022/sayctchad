import { useState, useRef, useEffect } from "react";
import { toPng, toBlob } from "html-to-image";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Download, Loader2, Image as ImageIcon, Sparkles, Megaphone, 
  Smartphone, Facebook, Instagram, MessageSquare, Calendar, 
  Award, Briefcase, GraduationCap, MapPin, Zap, Upload, Quote, Clock, Lock, Shield, Vote, Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Imports des logos
import logoSayc from "@assets/LOGO_SAYC_1770103155971.jpg";
import smartAfricaAllianceLogo from "@assets/SMART_AFRICA_LOGO_1770443171460.png";
import sadaLogo from "@assets/SADA_1770443171461.jpg";

type Category = "formation" | "news" | "testimony" | "event" | "announcement";

function BrandLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (pw: string) => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      return data;
    },
    onSuccess: () => {
      onLogin();
      toast({ title: "Accès Autorisé", description: "Bienvenue dans le Creative Studio" });
    },
    onError: (err: any) => {
      setErrorMessage(err?.error || "Mot de passe incorrect");
    },
  });

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-[#14171f] border-slate-800 shadow-2xl rounded-[2rem] space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-orange-600/20 rounded-2xl">
            <Lock className="h-10 w-10 text-orange-500" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-white">Creative Studio</h1>
            <p className="text-sm text-slate-400">Accès restreint aux administrateurs</p>
          </div>
        </div>
        
        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-sm text-destructive text-center font-bold">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginMutation.mutate(password);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label className="text-slate-400 font-bold uppercase text-[10px] tracking-widest px-1">MOT DE PASSE</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-900 border-slate-800 h-14 rounded-xl text-white"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full h-14 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-lg shadow-lg" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? <Loader2 className="animate-spin" /> : "Vérifier l'identitié"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function BrandAssets() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("formation");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  // Auth Check
  useQuery({
    queryKey: ["/api/admin/check-brand"],
    queryFn: async () => {
      const res = await fetch("/api/admin/check", { credentials: "include" });
      const data = await res.json();
      setIsAuthenticated(data.isAdmin);
      setChecking(false);
      return data;
    },
  });

  // Load real candidates from API
  const { data: candidates } = useQuery<any[]>({
    queryKey: ["/api/elections/candidates"],
    enabled: isAuthenticated,
  });

  // Identifie le Leader National (Priorité absolue à Souleymane)
  const nationalLeader = (() => {
    if (!candidates) return null;
    const souleymane = candidates.find(c => {
      const fn = (c.firstName || c.first_name || "").toLowerCase();
      const ln = (c.nomSpecifiqueUnique || c.last_name || "").toLowerCase();
      return fn.includes("souleymane") || fn.includes("mahmat") || ln.includes("saleh");
    });
    // Ensure we don't pick Mounir as Souleymane if Mounir is found first
    const realSouleymane = candidates.find(c => (c.firstName || "").toLowerCase().includes("souleymane"));
    if (realSouleymane) return realSouleymane;
    
    if (souleymane) return souleymane;
    return [...candidates].sort((a, b) => (b.votesCount ?? b.votes_count ?? 0) - (a.votesCount ?? a.votes_count ?? 0))[0];
  })();

  // Liste officielle des finalistes
  const finalistsList = ["souleymane", "mounir", "allamine", "jérémie", "adeline", "jeremie"];

  // Build Bureau National: top vote-getter per role among actual finalists
  const bureauNational = (() => {
    if (!candidates) return null;
    const roles = ["Leader Adjoint", "Secteur Privé", "Académique", "Inclusion"];
    
    // Filtrer les candidats pour ne garder que les finalistes officiels
    const filteredCandidates = candidates.filter(c => {
      const fn = (c.firstName || c.first_name || "").toLowerCase();
      const ln = (c.nomSpecifiqueUnique || c.last_name || "").toLowerCase();
      return finalistsList.some(name => fn.includes(name) || ln.includes(name));
    });

    return roles.map(role => {
      let leaderCandidates = filteredCandidates.filter(c => c.role === role && c.id !== nationalLeader?.id);
      
      // Force Mounir en Leader Adjoint s'il est présent et pas déjà National Leader
      if (role === "Leader Adjoint") {
        const mounir = filteredCandidates.find(c => {
          const fn = (c.firstName || c.first_name || "").toLowerCase();
          return fn.includes("mounir") && c.id !== nationalLeader?.id;
        });
        if (mounir) return { role, leader: mounir };
      }

      const sorted = leaderCandidates.sort((a, b) => (b.votesCount ?? b.votes_count ?? 0) - (a.votesCount ?? a.votes_count ?? 0));
      const leader = sorted[0];

      // Override photo pour Adeline
      if (leader) {
        const fn = (leader.firstName || leader.first_name || "").toLowerCase();
        if (fn.includes("adeline")) {
          leader.photoUrl = "/images/adeline.jpg";
        }
      }

      return { role, leader: leader };
    }).filter(b => b.leader);
  })();
  
  // Dynamic State for Editor
  const [formData, setFormData] = useState({
    titleLine1: "LANCEZ VOTRE",
    titleLine2: "CARRIÈRE",
    titleLine3: "CLOUD",
    subtitle: "PROCHAINEMENT AU TCHAD",
    badge: "FORMATION AWS",
    mainText: "Mon expérience avec la formation SADA a été une révélation. Ce cursus intensif de 12 semaines m'a non seulement permis de maîtriser les technologies complexes d'Amazon Web Services (AWS), mais il a aussi totalement transformé ma perspective de carrière.\\n\\nL'encadrement expert et les projets pratiques ont fait toute la différence. Aujourd'hui, je me sens pleinement outillé pour relever les défis du cloud computing en Afrique avec le soutien de Smart Africa et du SAYC Tchad.",
    skill1: "ARCHITECTURES CLOUD",
    skill2: "DEV OPS & LINUX",
    skill3: "SÉCURITÉ RÉSEAU",
    date: "Mai - Juillet 2026",
    location: "N'Djamena & En ligne",
    personName: "MAHAMAT SALEH",
    personRole: "Ancien Étudiant SADA",
    quote: "Grâce au SAYC Tchad, j'ai pu obtenir ma certification AWS et décrocher mon premier emploi dans le Cloud.",
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

      const images = element.getElementsByTagName('img');
      const imageConversionPromises = Array.from(images).map(async (img) => {
        try {
          const response = await fetch(img.src, { mode: 'cors' });
          const blob = await response.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              img.src = reader.result as string;
              resolve(true);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          console.warn("Could not pre-process image for export:", img.src);
        }
      });

      await Promise.all(imageConversionPromises);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const blob = await toBlob(element, { 
        quality: 0.95, 
        pixelRatio: 2, 
        width: 1080,
        height: 1080,
        cacheBust: true,
      });

      if (!blob) throw new Error("Blob generation failed");
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 5000);
      
      toast({ title: "Visuel Généré !", description: "Votre support est prêt." });
    } catch (err) {
      console.error("Export error:", err);
      toast({ title: "Erreur d'exportation", description: "Le rendu a échoué. Vérifiez votre connexion.", variant: "destructive" });
    } finally {
      setDownloadingId(null);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <BrandLogin onLogin={() => setIsAuthenticated(true)} />;
  }

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
            <div className="space-y-4">
              <Label className="uppercase text-xs font-bold text-slate-500 tracking-[0.2em]">TYPE DE COMMUNICATION</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "formation", icon: GraduationCap, label: "Formation" },
                  { id: "news", icon: Megaphone, label: "Actualité" },
                  { id: "event", icon: Calendar, label: "Événement" },
                  { id: "testimony", icon: Users, label: "Bureau National" },
                  { id: "announcement", icon: Megaphone, label: "Annonce" }
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

            <div className="space-y-6 pt-6 border-t border-slate-800">
               <Label className="uppercase text-xs font-bold text-slate-500 tracking-[0.2em]">CONFIGURATION DU CONTENU ({activeCategory.toUpperCase()})</Label>
               
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
                  transform: 'scale(0.5555)',
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
                  {activeCategory === "formation" && (
                    <div className="w-full h-full bg-[#020202]">
                       <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c0c] to-black z-0" />
                       <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[180px] z-0 animate-pulse" />
                       <div className="absolute top-[20%] right-[-200px] scale-[4] opacity-[0.03] grayscale invert select-none pointer-events-none z-0">
                          <img src={logoSayc} alt="" className="w-[500px]" />
                       </div>
                       <div className="absolute left-0 top-0 bottom-0 w-8 bg-orange-600 z-50" />
                       <div className="absolute left-8 top-0 bottom-0 w-8 bg-orange-600/20 z-40" />

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

                       <div className="absolute top-[210px] left-28 z-20">
                          <p className="text-orange-500 font-black text-[2.2rem] uppercase tracking-[0.5em] mb-4 drop-shadow-md">{formData.subtitle}</p>
                          <h1 className="text-[120px] font-black text-white leading-[0.85] tracking-tighter m-0 uppercase drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
                             {formData.titleLine1} <br/>
                             <span className="text-orange-600">{formData.titleLine2}</span> <br/>
                             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ffcc00] leading-none tracking-[-0.05em]">{formData.titleLine3}</span>
                          </h1>
                       </div>

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
                             <p className="text-white font-bold text-[2.6rem] leading-[1.3] text-left">{formData.mainText}</p>
                          </div>
                        </div>
                    </div>
                  )}

                  {activeCategory === "testimony" && (
                    <div className="w-full h-full bg-[#050b1a] text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#050b1a] via-[#0f2557] to-black z-0" />
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[150px] z-0" />
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sayc-teal/10 rounded-full blur-[120px] z-0" />
                        
                        <div className="absolute top-0 left-0 w-full h-[160px] bg-white z-10 flex items-center justify-center shadow-2xl border-b-[6px] border-orange-500">
                           <div className="flex items-center gap-24">
                              <img src={logoSayc} alt="SAYC" className="h-[55px] object-contain" />
                              <div className="w-[1.5px] h-10 bg-slate-200" />
                              <img src={smartAfricaAllianceLogo} alt="Smart Africa" className="h-[40px] object-contain" />
                              <div className="w-[1.5px] h-10 bg-slate-200" />
                              <img src={sadaLogo} alt="SADA" className="h-[50px] object-contain" />
                           </div>
                        </div>

                        <div className="absolute top-[160px] left-0 w-full text-center z-20 space-y-2">
                           <div className="inline-block px-10 py-2.5 bg-orange-500/10 border border-orange-500/20 rounded-full mb-2">
                              <span className="text-orange-500 font-black text-lg uppercase tracking-[0.6em]">SAYC TCHAD — MANDAT 2026-2028</span>
                           </div>
                           <h1 className="text-[70px] font-black text-white leading-none tracking-tighter uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">BUREAU NATIONAL</h1>
                        </div>
 
                        <div className="absolute top-[310px] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                            <div className="w-[300px] h-[360px] rounded-[2rem] border-[6px] border-orange-500 shadow-[0_20px_50px_rgba(234,88,12,0.5)] overflow-hidden bg-slate-800 relative group">
                               <img 
                                 src={nationalLeader?.photoUrl || nationalLeader?.photo_url || "/images/souleymane-1.jpg"} 
                                 alt="National Leader" 
                                 className="w-full h-full object-cover object-top" 
                                 crossOrigin="anonymous" 
                               />
                               <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black via-black/80 to-transparent" />
                               <div className="absolute bottom-4 inset-x-0 text-center px-4">
                                  <p className="text-orange-400 font-bold text-sm uppercase tracking-widest mb-1">LEADER NATIONAL</p>
                                  <h4 className="text-[1.8rem] font-black text-white uppercase tracking-tight leading-none">
                                    {nationalLeader?.firstName || nationalLeader?.first_name || "SOULEYMANE"}<br/>
                                    {nationalLeader?.nomSpecifiqueUnique || nationalLeader?.last_name || "MAHAMAT SALEH"}
                                  </h4>
                               </div>
                            </div>
                        </div>

                        <div className="absolute top-[720px] inset-x-8 z-30 grid grid-cols-4 gap-4 items-center">
                           {bureauNational && bureauNational.length > 0 ? bureauNational.map((b, i) => (
                             <div key={i} className="flex flex-col items-center">
                               <div className="w-[220px] h-[270px] rounded-[2rem] border-[4px] border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.6)] overflow-hidden bg-slate-900 relative">
                                  <img
                                    src={b.leader?.photoUrl || b.leader?.photo_url || "/images/leaders/leader_1.png"}
                                    alt={`${b.leader?.firstName || b.leader?.first_name} ${b.leader?.lastName || b.leader?.last_name}`}
                                    className="w-full h-full object-cover object-top"
                                    crossOrigin="anonymous"
                                  />
                                  <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black via-black/80 to-transparent" />
                                  <div className="absolute bottom-4 inset-x-0 text-center px-2 flex flex-col items-center">
                                     <div className="bg-gradient-to-r from-amber-400 to-yellow-600 px-3 py-1 rounded-md mb-2 shadow-lg">
                                        <p className="text-black font-black text-[9px] uppercase tracking-widest leading-tight whitespace-nowrap">{b.role.toUpperCase()}</p>
                                     </div>
                                     <h4 className="text-[1.2rem] font-black text-white uppercase tracking-tight leading-none drop-shadow-md">
                                       {b.leader?.firstName || b.leader?.first_name}
                                     </h4>
                                     <h4 className="text-[1.2rem] font-black text-yellow-300 uppercase tracking-tight leading-none">
                                       {b.leader?.nomSpecifiqueUnique || b.leader?.last_name}
                                     </h4>
                                  </div>
                               </div>
                             </div>
                           )) : [
                             { name: "MOUNIR MAHAMAT", label: "LEADER ADJOINT", img: "/images/leaders/leader_1.png" },
                             { name: "ALLAMINE TIDJANI", label: "SECTEUR PRIVÉ", img: "/images/leaders/leader_2.png" },
                             { name: "JÉRÉMIE IGNEBE", label: "ACADÉMIQUE", img: "/images/leaders/leader_3.png" },
                             { name: "ADELINE GOLDÉ", label: "INCLUSION", img: "/images/adeline.jpg" }
                           ].map((c, i) => (
                             <div key={i} className="flex flex-col items-center">
                               <div className="w-[220px] h-[270px] rounded-[2rem] border-[4px] border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.6)] overflow-hidden bg-slate-900 relative">
                                  <img src={c.img} alt={c.name} className="w-full h-full object-cover object-top" crossOrigin="anonymous" />
                                  <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black via-black/80 to-transparent" />
                                  <div className="absolute bottom-4 inset-x-0 text-center px-2 flex flex-col items-center">
                                     <div className="bg-gradient-to-r from-amber-400 to-yellow-600 px-3 py-1 rounded-md mb-2 shadow-lg">
                                        <p className="text-black font-black text-[9px] uppercase tracking-widest leading-tight whitespace-nowrap">{c.label}</p>
                                     </div>
                                     <h4 className="text-[1.2rem] font-black text-white uppercase tracking-tight leading-none">{c.name.split(' ')[0]}</h4>
                                     <h4 className="text-[1.2rem] font-black text-yellow-300 uppercase tracking-tight leading-none">{c.name.split(' ').slice(1).join(' ')}</h4>
                                  </div>
                               </div>
                             </div>
                           ))}
                        </div>
                    </div>
                  )}

                  {activeCategory === "event" && (
                     <div className="w-full h-full bg-[#050510] overflow-hidden">
                        <img src={formData.imageUrl} className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm opacity-40" alt="" crossOrigin="anonymous" />
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

                  {activeCategory === "announcement" && (
                     <div className="w-full h-full bg-[#050b1a] overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#050b1a] via-[#0a1a3a] to-[#050b1a]" />
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                        
                        <div className="absolute top-0 left-0 w-full h-[220px] bg-white z-10 flex items-center justify-center shadow-2xl border-b-[8px] border-orange-500">
                           <div className="flex items-center gap-20">
                              <img src={logoSayc} alt="SAYC" className="h-[70px] object-contain" />
                              <div className="w-[1px] h-14 bg-slate-200" />
                              <img src={smartAfricaAllianceLogo} alt="Smart Africa" className="h-[50px] object-contain" />
                              <div className="w-[1px] h-14 bg-slate-200" />
                              <img src={sadaLogo} alt="SADA" className="h-[65px] object-contain" />
                           </div>
                        </div>

                        <div className="absolute top-[280px] inset-x-0 flex flex-col items-center text-center z-20 space-y-12">
                           <div className="bg-orange-600 px-10 py-3 rounded-full shadow-[0_0_40px_rgba(234,88,12,0.4)] border border-orange-400/30">
                              <span className="text-white font-black text-2xl uppercase tracking-[0.6em] animate-pulse">FLASH INFO</span>
                           </div>

                           <div className="space-y-6">
                              <p className="text-sayc-teal font-black text-3xl uppercase tracking-[0.4em]">SAYC TCHAD ÉLECTIONS 2026</p>
                              <h1 className="text-[120px] font-black text-white leading-none tracking-tighter uppercase drop-shadow-2xl">
                                 {formData.titleLine1 || "SCRUTIN"}<br/>
                                 <span className="text-orange-500">{formData.titleLine2 || "CLÔTURÉ"}</span>
                              </h1>
                           </div>

                            <div className="w-[800px] h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                            <div className="max-w-4xl px-16">
                               <p className="text-white/80 font-bold text-3xl leading-relaxed italic">
                                  "{formData.mainText || "La période de vote est officiellement terminée. Le dépouillement est en cours. Rendez-vous à 15h00 pour les résultats."}"
                               </p>
                            </div>
                              <div className="grid grid-cols-2 gap-12 pt-10">
                              <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl flex flex-col items-center space-y-4">
                                 <div className="p-5 bg-orange-600 rounded-2xl"><Vote className="w-10 h-10 text-white" /></div>
                                 <div>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">CLÔTURE</p>
                                    <p className="text-white font-black text-4xl">12:00</p>
                                 </div>
                              </div>
                              <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl flex flex-col items-center space-y-4">
                                 <div className="p-5 bg-sayc-teal rounded-2xl"><Award className="w-10 h-10 text-white" /></div>
                                 <div>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">RÉSULTATS</p>
                                    <p className="text-white font-black text-4xl">15:00</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* UNIVERSAL ELITE FOOTER */}
                  <div className="absolute bottom-0 inset-x-0 h-[170px] z-[60] px-16 flex items-center bg-black/95 backdrop-blur-3xl border-t border-white/10">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-8">
                        <div className="p-5 bg-orange-600 rounded-[1.8rem] shadow-[0_0_40px_rgba(234,88,12,0.4)] flex items-center justify-center shrink-0">
                          <Zap className="w-10 h-10 text-white animate-pulse" />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-white font-black text-[2.8rem] uppercase tracking-tighter leading-none">PROFIL VÉRIFIÉ</h3>
                          <p className="text-orange-500 font-black text-sm uppercase tracking-[0.4em] opacity-90">
                            LISTE OFFICIELLE — <span className="text-slate-100 font-bold tracking-normal opacity-100 italic">2026</span>
                          </p>
                        </div>
                      </div>

                      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                         <p className="text-white font-black text-4xl tracking-tighter uppercase">
                            WWW.<span className="text-orange-500">SAYCTCHAD</span>.ORG
                         </p>
                         <p className="text-[10px] text-white/40 font-bold tracking-[0.8em] uppercase">Smart Africa Youth Chapter Tchad</p>
                      </div>

                      <div className="flex flex-col items-end">
                         <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-1">DÉLIBÉRATION</p>
                         <p className="text-white font-black text-4xl">OFFICIEL</p>
                      </div>
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
