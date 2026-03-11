import { useState } from "react";
import { Member } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Award, RotateCw } from "lucide-react";
import { motion } from "framer-motion";

interface MemberCardProps {
    member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="flex flex-col items-center gap-8 py-8">
            <div
                className="relative w-full max-w-[400px] h-[250px] cursor-pointer perspective-1000"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    className="w-full h-full preserve-3d relative"
                >
                    {/* Recto (Front) */}
                    <div className="absolute inset-0 backface-hidden">
                        <Card className="w-full h-full overflow-hidden border-none bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white shadow-2xl relative">
                            {/* Background Shapes */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />

                            <div className="relative h-full p-6 flex flex-col justify-between">
                                {/* Header */}
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <img src="/favicon.png" alt="SAYC" className="w-10 h-10 bg-white rounded-lg p-1" />
                                        <div>
                                            <h3 className="font-heading font-bold text-sm leading-tight">SMART AFRICA</h3>
                                            <p className="text-[10px] text-sayc-teal font-semibold tracking-widest uppercase">Youth Chapter Tchad</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] border-accent/50 text-accent bg-accent/10">
                                        MEMBRE OFFICIEL
                                    </Badge>
                                </div>

                                {/* Content */}
                                <div className="flex gap-4 items-center">
                                    <div className="w-24 h-24 rounded-xl border-2 border-accent/30 overflow-hidden bg-white/5 backdrop-blur-sm grayscale-[0.5]">
                                        {member.photoUrl ? (
                                            <img src={member.photoUrl} alt={member.firstName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-accent/30">
                                                <RotateCw className="w-8 h-8 animate-pulse text-accent" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-white/60 mb-1 uppercase tracking-wider">Identité du membre</p>
                                        <h2 className="font-heading text-xl font-bold leading-tight mb-1">
                                            {member.firstName} <span className="text-accent">{member.lastName}</span>
                                        </h2>
                                        <div className="flex items-center gap-2 text-[10px] text-white/80">
                                            <Award className="w-3 h-3 text-accent" />
                                            <span className="font-mono tracking-wider">{member.membershipId}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Recto */}
                                <div className="flex justify-between items-end">
                                    <div className="text-[8px] opacity-60">
                                        <p>Membre depuis {member.createdAt ? new Date(member.createdAt).getFullYear() : '2026'}</p>
                                        <p>Expert en compétences numériques</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] italic font-serif">SAYC TCHAD</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Verso (Back) */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180">
                        <Card className="w-full h-full overflow-hidden border-none bg-[#0f172a] text-white shadow-2xl relative">
                            <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                                <img src="/favicon.png" alt="SAYC watermark" className="w-32 h-32 grayscale invert" />
                            </div>

                            <div className="relative h-full p-6 flex flex-col items-center justify-center text-center gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-accent text-[12px] font-bold uppercase tracking-widest">NOTRE DEVISE</h4>
                                    <p className="text-sm italic font-medium leading-tight">"Connecter. Innover. Transformer."</p>
                                </div>

                                <div className="grid grid-cols-1 gap-2 w-full max-w-[200px]">
                                    <div className="flex items-center gap-2 text-[9px] text-white/70">
                                        <MapPin className="w-3 h-3 text-accent" />
                                        <span>N'Djamena, Tchad</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] text-white/70">
                                        <Phone className="w-3 h-3 text-accent" />
                                        <span>{member.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] text-white/70">
                                        <Mail className="w-3 h-3 text-accent" />
                                        <span>{member.email}</span>
                                    </div>
                                </div>

                                <div className="mt-2 p-2 bg-white rounded-lg">
                                    {/* QR code placeholder */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-black to-slate-800 flex items-center justify-center text-[8px] text-white overflow-hidden p-1 text-center font-mono">
                                        SAYC-VERIFIED-{member.id?.substring(0, 6)}
                                    </div>
                                </div>

                                <p className="text-[8px] text-white/40 max-w-[250px]">
                                    Cette carte est strictement personnelle. Elle reste la propriété du chapitre Smart Africa Youth Chapter Tchad.
                                </p>
                            </div>
                        </Card>
                    </div>
                </motion.div>
            </div>

            <p className="text-xs text-muted-foreground animate-pulse">
                Cliquez sur la carte pour voir le verso
            </p>

            <style dangerouslySetInnerHTML={{
                __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}} />
        </div>
    );
}
