'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiDollarSign, FiUser, FiClipboard, FiCheckCircle, FiLogOut, FiMenu } from 'react-icons/fi';
import Link from 'next/link';
import { RootState } from '@/Redux Store/index';
import { toggleSidebar } from '@/Redux Store/SideBar Slice/sidebar';

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        if (isExpanded) {
            const timer = setTimeout(() => setShowText(true), 200);
            return () => clearTimeout(timer);
        } else {
            setShowText(false);
        }
    }, [isExpanded]);

    return (
        <motion.aside 
        initial={{ width: isExpanded ? 240 : 80 }}
            animate={{ width: isExpanded ? 240 : 80 }} 
            className="h-screen bg-gradient-to-b from-yellow-500 to-red-500 text-white p-4 flex flex-col items-center sticky top-0 shadow-lg transition-all duration-300"
        >
            {/* Sidebar Toggle Button */}
            <button 
                className="absolute top-4 right-[-20px] bg-white p-2 rounded-full shadow-md text-red-600 hover:bg-red-600 hover:text-white transition"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <FiMenu size={24} />
            </button>

            {/* Sidebar Menu Items */}
            <nav className="mt-10 flex flex-col space-y-4 w-full">
                <SidebarItem href="/shopkeeper" icon={<FiHome size={24} />} text="Dashboard" isExpanded={isExpanded} showText={showText} />
                <SidebarItem href="/shopkeeper/cash-settlement" icon={<FiDollarSign size={24} />} text="Cash Settlement" isExpanded={isExpanded} showText={showText} />
                <SidebarItem href="/profile" icon={<FiUser size={24} />} text="Profile" isExpanded={isExpanded} showText={showText} />
                <SidebarItem href="/shopkeeper/sales-history" icon={<FiClipboard size={24} />} text="Sales History" isExpanded={isExpanded} showText={showText} />
                <SidebarItem href="/shopkeeper/stock-verification" icon={<FiCheckCircle size={24} />} text="Stock Verification" isExpanded={isExpanded} showText={showText} />
            </nav>

            {/* Logout Button */}
            <div className="mt-auto mb-5 w-full">
                <SidebarItem href="/logout" icon={<FiLogOut size={24} />} text="Logout" isExpanded={isExpanded} showText={showText} />
            </div>
        </motion.aside>
    );
};

// Reusable Sidebar Item Component
const SidebarItem = ({ href, icon, text, isExpanded, showText }: { href: string, icon: React.ReactNode, text: string, isExpanded: boolean, showText: boolean }) => {
    return (
        <Link href={href} passHref>
            <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="flex items-center space-x-3 p-3 hover:bg-white hover:text-red-600 rounded-lg transition w-full cursor-pointer"
            >
                {icon}
                {isExpanded && showText && <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} className="text-lg">{text}</motion.span>}
            </motion.div>
        </Link>
    );
};

export default Sidebar;
