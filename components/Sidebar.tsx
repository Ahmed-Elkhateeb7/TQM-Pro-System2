import React from 'react';
import { LayoutDashboard, Package, Users, Activity, FileText, Info, Menu, ShieldCheck } from 'lucide-react';
import { PageView } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, toggleSidebar }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة القيادة', icon: LayoutDashboard },
    { id: 'products', label: 'المنتجات والمواصفات', icon: Package },
    { id: 'team', label: 'فريق الجودة', icon: Users },
    { id: 'kpi', label: 'مؤشرات الأداء', icon: Activity },
    { id: 'documents', label: 'ملفات الجودة', icon: FileText },
    { id: 'about', label: 'عن التطبيق', icon: Info },
  ];

  return (
    <motion.div 
      animate={{ width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
      className="h-screen bg-royal-950 text-white flex flex-col shadow-2xl sticky top-0 z-40 print:hidden"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-royal-800/50">
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
                >
                    <div className="bg-white p-1.5 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-royal-800" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">إدارة الجودة</h1>
                        <p className="text-xs text-royal-200">نظام TQM المتكامل</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-royal-800 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
                <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as PageView)}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative group
                        ${isActive 
                            ? 'bg-royal-700 text-white shadow-lg shadow-royal-900/50' 
                            : 'text-royal-100 hover:bg-royal-900 hover:text-white'
                        }`}
                >
                    <Icon className={`w-6 h-6 min-w-[24px] ${isActive ? 'text-white' : 'text-royal-300 group-hover:text-white'}`} />
                    
                    <AnimatePresence>
                        {isOpen && (
                            <motion.span 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-medium whitespace-nowrap"
                            >
                                {item.label}
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {isActive && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                    )}
                </button>
            )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-royal-800/50">
        <div className={`flex items-center gap-3 ${isOpen ? 'justify-start' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-royal-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                M
            </div>
            {isOpen && (
                <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate">المدير العام</p>
                    <p className="text-xs text-royal-300 truncate">متصل الآن</p>
                </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};