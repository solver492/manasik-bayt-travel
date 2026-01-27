import { ChatInterface } from "@/components/Chatbot";
import { motion } from "framer-motion";

export default function ChatbotPage() {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl h-screen md:h-[850px] shadow-2xl relative z-10"
            >
                <ChatInterface isFullPage={true} />
            </motion.div>

            {/* Background patterns to make it look premium */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[150px]" />
            </div>
        </div>
    );
}
