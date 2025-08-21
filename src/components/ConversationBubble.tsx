"use client";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

export type ConversationBubbleProps = {
  isBot: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function ConversationBubble({ isBot, children, className = "" }: ConversationBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'} ${className}`}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div 
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-base leading-relaxed ${
          isBot 
            ? 'bg-white border border-gray-200 text-gray-800 shadow-sm rounded-tl-sm' 
            : 'bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-tr-sm'
        }`}
      >
        {children}
      </div>
      
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}

export function OptionButton({ onClick, children, icon }: {
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 justify-center whitespace-nowrap"
    >
      {icon}
      {children}
    </motion.button>
  );
} 