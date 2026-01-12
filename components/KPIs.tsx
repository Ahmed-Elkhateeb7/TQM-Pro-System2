
import React, { useState } from 'react';
import { KPIData } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, LineChart, Line, ComposedChart 
} from 'recharts';
import { 
  FileSpreadsheet, Plus, X, Boxes, Trash2, ShoppingCart, 
  TrendingUp, ShieldCheck, Activity, History, MessageSquareWarning 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface KPIProps {
  data: KPIData[];
  setData: React.Dispatch<React.SetStateAction<KPIData[]>>;
  requestAuth: (action: () => void) => void;
}

// Custom Tooltip Component for a polished look
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl text-white text-right font-sans">
        <p className="font-bold mb-2 border-b border-slate-700 pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm py-0.5">
            <span style={{ color: entry.color }} className="font-bold">{entry.value.toLocaleString()}</span>
            <span className="text-slate-300">{entry.name}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const KPIs: React.FC<KPIProps> = ({ data, setData, requestAuth }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newData, setNewData] = useState<Partial<KPIData>>({
    month: '', qualityRate: 95, defects: 0,
    reservedBlowPieces: 0, reservedBlowWeight: 0,
    reservedInjectionPieces: 0, reservedInjectionWeight: 0,
    scrappedPieces: 0, scrappedWeight: 0,
    ncrShift1: 0, ncrShift2: 0, ncrShift3: 0,
    totalSupplied: 0, totalReturned: 0, totalComplaints: 0
  });

  const handleAddData = () => {
    requestAuth(() => {
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

  const ChartCard = ({ title, icon: Icon, color, children }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-royal-200/30 transition-all duration-500"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${color} bg-opacity-10 shadow-inner`}>
              <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
          <h3 className="text-xl font-black text-slate-800">{title}</h3>
        </div>
      </div>
      {children}
    </motion.div>
  );

  return (
    <div className="space-y-10 pb-20 px-2">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <div className="bg-royal-800 p-2 rounded-xl text-white">
                <History className="w-7 h-7" />
            </div>
            لوحة قيادة الجودة السنوية
          </h2>
          <p className="text-slate-500 mt-1 font-medium mr-12">تحليل بصري متقدم لكافة معايير الجودة والإنتاج</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
            <button onClick={handleAddData} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all font-bold shadow-sm">
                <Plus className="w-5 h-5" />
                تحديث البيانات
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-royal-800 text-white rounded-2xl hover:bg-royal-900 transition-all shadow-xl shadow-royal-800/30 font-bold">
                <FileSpreadsheet className="w-5 h-5" />
                تصدير PDF
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 1. Logistics Trend - Refined Bar Chart */}
        <ChartCard title="إحصائيات التوريد والمرتجعات" icon={ShoppingCart} color="bg-emerald-500">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={12} fontWeight={700} stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis fontSize={12} fontWeight={700} stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
                <Bar dataKey="totalSupplied" name="الكمية الموردة" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={25} />
                <Bar dataKey="totalReturned" name="المرتجعات" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* 2. Customer Complaints Trend */}
        <ChartCard title="مؤشر شكاوى العملاء" icon={MessageSquareWarning} color="bg-amber-500">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="gradComplaints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={12} fontWeight={700} stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis fontSize={12} fontWeight={700} stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="totalComplaints" 
                  name="إجمالي الشكاوى" 
                  stroke="#f59e0b" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#gradComplaints)" 
                  dot={{ r: 6, fill: '#f59e0b', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 3. Production Trend */}
        <ChartCard title="تطور مخزون المحجوز (سنوياً)" icon={Boxes} color="bg-royal-500">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="gradBlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gradInj" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={12} fontWeight={600} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis fontSize={12} fontWeight={600} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="rect" />
                <Area type="monotone" dataKey="reservedBlowPieces" name="محجوز نفخ" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#gradBlow)" />
                <Area type="monotone" dataKey="reservedInjectionPieces" name="محجوز حقن" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#gradInj)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* 4. Waste Analysis */}
        <ChartCard title="تحليل فاقد الهالك (سنوياً)" icon={Trash2} color="bg-rose-500">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={12} fontWeight={600} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis fontSize={12} fontWeight={600} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="scrappedWeight" name="وزن الهالك (كجم)" fill="#fecdd3" radius={[8, 8, 0, 0]} barSize={40} />
                <Line type="monotone" dataKey="scrappedPieces" name="عدد القطع" stroke="#e11d48" strokeWidth={3} dot={{ r: 6, fill: '#e11d48', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* 5. Shift Quality - Clustered Column Chart (Updated from Line to Clustered Bar/Column) */}
      <ChartCard title="مستوى تقارير NCR حسب الورادي" icon={ShieldCheck} color="bg-royal-800">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" fontSize={12} fontWeight={700} stroke="#64748b" axisLine={false} tickLine={false} />
              <YAxis fontSize={12} fontWeight={700} stroke="#64748b" axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="ncrShift1" name="وردية أ" fill="#0284c7" radius={[6, 6, 0, 0]} />
              <Bar dataKey="ncrShift2" name="وردية ب" fill="#ef4444" radius={[6, 6, 0, 0]} />
              <Bar dataKey="ncrShift3" name="وردية ج" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* 6. Main Quality - Premium Area Chart */}
      <ChartCard title="مؤشر الجودة العام للمصنع" icon={Activity} color="bg-royal-800">
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorMainQuality" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e40af" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#1e40af" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" fontSize={14} fontWeight={900} stroke="#1e293b" axisLine={false} tickLine={false} dy={15} />
              <YAxis domain={[0, 100]} fontSize={12} fontWeight={700} stroke="#64748b" axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="qualityRate" 
                name="معدل الجودة %" 
                stroke="#1e40af" 
                strokeWidth={5} 
                fillOpacity={1} 
                fill="url(#colorMainQuality)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Modal remains unchanged */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                <h3 className="text-2xl font-black text-royal-800 flex items-center gap-3">
                    <Plus className="w-8 h-8 p-1.5 bg-royal-100 rounded-lg" /> إضافة تقرير جديد
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                    <X className="w-8 h-8" />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-slate-600 mr-2 uppercase tracking-wide">اسم الشهر</label>
                        <input required value={newData.month} onChange={(e) => setNewData({...newData, month: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-royal-500/10 focus:border-royal-500 outline-none font-bold text-slate-700 bg-slate-50/50" placeholder="مثال: أكتوبر" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-slate-600 mr-2 uppercase tracking-wide">نسبة الجودة %</label>
                        <input type="number" required min="0" max="100" value={newData.qualityRate} onChange={(e) => setNewData({...newData, qualityRate: Number(e.target.value)})} className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-royal-500/10 focus:border-royal-500 outline-none font-bold text-slate-700 bg-slate-50/50" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-slate-600 mr-2 uppercase tracking-wide">العيوب المكتشفة</label>
                        <input type="number" required value={newData.defects} onChange={(e) => setNewData({...newData, defects: Number(e.target.value)})} className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-royal-500/10 focus:border-royal-500 outline-none font-bold text-slate-700 bg-slate-50/50" />
                    </div>
                </div>

                <div className="bg-royal-50/50 p-8 rounded-3xl border border-royal-100 shadow-inner">
                    <h4 className="font-black text-royal-900 mb-6 flex items-center gap-2">
                        <Boxes className="w-5 h-5" /> كميات الإنتاج المحجوز
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <input type="number" placeholder="عدد النفخ" onChange={(e) => setNewData({...newData, reservedBlowPieces: Number(e.target.value)})} className="px-5 py-3 rounded-xl border border-white bg-white shadow-sm outline-none" />
                        <input type="number" step="0.01" placeholder="وزن النفخ" onChange={(e) => setNewData({...newData, reservedBlowWeight: Number(e.target.value)})} className="px-5 py-3 rounded-xl border border-white bg-white shadow-sm outline-none" />
                        <input type="number" placeholder="عدد الحقن" onChange={(e) => setNewData({...newData, reservedInjectionPieces: Number(e.target.value)})} className="px-5 py-3 rounded-xl border border-white bg-white shadow-sm outline-none" />
                        <input type="number" step="0.01" placeholder="وزن الحقن" onChange={(e) => setNewData({...newData, reservedInjectionWeight: Number(e.target.value)})} className="px-5 py-3 rounded-xl border border-white bg-white shadow-sm outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-rose-50/50 p-8 rounded-3xl border border-rose-100">
                        <h4 className="font-black text-rose-900 mb-6 flex items-center gap-2"><Trash2 className="w-5 h-5" /> بيانات الهالك</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" placeholder="العدد" onChange={(e) => setNewData({...newData, scrappedPieces: Number(e.target.value)})} className="px-4 py-3 rounded-xl bg-white border-white outline-none" />
                            <input type="number" step="0.1" placeholder="الوزن" onChange={(e) => setNewData({...newData, scrappedWeight: Number(e.target.value)})} className="px-4 py-3 rounded-xl bg-white border-white outline-none" />
                        </div>
                    </div>
                    <div className="bg-amber-50/50 p-8 rounded-3xl border border-amber-100">
                        <h4 className="font-black text-amber-900 mb-6 flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> بلاغات NCR</h4>
                        <div className="grid grid-cols-3 gap-3">
                            <input type="number" placeholder="وردية أ" onChange={(e) => setNewData({...newData, ncrShift1: Number(e.target.value)})} className="px-3 py-3 rounded-xl bg-white border-white outline-none text-center" />
                            <input type="number" placeholder="وردية ب" onChange={(e) => setNewData({...newData, ncrShift2: Number(e.target.value)})} className="px-3 py-3 rounded-xl bg-white border-white outline-none text-center" />
                            <input type="number" placeholder="وردية ج" onChange={(e) => setNewData({...newData, ncrShift3: Number(e.target.value)})} className="px-3 py-3 rounded-xl bg-white border-white outline-none text-center" />
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100">
                    <h4 className="font-black text-emerald-900 mb-6 flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> بيانات التوريد والشكاوى</h4>
                    <div className="grid grid-cols-3 gap-6">
                        <input type="number" placeholder="إجمالي المورد" onChange={(e) => setNewData({...newData, totalSupplied: Number(e.target.value)})} className="px-4 py-3 rounded-xl bg-white border-white outline-none" />
                        <input type="number" placeholder="إجمالي المرتجع" onChange={(e) => setNewData({...newData, totalReturned: Number(e.target.value)})} className="px-4 py-3 rounded-xl bg-white border-white outline-none" />
                        <input type="number" placeholder="عدد الشكاوى" onChange={(e) => setNewData({...newData, totalComplaints: Number(e.target.value)})} className="px-4 py-3 rounded-xl bg-white border-white outline-none" />
                    </div>
                </div>

                <button type="submit" className="w-full py-5 bg-royal-800 text-white rounded-[2rem] font-black text-2xl hover:bg-royal-900 transition-all shadow-2xl shadow-royal-800/40 active:scale-[0.98]">
                    تأكيد وإدراج التقرير
                </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
