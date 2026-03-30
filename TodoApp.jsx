'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, X, Calendar, Loader2 } from 'lucide-react';

export default function TodoApp() {
    const [todoList, setTodoList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 取得今天的 7 天後日期 (預設期限)
    const getDefaultDueDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        content: '',
        due_date: getDefaultDueDate(),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 排序：有期限優先 (近到遠)，無期限墊底
    const sortTodo = (list) => {
        return [...list].sort((a, b) => {
            if (!a.due_date) return 1;
            if (!b.due_date) return -1;
            return new Date(a.due_date) - new Date(b.due_date);
        });
    };

    // 計算剩餘天數與對應視覺樣式
    const getDaysRemainingInfo = (dateString) => {
        if (!dateString) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dateString);
        due.setHours(0, 0, 0, 0);

        const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

        if (diffDays > 0) return { text: `剩 ${diffDays} 天`, style: 'opacity-70' };
        if (diffDays === 0) return { text: '今天到期', style: 'opacity-100 font-bold' };
        return { text: `已過期 ${Math.abs(diffDays)} 天`, style: 'text-red-800/70 font-bold' };
    };

    // 載入事項 (包含未完成與 24 小時內完成的待定項目)
    const fetchTodo = async () => {
        try {
            setIsLoading(true);
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const { data, error } = await supabase
                .from('Todo')
                .select('*')
                .or(`is_completed.eq.false,and(is_completed.eq.true,completed_at.gte.${yesterday})`)
                .order('due_date', { ascending: true, nullsFirst: false });

            if (error) throw error;
            setTodoList(data);
        } catch (err) {
            toast.error('無法載入待辦事項');
            console.error('Fetch fail:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTodo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.content.trim()) return toast.error('請填寫事項內容');

        try {
            setIsSubmitting(true);
            const { data, error } = await supabase
                .from('Todo')
                .insert([
                    {
                        content: formData.content,
                        due_date: formData.due_date || null,
                        is_completed: false,
                    },
                ])
                .select();

            if (error) throw error;

            setTodoList((prev) => sortTodo([...prev, data[0]]));
            setFormData({ content: '', due_date: getDefaultDueDate() });
            setIsModalOpen(false);
            toast.success('事項已新增');
        } catch (err) {
            console.error('Insert fail:', err);
            toast.error('新增失敗，請稍後再試');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 切換完成狀態
    const toggleTodo = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        const timestamp = newStatus ? new Date().toISOString() : null;

        setTodoList((prev) =>
            prev.map((item) => (item.id === id ? { ...item, is_completed: newStatus, completed_at: timestamp } : item)),
        );

        try {
            const { error } = await supabase
                .from('Todo')
                .update({ is_completed: newStatus, completed_at: timestamp })
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error('Update fail:', err);
            toast.error('狀態更新失敗');
            fetchTodo();
        }
    };

    const activeTodo = todoList.filter((item) => !item.is_completed);
    const completedTodo = todoList.filter((item) => item.is_completed);

    return (
        <div className="min-h-screen bg-[#E5E0DC] text-[#3f4a4e] font-sans p-6 md:p-10">
            <div className="max-w-4xl mx-auto w-full pb-24">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold tracking-wide mb-2">Daily Task</h1>
                    <p className="opacity-70 text-sm tracking-wide">生活雜事收納區</p>
                </header>

                {/* --- 進行中事項清單 --- */}
                {isLoading ? (
                    <div className="space-y-4">
                        <div className="h-16 border-2 border-[#3f4a4e]/10 rounded-2xl animate-pulse"></div>
                        <div className="h-16 border-2 border-[#3f4a4e]/10 rounded-2xl animate-pulse"></div>
                    </div>
                ) : activeTodo.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-[#3f4a4e]/20 rounded-2xl">
                        <p className="text-[#3f4a4e]/50 font-bold tracking-widest text-sm uppercase">No Task Pending</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {activeTodo.map((item) => {
                            const daysInfo = getDaysRemainingInfo(item.due_date);
                            return (
                                <li
                                    key={item.id}
                                    className="flex items-center gap-4 p-4 rounded-2xl border-2 border-[#3f4a4e]/10 hover:border-[#3f4a4e]/30 hover:bg-[#3f4a4e]/5 transition-all bg-white/20"
                                >
                                    <input
                                        type="checkbox"
                                        checked={false}
                                        className="w-5 h-5 rounded border-2 border-[#3f4a4e]/40 accent-[#3f4a4e] cursor-pointer shrink-0"
                                        onChange={() => toggleTodo(item.id, item.is_completed)}
                                    />
                                    {/* 使用 text-sm 與 line-clamp-2 讓長文字優雅地顯示兩行 */}
                                    <p className="flex-1 text-sm font-medium line-clamp-2" title={item.content}>
                                        {item.content}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm shrink-0">
                                        {daysInfo && (
                                            <span
                                                className={`flex items-center gap-1.5 font-mono tracking-wide ${daysInfo.style}`}
                                            >
                                                <Calendar size={14} />
                                                {daysInfo.text}
                                            </span>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* --- 待定區 (近期完成) --- */}
                {completedTodo.length > 0 && (
                    <div className="mt-12 pt-8 border-t-2 border-dashed border-[#3f4a4e]/20">
                        <h2 className="text-sm font-bold tracking-widest uppercase opacity-50 mb-4">Recently Completed</h2>
                        <ul className="space-y-3">
                            {completedTodo.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex items-center gap-4 p-4 rounded-2xl border-2 border-[#3f4a4e]/5 bg-[#3f4a4e]/5 opacity-60 hover:opacity-100 transition-all"
                                >
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        className="w-5 h-5 rounded border-2 border-[#3f4a4e]/40 accent-[#3f4a4e] cursor-pointer shrink-0"
                                        onChange={() => toggleTodo(item.id, item.is_completed)}
                                    />
                                    <p className="flex-1 text-sm font-medium line-clamp-2 line-through" title={item.content}>
                                        {item.content}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* FAB (浮動新增按鈕) */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-[#3f4a4e] text-[#E5E0DC] rounded-full shadow-lg text-2xl flex items-center justify-center hover:bg-[#2c3437] transition-colors focus:outline-none z-40"
            >
                <Plus size={28} />
            </button>

            {/* --- 新增表單 Modal --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#3f4a4e]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#E5E0DC] rounded-3xl p-8 w-full max-w-lg shadow-2xl relative border-2 border-[#3f4a4e]/10">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-[#3f4a4e]/50 hover:text-[#3f4a4e] p-1 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-8 tracking-tight text-[#3f4a4e]">Add New Task</h2>

                        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
                            <div>
                                <label className="block text-sm font-bold mb-2 opacity-80">Content</label>
                                <input
                                    type="text"
                                    name="content"
                                    required
                                    placeholder="例如：整理 GCP 帳號、訂演唱會門票..."
                                    className="w-full bg-white/50 border-2 border-[#3f4a4e]/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3f4a4e]/40 transition-colors"
                                    value={formData.content}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 opacity-80">Due Date (預設 7 天後)</label>
                                <input
                                    type="date"
                                    name="due_date"
                                    className="w-full bg-white/50 border-2 border-[#3f4a4e]/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3f4a4e]/40 transition-colors font-mono"
                                    value={formData.due_date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-[#3f4a4e]/10">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 text-sm font-bold tracking-widest text-[#3f4a4e]/60 hover:bg-[#3f4a4e]/5 rounded-xl transition-colors uppercase"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 bg-[#3f4a4e] text-[#E5E0DC] rounded-xl font-bold tracking-widest text-sm uppercase shadow-lg shadow-[#3f4a4e]/20 hover:bg-[#2c3437] transition-all disabled:opacity-70 flex items-center gap-2"
                                >
                                    {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                                    Save Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
