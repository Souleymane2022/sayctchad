import { useState } from "react";
import { Member } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Award, RotateCw, Download, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { toJpeg } from 'html-to-image';
import { jsPDF } from "jspdf";

interface MemberCardProps {
    member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadSide = async (id: string, side: string) => {
        const node = document.getElementById(id);
        if (!node) return;

        setIsDownloading(true);
        try {
            const dataUrl = await toJpeg(node, {
                quality: 1,
                pixelRatio: 4, // Ultra high quality for printing
                style: {
                    transform: 'none',
                    webkitTransform: 'none',
                }
            });
            const link = document.createElement('a');
            link.download = `SAYC_Carte_${member.lastName}_${side}.jpg`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Download failed", err);
        } finally {
            setIsDownloading(false);
        }
    };

    const downloadPDF = async () => {
        const recto = document.getElementById(`card-recto-${member.id}`);
        const verso = document.getElementById(`card-verso-${member.id}`);
        if (!recto || !verso) return;

        setIsDownloading(true);
        try {
            // Capture both sides
            const rectoData = await toJpeg(recto, { quality: 1, pixelRatio: 3, style: { transform: 'none', webkitTransform: 'none' } });
            const versoData = await toJpeg(verso, { quality: 1, pixelRatio: 3, style: { transform: 'none', webkitTransform: 'none' } });

            const pdf = new jsPDF('p', 'mm', 'a4');

            // Add Recto
            pdf.setFontSize(16);
            pdf.setTextColor(30, 58, 138); // #1e3a8a
            pdf.text("CARTE DE MEMBRE SAYC TCHAD", 105, 20, { align: 'center' });

            // Recto Image (Card is 85x54mm standard roughly, but we use the ratio from our design)
            // Our card is 400x250px -> 1.6 ratio. Let's make it 100mm wide -> 62.5mm high.
            pdf.addImage(rectoData, 'JPEG', 55, 40, 100, 62.5);

            // Add Verso
            pdf.addImage(versoData, 'JPEG', 55, 115, 100, 62.5);

            pdf.setFontSize(10);
            pdf.setTextColor(100);
            pdf.text("Smart Africa Youth Chapter Tchad - Connecter. Innover. Transformer.", 105, 200, { align: 'center' });

            pdf.save(`SAYC_Carte_${member.lastName}.pdf`);
        } catch (err) {
            console.error("PDF generation failed", err);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 py-4">
            <div
                className="relative w-full max-w-[400px] h-[250px] cursor-pointer perspective-1000 group"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    className="w-full h-full preserve-3d relative"
                >
                    {/* Recto (Front) */}
                    <div className="absolute inset-0 backface-hidden" id={`card-recto-${member.id}`}>
                        <Card className="w-full h-full overflow-hidden border-none bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white shadow-2xl relative">
                            {/* Background Shapes */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl text-[#1e3a8a]" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl text-[#1e3a8a]" />

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
                                    <div className="w-24 h-24 rounded-xl border-2 border-accent/30 overflow-hidden bg-white/5 backdrop-blur-sm grayscale-[0.2]">
                                        {member.photoUrl ? (
                                            <img src={member.photoUrl} alt={member.firstName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-accent/30">
                                                <RotateCw className="w-8 h-8 animate-pulse text-accent" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-white/60 mb-1 uppercase tracking-wider font-semibold">Identité du membre</p>
                                        <h2 className="font-heading text-xl font-bold leading-tight mb-1">
                                            {member.firstName} <span className="text-accent">{member.lastName}</span>
                                        </h2>
                                        <div className="flex items-center gap-2 text-[11px] text-white/90">
                                            <Award className="w-3.5 h-3.5 text-accent" />
                                            <span className="font-mono tracking-wider bg-white/10 px-1.5 py-0.5 rounded">{member.membershipId}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Recto */}
                                <div className="flex justify-between items-end border-t border-white/10 pt-2">
                                    <div className="text-[9px] opacity-70">
                                        <p className="font-medium">Membre depuis {member.createdAt ? new Date(member.createdAt).getFullYear() : '2026'}</p>
                                        <p>Compétences Numériques & Innovation</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold tracking-tighter italic">SAYC TCHAD</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Verso (Back) */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180" id={`card-verso-${member.id}`}>
                        <Card className="w-full h-full overflow-hidden border-none bg-[#0f172a] text-white shadow-2xl relative">
                            <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                                <img src="/favicon.png" alt="SAYC watermark" className="w-32 h-32 grayscale invert" />
                            </div>

                            <div className="relative h-full p-6 flex flex-col items-center justify-between text-center">
                                <div className="space-y-1 mt-4">
                                    <h4 className="text-accent text-[12px] font-bold uppercase tracking-widest">NOTRE DEVISE</h4>
                                    <p className="text-sm italic font-medium leading-tight">"Connecter. Innover. Transformer."</p>
                                </div>

                                <div className="grid grid-cols-1 gap-2 w-full max-w-[200px]">
                                    <div className="flex items-center justify-center gap-2 text-[9px] text-white/70">
                                        <MapPin className="w-3 h-3 text-accent" />
                                        <span>N'Djamena, Tchad</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-[9px] text-white/70">
                                        <Phone className="w-3 h-3 text-accent" />
                                        <span>{member.phone}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-[9px] text-white/70">
                                        <Mail className="w-3 h-3 text-accent" />
                                        <span>{member.email}</span>
                                    </div>
                                </div>

                                <div className="p-2 bg-white rounded-xl shadow-inner mb-4">
                                    <QRCodeCanvas
                                        value={`https://sayctchad.org/verify/${member.membershipId}`}
                                        size={64}
                                        level="H"
                                    />
                                </div>

                                <p className="text-[7px] text-white/40 max-w-[250px] mb-2 uppercase tracking-tighter leading-tight">
                                    Cette carte est strictement personnelle. Toute utilisation frauduleuse est passible de poursuites.
                                </p>
                            </div>
                        </Card>
                    </div>
                </motion.div>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-[400px]">
                <Button
                    className="w-full gap-2 bg-sayc-teal hover:bg-sayc-teal/90 text-white font-bold"
                    onClick={(e) => { e.stopPropagation(); downloadPDF(); }}
                    disabled={isDownloading}
                >
                    <FileText className="w-4 h-4" />
                    Télécharger la Carte (PDF - Recto/Verso)
                </Button>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 gap-2 text-[10px] h-9"
                        onClick={(e) => { e.stopPropagation(); downloadSide(`card-recto-${member.id}`, 'Recto'); }}
                        disabled={isDownloading}
                    >
                        <Download className="w-3 h-3" />
                        Image Recto
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 gap-2 text-[10px] h-9"
                        onClick={(e) => { e.stopPropagation(); downloadSide(`card-verso-${member.id}`, 'Verso'); }}
                        disabled={isDownloading}
                    >
                        <Download className="w-3 h-3" />
                        Image Verso
                    </Button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
        </div>
    );
}
