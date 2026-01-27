import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, X, Send, User, Bot,
    Hotel, Car, Train, Sparkles,
    Trophy, Star, ArrowRight, Moon, Sun,
    CheckCircle2, Phone as PhoneIcon, UserCircle,
    MapPin, Plane, Luggage, Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/lib/i18n';

interface Message {
    id: string;
    type: 'bot' | 'user';
    content: string | React.ReactNode;
}

const ChatbotTranslations: any = {
    fr: {
        welcome: "Salam ! Je suis votre guide Manasik. Prêt à configurer votre mission Omra Ramadan 2026 ? 🕋",
        askOffer: "Choisissez votre camp : Package Économique ou Premium ?",
        askRoom: "Excellent ! Quelle configuration de chambre pour l'équipe ?",
        askHotel: "Parfait. Quel hôtel à La Mecque (27 nuits) servira de quartier général ? 🏨",
        askTransport: "Dernière étape technique : Quel transport pour vos déplacements ? 🚗",
        askName: "Mission presque complète ! Votre Nom et Prénom ? ✍️",
        askPhone: "Et votre WhatsApp pour recevoir les ordres de mission ? 📱",
        summaryTitle: "Dossier de Mission Prêt !",
        questSummary: "Pack Omra Ramadan 2026",
        client: "Pèlerin",
        hotel: "Hôtel Makkah",
        madinaHotel: "Hôtel Madina",
        room: "Hébergement",
        transport: "Navigation",
        budget: "Budget total estimé",
        perPerson: "DHS / personne",
        rewardTitle: "RÉCOMPENSE DÉBLOQUÉE",
        xpUnlocked: "100 XP DÉBLOQUÉS ! MISSION RÉUSSIE.",
        servicesInclus: "Services Inclus",
        agentVerify: "\"Prix tout compris (Vol, Visa, Hôtels, Encadrement). Un expert va vous appeler.\"",
        bookWhatsApp: "Lancer la quête sur WhatsApp",
        interactionRequired: "CHOISISSEZ UNE OPTION",
        progression: "Progression de la Mission",
        online: "Opérationnel",
        expert: "Agent Manasik",
        assistant: "Guide Virtuel",
        placeholderName: "Nom complet",
        placeholderPhone: "Numéro de téléphone",
        level: "NIVEAU",
        waMissionTitle: "QUÊTE OMRA RAMADAN 2026",
        waValidation: "🚀 Je valide ma configuration et attend l'appel d'un expert.",
        offers: {
            premium: { label: "Premium Confort", desc: "Hôtels 4-5★ avec Ansar Golden Tulip à Médine", stars: 5 },
            eco: { label: "Économique", desc: "Hôtels 3-4★ avec Hôtels Rehab à Médine", stars: 3 }
        }
    },
    ar: {
        welcome: "السلام عليكم! أنا مرشدكم لمناسك. هل أنتم مستعدون لتصميم مهمة عمرة رمضان 2026؟ 🕋",
        askOffer: "اختر نوع البرنامج: البرنامج الاقتصادي أم المتميز؟",
        askRoom: "ممتاز! ما هو نوع الغرفة الذي تفضلونه؟",
        askHotel: "رائع. أي فندق بمكة (27 ليلة) سيكون مقراً لإقامتكم؟ 🏨",
        askTransport: "الخطوة الأخيرة: ما هي وسيلة النقل التي تفضلونها؟ 🚗",
        askName: "المهمة شارفت على الانتهاء! ما هو اسمك الكامل؟ ✍️",
        askPhone: "ورقم الواتساب الخاص بك لتلقي تفاصيل المهمة؟ 📱",
        summaryTitle: "ملف المهمة جاهز!",
        questSummary: "باقة عمرة رمضان 2026",
        client: "المعتمر",
        hotel: "فندق مكة",
        madinaHotel: "فندق المدينة",
        room: "نوع الغرفة",
        transport: "وسيلة النقل",
        budget: "الميزانية الإجمالية التقديرية",
        perPerson: "درهم / للشخص",
        rewardTitle: "تم فتح المكافأة",
        xpUnlocked: "تم فتح 100 نقطة خبرة! تمت المهمة بنجاح.",
        servicesInclus: "الخدمات المدرجة",
        agentVerify: "\"السعر يشمل (الطائرة، التأشيرة، الفنادق، التأطير). سيقوم خبير بالاتصال بكم.\"",
        bookWhatsApp: "بدء المهمة عبر واتساب",
        interactionRequired: "يرجى اختيار خيار",
        progression: "تقدم التخصيص",
        online: "متصل الآن",
        expert: "عميل مناسك",
        assistant: "المرشد الافتراضي",
        placeholderName: "الاسم الكامل",
        placeholderPhone: "رقم الهاتف",
        level: "المستوى",
        waMissionTitle: "مهمة عمرة رمضان 2026",
        waValidation: "🚀 أؤكد اختياراتي وأنتظر اتصال الخبير.",
        offers: {
            premium: { label: "البرنامج المتميز", desc: "فنادق 4-5 نجوم + فندق أنصار غولدن توليب بالمدينة", stars: 5 },
            eco: { label: "البرنامج الاقتصادي", desc: "فنادق 3-4 نجوم + فندق رحاب المسك بالمدينة", stars: 3 }
        }
    }
};

