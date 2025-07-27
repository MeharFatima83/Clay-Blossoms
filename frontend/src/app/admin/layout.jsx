'use client';
// import Navbar from '@/components/Navbar';
import SideBarAdmin from '@/components/SideBarAdmin';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiSettings,
  FiBarChart,
  FiTruck,
  FiAlertTriangle,
  FiLogOut
} from 'react-icons/fi';
import { useAuth } from "@/context/Authcontext";

const AdminLayout = ({ children }) => {
  const { isLoggedIn, role, email, loading: authLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (!authLoading) {
      if (!isLoggedIn || role !== "admin") {
        router.push("/admin-login");
      }
    }
  }, [isClient, isLoggedIn, role, authLoading, router]);

  const handleLogout = () => {
    try {
      // Use Authcontext logout if available
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
      }
      router.push('/admin-login');
    } catch (error) {
      console.error('Error during logout:', error);
      router.push('/admin-login');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FiHome },
    { name: 'Products', href: '/admin/manage-product', icon: FiPackage },
    { name: 'Add Product', href: '/admin/add-product', icon: FiPackage },
    { name: 'Orders', href: '/admin/placed-order', icon: FiShoppingCart },
    { name: 'Refunds', href: '/admin/refund', icon: FiAlertTriangle },
  ];

  // Don't render anything until client-side or auth is loaded
  if (!isClient || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  // Show loading while checking authentication
  if (!isLoggedIn || role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen sticky top-0">
          <div className="p-6">
            {/* Admin Info */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">
                  {email ? email.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
              <p className="text-gray-600 text-sm">{email}</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <FiLogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;