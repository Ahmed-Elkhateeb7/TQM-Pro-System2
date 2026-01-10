import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Products } from './components/Products';
import { Team } from './components/Team';
import { KPIs } from './components/KPIs';
import { Documents } from './components/Documents';
import { About } from './components/About';
import { PasswordModal } from './components/PasswordModal';
import { PageView, Product, Employee, DocumentFile, KPIData } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu } from 'lucide-react';

// Mock Data
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'محرك كهربائي X500', specs: '5000 RPM, 220V, عزل حراري', defects: '', status: 'approved', image: 'https://images.unsplash.com/photo-1562259920-47afc305f369?w=800&auto=format&fit=crop' },
  { id: '2', name: 'لوحة تحكم صناعية', specs: 'IP65, شاشة لمس 7 بوصة', defects: 'خدش في الإطار الخارجي', status: 'rejected', image: 'https://images.unsplash.com/photo-1555664424-778a69032054?w=800&auto=format&fit=crop' },
  { id: '3', name: 'مستشعر حرارة دقيق', specs: 'نطاق -50 إلى 500 درجة', defects: '', status: 'pending', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop' },
  { id: '4', name: 'صمام هيدروليكي', specs: 'ضغط عالي 300 بار', defects: '', status: 'approved', image: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800&auto=format&fit=crop' },
];

const INITIAL_TEAM: Employee[] = [
  { id: '1', name: 'محمد علي', role: 'مدير الجودة', department: 'management', joinedDate: '2023-01-15', email: 'm.ali@tqm-sys.com', phone: '+966 50 123 4567' },
  { id: '2', name: 'سارة خالد', role: 'مراقب جودة أول', department: 'qc', joinedDate: '2023-03-10', email: 's.khaled@tqm-sys.com', phone: '+966 55 987 6543' },
  { id: '3', name: 'أحمد حسن', role: 'أخصائي توكيد جودة', department: 'qa', joinedDate: '2023-06-20', email: 'a.hassan@tqm-sys.com', phone: '+966 54 111 2222' },
];

const INITIAL_DOCS: DocumentFile[] = [
  { id: '1', name: 'دليل معايير ISO 9001', type: 'pdf', size: '2.5 MB', date: '2024-01-10', url: '#' },
  { id: '2', name: 'تقرير التدقيق الداخلي Q1', type: 'excel', size: '1.1 MB', date: '2024-04-05', url: '#' },
];

const INITIAL_KPI_DATA: KPIData[] = [
  { month: 'يناير', qualityRate: 92, defects: 12 },
  { month: 'فبراير', qualityRate: 94, defects: 8 },
  { month: 'مارس', qualityRate: 89, defects: 15 },
  { month: 'أبريل', qualityRate: 96, defects: 5 },
  { month: 'مايو', qualityRate: 95, defects: 7 },
  { month: 'يونيو', qualityRate: 98, defects: 2 },
];

function App() {
  const [currentView, setCurrentView] = useState<PageView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [team, setTeam] = useState<Employee[]>(INITIAL_TEAM);
  const [documents, setDocuments] = useState<DocumentFile[]>(INITIAL_DOCS);
  const [kpiData, setKpiData] = useState<KPIData[]>(INITIAL_KPI_DATA);

  // Security State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const requestAuth = (action: () => void) => {
    setPendingAction(() => action);
    setIsAuthModalOpen(true);
  };

  const handleConfirmAuth = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  // Enhanced Print Handler for PDF Download
  const handlePrintReport = () => {
    const originalTitle = document.title;
    // Set a professional filename for the PDF download
    const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-'); // DD-MM-YYYY
    document.title = `TQM-Report-${dateStr}`;
    
    window.print();
    
    // Restore original title
    setTimeout(() => {
        document.title = originalTitle;
    }, 1000);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard products={products} kpiData={kpiData} handleGenerateReport={handlePrintReport} navigate={setCurrentView} />;
      case 'products':
        return <Products products={products} setProducts={setProducts} requestAuth={requestAuth} />;
      case 'team':
        return <Team team={team} setTeam={setTeam} requestAuth={requestAuth} />;
      case 'kpi':
        return <KPIs data={kpiData} setData={setKpiData} requestAuth={requestAuth} />;
      case 'documents':
        return <Documents documents={documents} setDocuments={setDocuments} requestAuth={requestAuth} />;
      case 'about':
        return <About />;
      default:
        return <Dashboard products={products} kpiData={kpiData} handleGenerateReport={handlePrintReport} navigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-right">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <main className="flex-1 p-6 lg:p-10 w-full">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-royal-800 transition-all shadow-sm active:scale-95"
                title="القائمة الرئيسية"
            >
                <Menu className="w-6 h-6" />
            </button>
            <div>
                <h1 className="text-3xl font-black text-gray-900 leading-tight">
                {currentView === 'dashboard' && 'لوحة القيادة المركزية'}
                {currentView === 'products' && 'سجل المنتجات'}
                {currentView === 'team' && 'فريق العمل'}
                {currentView === 'kpi' && 'تحليلات الأداء'}
                {currentView === 'documents' && 'الأرشيف الرقمي'}
                {currentView === 'about' && 'معلومات النظام'}
                </h1>
                <p className="text-gray-500 mt-1 text-sm">تاريخ اليوم: {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-royal-800 text-white flex items-center justify-center font-bold text-xl border-4 border-white shadow-lg">
                <User className="w-6 h-6" />
             </div>
          </div>
        </header>

        <AnimatePresence mode='wait'>
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <PasswordModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onConfirm={handleConfirmAuth} 
      />
    </div>
  );
}

export default App;