const PACKAGES = (t: any) => [
    {
        id: 'eco',
        label: t.offers.eco.label,
        icon: < Luggage className="w-5 h-5 text-gold" />,
        description: t.offers.eco.desc,
        madinaHotel: { fr: 'Rehab Al-Misk', ar: 'رحاب المسك' },
        rooms: [
            { id: 'quad', label: { fr: 'Quadruple', ar: 'رباعية' }, icon: '👥👥' },
            { id: 'triple', label: { fr: 'Triple', ar: 'ثلاثية' }, icon: '👨‍👩‍👦' },
            { id: 'double', label: { fr: 'Double', ar: 'ثنائية' }, icon: '👫' },
        ],
        hotels: [
            { id: 'kadi', label: 'Kadi Tours (كدي تورز)', prices: { quad: 29500, triple: 31500, double: 35500 } },
            { id: 'abraj-kaswah', label: 'Abraj Al-Kaswah (أبراج الكسوة)', prices: { quad: 32500, triple: 35500, double: 37500 } },
            { id: 'abraj-tayseer', label: 'Abraj Al-Tayseer (أبراج التيسير)', prices: { quad: 32500, triple: 34500, double: 38500 } },
            { id: 'nawazi', label: 'Nawazi Tours (نوازي تورز)', prices: { quad: 34500, triple: 38500, double: 42500 } },
            { id: 'kauthar', label: 'Kauthar Marbouth (كوطيار مريوت)', prices: { quad: 35500, triple: 39500, double: 46500 } },
        ]
    },
    {
        id: 'premium',
        label: t.offers.premium.label,
        icon: <Trophy className="w-5 h-5 text-gold" />,
        description: t.offers.premium.desc,
        madinaHotel: { fr: 'Ansar Golden Tulip', ar: 'أنصار غولدن توليب' },
        rooms: [
            { id: 'quad', label: { fr: 'Quadruple', ar: 'رباعية' }, icon: '👥👥' },
            { id: 'triple', label: { fr: 'Triple', ar: 'ثلاثية' }, icon: '👨‍👩‍👦' },
            { id: 'double', label: { fr: 'Double', ar: 'ثنائية' }, icon: '👫' },
        ],
        hotels: [
            { id: 'fokoo', label: 'Fokoo Makkah (فوكو مكة)', prices: { quad: 34500, triple: 38500, double: 45500 } },
            { id: 'al-unwan', label: 'Al-Unwan Ajyad (العنوان أجياد)', prices: { quad: 35500, triple: 39500, double: 45500 } },
            { id: 'badr', label: 'Badr Al-Massa (بدر الماسة)', prices: { quad: 35500, triple: 39500, double: 46500 } },
            { id: 'nadi', label: 'Nadi Ajyad (ندي أجياد)', prices: { quad: 38500, triple: 43500, double: 58500 } },
            { id: 'makkah-ajyad', label: 'Makkat Ajyad (مكات أجياد)', prices: { quad: 41500, triple: 49500, double: 62500 } },
        ]
    }
];

const TRANSPORT_OPTIONS = (lang: string) => [
    { id: 'bus', label: lang === 'ar' ? 'حافلة مكيفة' : 'Bus Climatisé', icon: <Car className="w-5 h-5" /> },
    { id: 'car', label: lang === 'ar' ? 'خدمة GMC خاصة' : 'Privé GMC', icon: <Car className="w-5 h-5" /> },
    { id: 'train', label: lang === 'ar' ? 'قطار الحرمين السريع' : 'Train Al-Haramain', icon: <Train className="w-5 h-5" /> },
];

