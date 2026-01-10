import React, { useState } from 'react';
import { KPIData } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { FileDown, Plus, X, ShieldCheck, FileSpreadsheet, Table } from 'lucide-react';
import { motion } from 'framer-motion';

interface KPIProps {
  data: KPIData[];
  setData: React.Dispatch<React.SetStateAction<KPIData[]>>;
  requestAuth: (action: () => void) => void;
}

export const KPIs: React.FC<KPIProps> = ({ data, setData, requestAuth }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newData, setNewData] = useState<Partial<KPIData>>({
    month: '', qualityRate: 95, defects: 0
  });

  const handleExportCSV = () => {
    const headers = ['الشهر', 'معدل الجودة (%)', 'عدد العيوب'];
    
    const csvContent = [
      '\uFEFF' + headers.join(','), // Add BOM for Arabic Excel support
      ...data.map(item => [
        item.month,
        item.qualityRate,
        item.defects
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `KPI_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddData = () => {
    requestAuth(() => {
        setNewData({ month: '', qualityRate: 95, defects: 0 });
        setIsModalOpen(true);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newData.month) {
        setData(prev => [...prev, newData as KPIData]);
        setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header for Print only */}
      <div className="hidden print:block text-center mb-8 border-b-2 border-royal-800 pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-10 h-10 text-royal-800" />
            <h1 className="text-4xl font-black text-royal-800">نظام إدارة الجودة الشاملة</h1>
        </div>
        <h2 className="text-2xl font-bold text-gray-700">تقرير مؤشرات الأداء (KPIs)</h2>
        <p className="text-gray-500 mt-2">تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</p>
      </div>

      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">مؤشرات الأداء (KPIs)</h2>
          <p className="text-gray-500">تحليل معمق لبيانات الجودة</p>
        </div>
        <div className="flex gap-3">
            <button 
            onClick={handleAddData}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm active:scale-95 font-semibold"
            >
            <Plus className="w-5 h-5" />
            <span className="hidden md:inline">تحديث البيانات</span>
            </button>
            
            <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-6 py-3 bg-royal-800 text-white rounded-xl hover:bg-royal-900 transition-all shadow-lg shadow-royal-800/20 active:scale-95 font-semibold"
            >
            <FileSpreadsheet className="w-5 h-5" />
            <span className="hidden md:inline">تصدير CSV</span>
            </button>
        </div>
      </div>

      {/* Quality Trend Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 print:shadow-none print:border print:border-gray-300 print:break-inside-avoid print:mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">تطور معدلات الجودة</h3>
        <p className="text-sm text-gray-500 mb-6 print:hidden">مقارنة شهرية لنسبة المنتجات المطابقة للمواصفات</p>
        <div className="h-96 w-full print:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e40af" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1e40af" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="qualityRate" stroke="#1e40af" fillOpacity={1} fill="url(#colorQuality)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Defects Chart */}
      <div className="grid grid-cols-1 gap-6 print:grid-cols-1 print:break-inside-avoid">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 print:shadow-none print:border print:border-gray-300 print:mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">توزيع العيوب شهرياً</h3>
            <div className="h-80 w-full print:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                        <Legend />
                        <Bar dataKey="defects" name="عدد العيوب" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Data Table - New Section for better Reporting */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border print:border-gray-300 print:break-inside-avoid">
        <div className="p-6 border-b border-gray-100 bg-gray-50 print:bg-gray-100 flex items-center gap-2">
           <Table className="w-5 h-5 text-gray-500" />
           <h3 className="text-lg font-bold text-gray-800">سجل البيانات التفصيلي</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b text-sm">
                <tr>
                    <th className="p-4">الشهر</th>
                    <th className="p-4">معدل الجودة (%)</th>
                    <th className="p-4">عدد العيوب</th>
                    <th className="p-4">تقييم الحالة</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">{item.month}</td>
                    <td className="p-4">
                        <span className="font-bold text-royal-800">{item.qualityRate}%</span>
                        {/* Hide progress bar in print to save ink/cleaner look */}
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden print:hidden">
                            <div className="h-full bg-royal-600 rounded-full" style={{ width: `${item.qualityRate}%` }}></div>
                        </div>
                    </td>
                    <td className="p-4 text-red-600 font-bold">{item.defects}</td>
                    <td className="p-4">
                        {item.qualityRate >= 95 ? (
                        <span className="text-emerald-700 font-bold text-xs bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 print:border-none print:px-0">ممتاز</span>
                        ) : item.qualityRate >= 90 ? (
                        <span className="text-royal-700 font-bold text-xs bg-royal-100 px-3 py-1 rounded-full border border-royal-200 print:border-none print:px-0">جيد</span>
                        ) : (
                        <span className="text-amber-700 font-bold text-xs bg-amber-100 px-3 py-1 rounded-full border border-amber-200 print:border-none print:px-0">يحتاج تحسين</span>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Export Info Box - Hidden in Print */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center print:hidden">
        <div className="w-20 h-20 rounded-full bg-royal-50 flex items-center justify-center mb-4">
            <FileDown className="w-10 h-10 text-royal-800" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">خيارات التصدير</h3>
        <p className="text-gray-500 mb-4 text-sm max-w-sm">
            يمكنك تصدير البيانات بصيغة CSV لاستخدامها في Excel أو برامج التحليل الأخرى.
        </p>
      </div>

      {/* Add Data Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold text-gray-800">إضافة قراءة جديدة</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                    <X className="w-6 h-6" />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">الشهر</label>
                    <input 
                        required 
                        value={newData.month}
                        onChange={(e) => setNewData({...newData, month: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-royal-500 outline-none"
                        placeholder="مثال: يوليو"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">معدل الجودة (%)</label>
                    <input 
                        type="number"
                        required 
                        min="0"
                        max="100"
                        value={newData.qualityRate}
                        onChange={(e) => setNewData({...newData, qualityRate: Number(e.target.value)})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-royal-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">عدد العيوب</label>
                    <input 
                        type="number"
                        required 
                        min="0"
                        value={newData.defects}
                        onChange={(e) => setNewData({...newData, defects: Number(e.target.value)})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-royal-500 outline-none"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full py-3 bg-royal-800 text-white rounded-xl font-bold hover:bg-royal-900 transition-colors shadow-lg shadow-royal-800/20 mt-2"
                >
                    إضافة البيانات
                </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};