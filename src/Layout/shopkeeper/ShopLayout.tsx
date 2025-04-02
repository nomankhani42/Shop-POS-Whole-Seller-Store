'use client'
import React, { FC, ReactNode } from 'react';
import Sidebar from '@/Components/shopkeeper/SideBar';

interface ShopLayoutProps {
    children: ReactNode;
}

const ShopLayout: FC<ShopLayoutProps> = ({ children }) => {
    return (
        <div className="flex  bg-gray-100">
            <div >
            <Sidebar />
            </div>
            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>
    )
}

export default ShopLayout;
