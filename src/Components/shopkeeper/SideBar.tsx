'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiDollarSign, FiUser, FiClipboard, FiCheckCircle, FiLogOut, FiMenu } from 'react-icons/fi';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/Redux Store/index';
import { toggleSidebar } from '@/Redux Store/SideBar Slice/sidebar';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
    const dispatch = useDispatch();
    const isExpanded = useSelector((state: RootState) => state.sidebar.isExpanded);
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
            className=" sticky top-0  min-h-screen max-h-screen z-50  bg-gradient-to-b from-yellow-500 to-red-500 text-white p-4 flex flex-col items-center  shadow-lg transition-all duration-300"
        >
            {/* Sidebar Toggle Button */}
            <button
                className="absolute top-4 right-[-20px] bg-white p-2 rounded-full shadow-md text-red-600 hover:bg-red-600 hover:text-white transition"
                onClick={() => dispatch(toggleSidebar())}
            >
                <FiMenu size={24} />
            </button>

            {/* Sidebar Menu Items */}
            <nav className="mt-10 flex flex-col space-y-4 w-full">
                <SidebarItem href="/shopkeeper" icon={<FiHome size={24} />} text="Dashboard" />
                <SidebarItem href="/shopkeeper/cash-settlement" icon={<FiDollarSign size={24} />} text="Cash Settlement" />
                <SidebarItem href="/profile" icon={<FiUser size={24} />} text="Profile" />
                <SidebarItem href="/shopkeeper/sales-history" icon={<FiClipboard size={24} />} text="Sales History" />
                <SidebarItem href="/shopkeeper/stock-verification" icon={<FiCheckCircle size={24} />} text="Stock Verification" />
            </nav>

            {/* Logout Button */}
            <div className="mt-auto mb-5 w-full">
                <SidebarItem href="/logout" icon={<FiLogOut size={24} />} text="Logout" />
            </div>
        </motion.aside>
    );
};

// Reusable Sidebar Item Component
const SidebarItem = ({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) => {
    const isExpanded = useSelector((state: RootState) => state.sidebar.isExpanded);
    const pathname = usePathname(); // Get current route

    const isActive = pathname === href; // Check if the current path matches the item path

    return (
        <Link href={href} passHref>
            <motion.div
                whileHover={{ scale: 1.05 }}
                className={`flex items-center space-x-3 p-3 rounded-lg transition w-full cursor-pointer 
                ${isActive ? 'bg-white text-red-600 font-bold' : 'hover:bg-white hover:text-red-600'}`}
            >
                {icon}
                {isExpanded && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }} // Delay added for gradual appearance
                        className="text-lg"
                    >
                        {text}
                    </motion.span>
                )}
            </motion.div>
        </Link>

    );
};

export default Sidebar;
