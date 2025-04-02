'use client';
import React, { FC, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/Redux Store/index';
import { toggleSidebar } from '@/Redux Store/SideBar Slice/sidebar';
import OwnerSidebar from '@/Components/owner/OwnerSideBar';
import ImageProvider from '@/Providers/ImageKit';

interface OwnerLayoutProps {
    children: ReactNode;
}

const OwnerLayout: FC<OwnerLayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const isExpanded = useSelector((state: RootState) => state.sidebar.isExpanded); // Get sidebar state from Redux

    return (
       <ImageProvider>
         <div className="flex bg-gray-100 min-h-screen">
            {/* Sidebar with Redux-controlled state */}
            <OwnerSidebar 
                isExpanded={isExpanded} 
                setIsExpanded={() => dispatch(toggleSidebar())} // Dispatch toggle action
            />

            {/* Main Content Area */}
            <main className={`transition-all duration-300 w-full`}>
                {children}
            </main>
        </div>
       </ImageProvider>
    );
};

export default OwnerLayout;
