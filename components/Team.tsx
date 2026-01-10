import React, { useState } from 'react';
import { Employee } from '../types';
import { Search, UserPlus, Microscope, ShieldCheck, Briefcase, Trash2, Mail, Phone, Calendar, Edit2, X, Users, CheckCircle, ClipboardCheck, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamProps {
  team: Employee[];
  setTeam: React.Dispatch<React.SetStateAction<Employee[]>>;
  requestAuth: (action: () => void) => void;
}

export const Team: React.FC<TeamProps> = ({ team, setTeam, requestAuth }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '', role: '', department: 'qc', email: '', phone: ''
  });

  const filteredTeam = team.filter(t => {
    return t.name.includes(searchTerm) || t.role.includes(searchTerm);
  });

  const stats = {
    total: team.length,
    management: team.filter(t => t.department === 'management').length,
    qc: team.filter(t => t.department === 'qc').length,
    qa: team.filter(t => t.department === 'qa').length,
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', department: 'qc', email: '', phone: '' });
    setEditingMember(null);
  };

  const handleOpenAdd = () => {
    requestAuth(() => {
      resetForm();
      setIsModalOpen(true);
    });
  };

  const handleOpenEdit = (member: Employee) => {
    requestAuth(() => {
      setEditingMember(member);
      setFormData(member);
      setIsModalOpen(true);
    });
  };

  const handleDelete = (id: string) => {
    requestAuth(() => {
      setTeam(prev => prev.filter(member => member.id !== id));
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setTeam(prev => prev.map(t => t.id === editingMember.id ? { ...t, ...formData } as Employee : t));
    } else {
      const newMember: Employee = {
        id: Date.now().toString(),
        joinedDate: new Date().toISOString().split('T')[0],
        ...(formData as any)
      };
      setTeam(prev => [newMember, ...prev]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const getDeptColor = (dept: string) => {
      switch(dept) {
        case 'qa': return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'qc': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        default: return 'bg-blue-100 text-blue-700 border-blue-200';
      }
  };

  const getDeptIcon = (dept: string) => {
    switch(dept) {
        case 'qa': return <ShieldCheck className="w-4 h-4" />;
        case 'qc': return <Microscope className="w-4 h-4" />;
        default: return <Briefcase className="w-4 h-4" />;
    }
  };

  const getDeptName = (dept: string) => {
    switch(dept) {
        case 'qa': return 'توكيد جودة';
        case 'qc': return 'مراقب جودة';
        default: return 'الإدارة العليا';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold mb-1">إجمالي الفريق</p>
                <h3 className="text-2xl font-black text-royal-800">{stats.total}</h3>
            </div>
            <div className="p-3 bg-royal-50 text-royal-600 rounded-lg"><Users className="w-5 h-5" /></div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold mb-1">الإدارة</p>
                <h3 className="text-2xl font-black text-blue-800">{stats.management}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Briefcase className="w-5 h-5" /></div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold mb-1">مراقب جودة</p>
                <h3 className="text-2xl font-black text-emerald-800">{stats.qc}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Microscope className="w-5 h-5" /></div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold mb-1">توكيد جودة</p>
                <h3 className="text-2xl font-black text-purple-800">{stats.qa}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><ShieldCheck className="w-5 h-5" /></div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">فريق الجودة</h2>
          <p className="text-gray-500">إدارة الصلاحيات وبيانات التواصل</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3 bg-royal-800 text-white rounded-xl hover:bg-royal-900 transition-all shadow-lg shadow-royal-800/20 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          إضافة عضو جديد
        </button>
      </div>

      {/* Controls - Search Only */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
            type="text" 
            placeholder="بحث بالاسم، الوظيفة، أو البريد الإلكتروني..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-royal-500 outline-none transition-all"
            />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode='popLayout'>
            {filteredTeam.map((member) => (
                <motion.div 
                    key={member.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                    <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-royal-50 to-white flex items-center justify-center text-2xl font-bold text-royal-300 border-2 border-royal-50 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{member.name}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{member.role}</p>
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleOpenEdit(member)}
                                    className="text-gray-400 hover:text-royal-600 hover:bg-royal-50 p-2 rounded-lg transition-colors"
                                    title="تعديل"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(member.id)}
                                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    title="حذف"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border mb-6 ${getDeptColor(member.department)}`}>
                            {getDeptIcon(member.department)}
                            <span>{getDeptName(member.department)}</span>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-gray-600 hover:text-royal-800 transition-colors group/link p-2 hover:bg-gray-50 rounded-lg -mx-2">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover/link:bg-royal-100 group-hover/link:text-royal-700 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium truncate">{member.email || 'غير مسجل'}</span>
                            </a>
                            
                            <a href={`tel:${member.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-royal-800 transition-colors group/link p-2 hover:bg-gray-50 rounded-lg -mx-2">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover/link:bg-royal-100 group-hover/link:text-royal-700 transition-colors">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium" dir="ltr">{member.phone || 'غير مسجل'}</span>
                            </a>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 px-6 py-3 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100">
                         <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>انضم: {member.joinedDate}</span>
                         </div>
                         <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" title="نشط"></div>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
      </div>
      
      {filteredTeam.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">لا توجد نتائج</h3>
              <p className="text-gray-500">حاول تغيير معايير البحث</p>
          </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {editingMember ? <Edit2 className="w-5 h-5 text-royal-600" /> : <UserPlus className="w-5 h-5 text-royal-600" />}
                {editingMember ? 'تعديل بيانات عضو' : 'إضافة عضو جديد'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم الكامل</label>
                    <input 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-royal-500 outline-none"
                        placeholder="مثال: أحمد محمد"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">المسمى الوظيفي</label>
                        <input 
                            required 
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-royal-500 outline-none"
                            placeholder="مثال: فني جودة"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">القسم</label>
                        <select 
                            value={formData.department}
                            onChange={(e) => setFormData({...formData, department: e.target.value as any})}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-royal-500 outline-none bg-white"
                        >
                            <option value="management">الإدارة العليا</option>
                            <option value="qc">مراقب جودة</option>
                            <option value="qa">توكيد جودة</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">البريد الإلكتروني</label>
                        <input 
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-royal-500 outline-none text-left"
                            placeholder="user@example.com"
                            dir="ltr"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">رقم الهاتف</label>
                        <input 
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-royal-500 outline-none text-left"
                            placeholder="+966 50..."
                            dir="ltr"
                        />
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                    >
                        إلغاء
                    </button>
                    <button 
                        type="submit" 
                        className="flex-1 py-2.5 bg-royal-800 text-white rounded-lg font-bold hover:bg-royal-900 transition-colors shadow-lg shadow-royal-800/20 flex items-center justify-center gap-2"
                    >
                        <CheckCircle className="w-5 h-5" />
                        حفظ البيانات
                    </button>
                </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};