'use client';
import React from 'react';
import Link from 'next/link';
import {
  FaBars,
  FaHome,
  FaBox,
  FaChartLine,
 
  FaCog,
  FaSignOutAlt,
 
  FaClipboardCheck,
  FaTags,
  FaDollarSign
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react'; // ✅ Import signOut from next-auth

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const OwnerSidebar: React.FC<SidebarProps> = ({ isExpanded, setIsExpanded }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, link: "/owner" },
    { name: "Manage Products", icon: <FaBox />, link: "/owner/product-management" },
    { name: "Category Management", icon: <FaTags />, link: "/owner/category-management" },
    { name: "Cash Settlement", icon: <FaDollarSign />, link: "/owner/cash-settlement" },
    { name: "Stock Management", icon: <FaClipboardCheck />, link: "/owner/stock-management" },
    { name: "Sales Reports", icon: <FaChartLine />, link: "/owner/sales-report" },
    { name: "Settings", icon: <FaCog />, link: "#" }
  ];

  return (
    <motion.div
      animate={{ width: isExpanded ? "20rem" : "5rem" }}
      className="bg-yellow-500 h-screen sticky top-0 shadow-md transition-all duration-300 flex flex-col"
    >
      {/* Sidebar Toggle */}
      <div className="p-4 flex justify-between items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 bg-white rounded-full hover:bg-red-500 transition"
        >
          <FaBars className="text-xl text-yellow-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.link} passHref>
            <div
              className={`group flex items-center gap-x-4 p-4 hover:bg-red-400 transition cursor-pointer 
              ${pathname === item.link ? 'bg-red-600' : ''}`}
            >
              <span className="text-2xl text-white">{item.icon}</span>
              <motion.span
                animate={{ opacity: isExpanded ? 1 : 0, scale: isExpanded ? 1 : 0.8 }}
                transition={{ duration: 0.8 }}
                className={`text-white font-semibold ${isExpanded ? 'block' : 'hidden'}`}
              >
                {item.name}
              </motion.span>
            </div>
          </Link>
        ))}
      </nav>

      {/* ✅ Logout Button */}
      <div className="mt-auto">
        <button
          onClick={() => signOut({ callbackUrl: '/' })} // ✅ Redirect to login on logout
          className="w-full group flex items-center gap-x-4 p-4 hover:bg-red-500 transition cursor-pointer"
        >
          <span className="text-2xl text-white"><FaSignOutAlt /></span>
          <motion.span
            animate={{ opacity: isExpanded ? 1 : 0, scale: isExpanded ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
            className={`text-white font-semibold ${isExpanded ? 'block' : 'hidden'}`}
          >
            Logout
          </motion.span>
        </button>
      </div>
    </motion.div>
  );
};

export default OwnerSidebar;
