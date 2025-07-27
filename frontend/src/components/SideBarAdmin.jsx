"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  TbAdjustments,
  TbDashboard,
  TbListDetails,
  TbMenu2,
  TbPlus,
  TbShoppingCart,
  TbX
} from 'react-icons/tb';

const SideBarAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', icon: <TbDashboard />, href: '/admin/dashboard' },
    { name: 'Add Product', icon: <TbPlus />, href: '/admin/add-product' },
    { name: 'Manage Products', icon: <TbListDetails />, href: '/admin/manage-product' },
    { name: 'Orders', icon: <TbShoppingCart />, href: '/admin/placed-orders' },
    { name: 'Status', icon: <TbAdjustments />, href: '/admin/status' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white shadow-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-300 transform"
        aria-label="Toggle navigation"
      >
        {isOpen ? <TbX size={24} /> : <TbMenu2 size={24} />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-screen min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white
                   w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                   lg:translate-x-0 lg:static lg:h-screen lg:min-h-screen lg:w-64 lg:flex-shrink-0
                   transition-transform duration-300 ease-in-out z-50 p-4 shadow-xl flex flex-col`}
        style={{ height: '100dvh', minHeight: '100dvh' }}
      >
        <div className="flex items-center justify-between lg:justify-center mb-8 px-4 py-2">
        
          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 lg:hidden"
            aria-label="Close navigation"
          >
            <TbX size={20} />
          </button>
        </div>

        <nav className="space-y-3 flex-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 p-3 rounded-lg text-lg font-medium
                  ${isActive
                    ? "bg-blue-700 text-white shadow"
                    : "text-gray-200 hover:bg-blue-700 hover:text-white"}
                  transition-all duration-200 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
                onClick={() => setIsOpen(false)}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default SideBarAdmin;