export function ChatInterface({ isFullPage = false }: { isFullPage?: boolean }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [selection, setSelection] = useState({
        packageId: '',
        room: '',
        hotel: '',
        transport: '',
        name: '',
        phone: '',
    });
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const { language } = useLanguage();

    const t = ChatbotTranslations[language === 'ar' ? 'ar' : 'fr'];
    const isRTL = language === 'ar';

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        startChat();
    }, [language]);

    const addBotMessage = (content: string | React.ReactNode, delay = 500) => {
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Math.random().toString(),
                type: 'bot',
                content
            }]);
        }, delay);
    };

    const addUserMessage = (content: string) => {
        setMessages(prev => [...prev, {
            id: Math.random().toString(),
            type: 'user',
            content
        }]);
    };

    const startChat = () => {
        setStep(0);
        setProgress(10);
        setMessages([]);
        addBotMessage(t.welcome);
        addBotMessage(t.askOffer, 1000);
    };

    const handlePackageSelect = (id: string, label: string) => {
        setSelection(prev => ({ ...prev, packageId: id }));
        addUserMessage(label);
        setStep(1);
        setProgress(25);
        addBotMessage(t.askRoom);
    };

    const handleRoomSelect = (id: string, label: string) => {
        setSelection(prev => ({ ...prev, room: id }));
        addUserMessage(label);
        setStep(2);
        setProgress(40);
        addBotMessage(t.askHotel);
    };

    const handleHotelSelect = (id: string, label: string) => {
        setSelection(prev => ({ ...prev, hotel: id }));
        addUserMessage(label);
        setStep(3);
        setProgress(60);
        addBotMessage(t.askTransport);
    };

    const handleTransportSelect = (id: string, label: string) => {
        setSelection(prev => ({ ...prev, transport: id }));
        addUserMessage(label);
        setStep(4);
        setProgress(75);
        addBotMessage(t.askName);
    };

    const handleNameInput = () => {
        if (!inputValue.trim()) return;
        const name = inputValue.trim();
        setSelection(prev => ({ ...prev, name }));
        addUserMessage(name);
        setInputValue('');
        setStep(5);
        setProgress(90);
        addBotMessage(t.askPhone);
    };

    const handlePhoneInput = () => {
        if (!inputValue.trim()) return;
        const phone = inputValue.trim();
        setSelection(prev => {
            const next = { ...prev, phone };
            showFinalSummary(next);
            return next;
        });
        addUserMessage(phone);
        setInputValue('');
        setStep(6);
        setProgress(100);
    };

    const showFinalSummary = (currentSelection: typeof selection) => {
        const pkg = PACKAGES(t).find(p => p.id === currentSelection.packageId);
        if (!pkg) return;

        const currentHotel = pkg.hotels.find(h => h.id === currentSelection.hotel);
        const totalPrice = (currentHotel as any)?.prices?.[currentSelection.room] || 0;

        const roomData = pkg.rooms.find(r => r.id === currentSelection.room);
        const roomLabel = roomData ? (roomData.label as any)[language === 'ar' ? 'ar' : 'fr'] : currentSelection.room;
        const makkahHotelLabel = currentHotel?.label || currentSelection.hotel;
        const madinaHotelLabel = (pkg.madinaHotel as any)[language === 'ar' ? 'ar' : 'fr'];
        const transportLabel = TRANSPORT_OPTIONS(language).find(opt => opt.id === currentSelection.transport)?.label || currentSelection.transport;

        setTimeout(() => {
            addBotMessage(
                <div className="space-y-4">
                    <div className="p-5 bg-gradient-to-b from-primary/5 to-gold/10 rounded-[2rem] border border-gold/30 shadow-inner">
                        <div className="flex justify-between items-center mb-6">
                            <Badge className="bg-gold text-white border-none uppercase text-[9px] tracking-widest px-3 py-1 rounded-full shadow-lg shadow-gold/20">
                                {pkg.label}
                            </Badge>
                            <div className="flex gap-1">
                                <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                                <Star className="w-4 h-4 text-gold fill-gold" />
                            </div>
                        </div>

                        <h4 className="font-black text-primary text-xl mb-6 leading-tight flex items-center gap-2">
                            {t.summaryTitle}
                        </h4>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-border">
                                    <UserCircle className="w-5 h-5 text-gold" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground uppercase font-black">{t.client}</span>
                                    <span className="text-sm font-black text-primary">{currentSelection.name}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-border">
                                    <MapPin className="w-5 h-5 text-gold" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground uppercase font-black">{t.madinaHotel} (6n)</span>
                                    <span className="text-sm font-black text-primary">{madinaHotelLabel}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-border">
                                    <Hotel className="w-5 h-5 text-gold" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground uppercase font-black">{t.hotel} (27n)</span>
                                    <span className="text-sm font-black text-primary">{makkahHotelLabel}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-2xl border border-gold/10">
                                    <User className="w-4 h-4 text-gold" />
                                    <span className="text-[12px] font-black uppercase text-primary">{roomLabel}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-2xl border border-gold/10">
                                    <Car className="w-4 h-4 text-gold" />
                                    <span className="text-[12px] font-black uppercase text-primary">{transportLabel}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gold/20">
                            <div className="flex items-baseline justify-between mb-2">
                                <p className="text-[11px] text-muted-foreground uppercase font-black tracking-widest">{t.budget}</p>
                                <p className="text-[11px] text-gold font-black uppercase">{t.perPerson}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold shadow-lg shadow-gold/10">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <p className="text-4xl font-black text-primary tracking-tighter">{totalPrice.toLocaleString('fr-FR')} DHS</p>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-4 p-5 bg-green-500 rounded-[2.5rem] text-white font-black shadow-2xl shadow-green-500/20"
                    >
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                            <Trophy className="w-7 h-7" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] uppercase opacity-80 tracking-widest">{t.rewardTitle}</span>
                            <span className="text-sm uppercase tracking-tight">{t.xpUnlocked}</span>
                        </div>
                    </motion.div>

                    <div className="p-6 bg-slate-100 rounded-[2rem] border border-dotted border-slate-300">
                        <div className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase mb-4 tracking-widest">
                            <Plane className="w-4 h-4" /> {t.servicesInclus} :
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[11px] text-slate-600 font-black uppercase">
                            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> {language === 'ar' ? 'الخطوط السعودية' : 'Saudia Airlines'}</div>
                            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> {language === 'ar' ? 'تأشيرة العمرة' : 'Visa Omra'}</div>
                            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> {language === 'ar' ? 'حقيبة 10+2×23' : 'Baggage 10+46kg'}</div>
                            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> {language === 'ar' ? 'التأطير الديني' : 'Encadrement'}</div>
                        </div>
                    </div>

                    <Button
                        className="w-full bg-primary hover:bg-primary/95 text-white font-black h-20 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center group overflow-hidden relative"
                        onClick={() => {
                            const waMessage = `✨ *${t.waMissionTitle.toUpperCase()}* ✨\n` +
                                `━━━━━━━━━━━━━━━━━━━━\n` +
                                `👤 *${t.client.toUpperCase()}:* ${currentSelection.name.toUpperCase()}\n` +
                                `📞 *TEL:* ${currentSelection.phone}\n\n` +
                                `📦 *${isRTL ? 'العرض' : 'PACK'}:* ${pkg.label.toUpperCase()}\n` +
                                `🏨 *MAKKAH:* ${makkahHotelLabel.toUpperCase()}\n` +
                                `🕌 *MADINA:* ${madinaHotelLabel.toUpperCase()}\n` +
                                `👥 *${t.room.toUpperCase()}:* ${roomLabel.toUpperCase()}\n` +
                                `🚗 *${t.transport.toUpperCase()}:* ${transportLabel.toUpperCase()}\n\n` +
                                `💰 *${isRTL ? 'الميزانية' : 'BUDGET'}:* ${totalPrice.toLocaleString('fr-FR')} DHS / ${isRTL ? 'للشخص' : 'PERSONNE'}\n` +
                                `━━━━━━━━━━━━━━━━━━━━\n` +
                                `🚀 ${t.waValidation}`;

                            window.open(`https://wa.me/212661631160?text=${encodeURIComponent(waMessage)}`, '_blank');
                        }}
                    >
                        <div className="flex items-center gap-3 relative z-10 transition-transform group-hover:scale-105 text-lg">
                            {t.bookWhatsApp} <ArrowRight className={cn("w-6 h-6", isRTL && "rotate-180")} />
                        </div>
                        <motion.div
                            className="absolute inset-0 bg-gold/10"
                            animate={{ x: ['100%', '-100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                    </Button>
                </div>,
                1000
            );
        }, 500);
    };

    const currentPkg = PACKAGES(t).find(p => p.id === selection.packageId);

    const containerClasses = isFullPage
        ? "w-full h-full flex flex-col bg-white"
        : "fixed bottom-28 right-6 z-40 w-[95vw] max-w-[450px] h-[750px] bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] border-8 border-slate-50 flex flex-col overflow-hidden";

    return (
        <div dir={isRTL ? 'rtl' : 'ltr'} className={containerClasses}>
            {/* Mission HUD Header */}
            <div className="p-8 bg-primary text-white flex items-center justify-between border-b-4 border-gold/30">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-tr from-gold to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20 rotate-3 text-white">
                        <Bot className="w-8 h-8 -rotate-3" />
                    </div>
                    <div>
                        <h3 className="font-black text-xl tracking-tight uppercase leading-none mb-2">{t.assistant}</h3>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_green]" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{t.expert}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <p className="text-[10px] font-black opacity-40 mb-1">{t.level}</p>
                    <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 text-gold font-black text-lg min-w-[40px] text-center">
                        {Math.floor(progress / 15) + 1}
                    </div>
                </div>
            </div>

            {/* Tactical Progress Bar */}
            <div className="px-8 py-5 bg-slate-50 border-b border-slate-100">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.progression}</span>
                    <span className="text-[10px] font-black text-primary">{progress}%</span>
                </div>
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden p-1 shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-primary via-gold to-primary rounded-full shadow-[0_0_15px_rgba(212,175,55,0.6)]"
                    />
                </div>
            </div>

            {/* Mission Log (Messages) */}
            <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-10 scroll-smooth bg-white custom-scrollbar">
                {messages.map((m) => (
                    <motion.div
                        key={m.id}
                        initial={{ opacity: 0, x: m.type === 'bot' ? (isRTL ? 20 : -20) : (isRTL ? -20 : 20) }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn("flex gap-5", m.type === 'user' ? "flex-row-reverse" : "flex-row")}
                    >
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all shadow-lg",
                            m.type === 'bot' ? "bg-primary border-primary/10 text-white" : "bg-white border-gold text-gold"
                        )}>
                            {m.type === 'bot' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                        </div>
                        <div className={cn(
                            "max-w-[85%] p-6 rounded-[2.5rem] text-sm md:text-base leading-relaxed font-medium shadow-sm transition-all",
                            m.type === 'bot'
                                ? "bg-slate-50 border border-slate-100 text-slate-800" + (isRTL ? " rounded-tr-none" : " rounded-tl-none")
                                : "bg-gold text-white font-black shadow-xl shadow-gold/20" + (isRTL ? " rounded-tl-none" : " rounded-tr-none")
                        )}>
                            {m.content}
                        </div>
                    </motion.div>
                ))}

                {/* Dynamic Buttons */}
                {step === 0 && messages.length >= 2 && (
                    <div className="grid grid-cols-1 gap-5 pt-4">
                        {PACKAGES(t).map(pkg => (
                            <button
                                key={pkg.id}
                                onClick={() => handlePackageSelect(pkg.id, pkg.label)}
                                className="group p-6 rounded-[2.5rem] border-2 border-slate-100 bg-white hover:border-gold hover:shadow-2xl hover:shadow-gold/10 transition-all flex items-center gap-5 text-left relative overflow-hidden active:scale-95"
                            >
                                <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-sm">
                                    {pkg.icon}
                                </div>
                                <div className={cn("flex-grow", isRTL && "text-right")}>
                                    <p className="font-black text-primary text-xl leading-tight uppercase tracking-tight mb-2">{pkg.label}</p>
                                    <p className="text-[11px] text-slate-400 font-black uppercase leading-snug tracking-tighter">{pkg.description}</p>
                                </div>
                                <ArrowRight className={cn("w-7 h-7 text-slate-200 group-hover:text-gold transition-colors", isRTL && "rotate-180")} />
                            </button>
                        ))}
                    </div>
                )}

                {step === 1 && (
                    <div className="grid grid-cols-1 gap-3 pt-4">
                        {currentPkg?.rooms.map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => handleRoomSelect(opt.id, opt.label[language === 'ar' ? 'ar' : 'fr'])}
                                className="p-6 rounded-[2rem] border-2 border-slate-50 bg-white hover:border-gold hover:bg-gold/5 transition-all flex items-center justify-between group active:scale-95"
                            >
                                <div className="flex items-center gap-5">
                                    <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all">{opt.icon}</span>
                                    <p className="font-black text-primary uppercase text-sm md:text-base">{opt.label[language === 'ar' ? 'ar' : 'fr']}</p>
                                </div>
                                <div className="w-8 h-8 rounded-xl border-2 border-slate-200 group-hover:border-gold group-hover:bg-gold flex items-center justify-center transition-all">
                                    <CheckCircle2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 pt-4">
                        {currentPkg?.hotels.map(opt => {
                            const price = (opt as any).prices[selection.room];
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => handleHotelSelect(opt.id, opt.label)}
                                    className="w-full group p-6 rounded-[2.5rem] border-2 border-slate-50 bg-white hover:border-gold hover:shadow-2xl transition-all flex items-center justify-between active:scale-95"
                                >
                                    <div className={cn("text-left", isRTL && "text-right")}>
                                        <p className="font-black text-primary text-base uppercase mb-2 tracking-tight">{opt.label}</p>
                                        <div className={cn("flex gap-1", isRTL && "flex-row-reverse")}>
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 px-5 py-3 rounded-2xl group-hover:bg-gold transition-colors shadow-inner">
                                        <p className="text-[12px] text-primary font-black group-hover:text-white uppercase tracking-tighter">
                                            {price.toLocaleString()} DHS
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {step === 3 && (
                    <div className="grid grid-cols-1 gap-4 pt-4">
                        {TRANSPORT_OPTIONS(language).map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => handleTransportSelect(opt.id, opt.label)}
                                className="p-6 rounded-[2.5rem] border-2 border-slate-50 bg-white hover:border-gold hover:bg-gold/5 transition-all flex items-center gap-6 group active:scale-95"
                            >
                                <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-primary group-hover:bg-gold group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm">
                                    {opt.icon}
                                </div>
                                <p className={cn("font-black text-primary uppercase tracking-tight flex-grow text-left text-lg", isRTL && "text-right")}>{opt.label}</p>
                            </button>
                        ))}
                    </div>
                )}

                {(step === 4 || step === 5) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col gap-5 pt-4"
                    >
                        <div className="relative group">
                            <Input
                                className={cn(
                                    "bg-slate-50 border-2 border-slate-100 hover:border-gold focus:border-gold rounded-[2rem] h-20 font-black text-primary text-lg transition-all shadow-inner",
                                    isRTL ? "pr-16 pl-8" : "pl-16 pr-8"
                                )}
                                placeholder={step === 4 ? t.placeholderName : t.placeholderPhone}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') step === 4 ? handleNameInput() : handlePhoneInput();
                                }}
                                autoFocus
                            />
                            <div className={cn("absolute top-1/2 -translate-y-1/2 w-8 h-8 text-slate-300 group-focus-within:text-gold transition-colors", isRTL ? "right-6" : "left-6")}>
                                {step === 4 ? <UserCircle className="w-full h-full" /> : <PhoneIcon className="w-full h-full" />}
                            </div>
                        </div>
                        <Button
                            onClick={() => step === 4 ? handleNameInput() : handlePhoneInput()}
                            className="h-16 bg-primary hover:bg-primary-90 text-white font-black rounded-[2rem] flex items-center justify-center gap-4 uppercase shadow-2xl shadow-primary/30 text-lg"
                            disabled={!inputValue.trim()}
                        >
                            {isRTL ? 'تأكيد المهمة' : 'Confirmer'}
                            <ArrowRight className={cn("w-6 h-6", isRTL && "rotate-180")} />
                        </Button>
                    </motion.div>
                )}
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-200">
                <div className="bg-white border-2 border-slate-100 rounded-[2rem] px-8 py-5 flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-4 h-4 bg-gold rounded-full animate-ping" />
                        <span className="text-[11px] font-black text-slate-400 tracking-[0.3em] uppercase">{t.interactionRequired}</span>
                    </div>
                    <Bot className="w-7 h-7 text-slate-200" />
                </div>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
        </div>
    );
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-20 h-20 bg-gradient-to-tr from-primary to-slate-800 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center justify-center text-white border-4 border-white group"
            >
                {isOpen ? <X className="w-10 h-10" /> : (
                    <div className="relative">
                        <MessageSquare className="w-10 h-10" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full border-2 border-white animate-bounce" />
                    </div>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                    >
                        <ChatInterface />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
