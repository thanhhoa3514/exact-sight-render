import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, LogOut, FileText, MessageSquare, LayoutDashboard, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationPanel from './NotificationPanel';

export default function StudentLayout() {
    const { theme, setTheme } = useTheme();
    const { lang, setLang } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Student Navigation Links
    const navLinks = [
        { name: 'Tổng quan', path: '/student', icon: LayoutDashboard },
        { name: 'Tài liệu & Báo cáo', path: '/student/documents', icon: FileText },
        { name: 'Hỏi đáp GVHD', path: '/student/messages', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Left side: Logo and Navigation */}
                        <div className="flex items-center">
                            <div
                                className="flex-shrink-0 flex items-center gap-3 cursor-pointer"
                                onClick={() => navigate('/')}
                            >
                                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm">
                                    <img src="/logo.png" alt="Logo" className="w-5 h-5 object-contain" />
                                </div>
                                <span className="font-outfit font-bold text-lg text-zinc-900 dark:text-zinc-50 hidden sm:block">
                                    Student Portal
                                </span>
                            </div>

                            {/* Desktop Nav Links */}
                            <nav className="hidden md:ml-10 md:flex md:space-x-8">
                                {navLinks.map((link) => {
                                    const isActive = location.pathname === link.path || (link.path !== '/student' && location.pathname.startsWith(link.path));
                                    return (
                                        <NavLink
                                            key={link.path}
                                            to={link.path}
                                            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive
                                                    ? 'border-emerald-500 text-zinc-900 dark:text-zinc-50'
                                                    : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'
                                                }`}
                                        >
                                            <link.icon className="w-4 h-4 mr-2" />
                                            {link.name}
                                        </NavLink>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Right side: Tools and Profile */}
                        <div className="flex items-center gap-2">
                            {/* Language Toggle */}
                            <div className="hidden sm:flex relative h-8 w-[68px] items-center rounded-full bg-zinc-100 dark:bg-zinc-800 p-0.5">
                                <motion.div
                                    className="absolute h-7 w-[30px] rounded-full bg-white dark:bg-zinc-700 shadow-sm"
                                    animate={{ x: lang === 'vi' ? 1 : 33 }}
                                    transition={{ duration: 0.15 }}
                                />
                                <button
                                    onClick={() => setLang('vi')}
                                    className={`relative z-10 flex h-7 w-[30px] items-center justify-center rounded-full text-xs font-semibold ${lang === 'vi' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}
                                >VI</button>
                                <button
                                    onClick={() => setLang('en')}
                                    className={`relative z-10 flex h-7 w-[30px] items-center justify-center rounded-full text-xs font-semibold ${lang === 'en' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}
                                >EN</button>
                            </div>

                            {/* Theme Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {theme === 'dark' ? (
                                        <motion.div key="sun" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }} transition={{ duration: 0.2 }}>
                                            <Sun className="h-4 w-4" />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="moon" initial={{ rotate: 90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0 }} transition={{ duration: 0.2 }}>
                                            <Moon className="h-4 w-4" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>

                            {/* Notifications */}
                            <NotificationPanel />

                            {/* Student Profile / Logout */}
                            <div className="hidden sm:flex items-center ml-2 border-l border-zinc-200 dark:border-zinc-800 pl-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs ring-2 ring-white dark:ring-zinc-900">
                                        SV
                                    </div>
                                    <div className="hidden lg:block text-sm">
                                        <p className="font-medium text-zinc-900 dark:text-zinc-50">Lê Văn Sinh</p>
                                        <p className="text-xs text-zinc-500">20120101 • KHDL</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="ml-2 text-zinc-400 hover:text-red-500 rounded-full" onClick={() => navigate('/')}>
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Mobile menu button */}
                            <div className="flex items-center md:hidden ml-2">
                                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        >
                            <div className="pt-2 pb-3 space-y-1 px-4">
                                {navLinks.map((link) => {
                                    const isActive = location.pathname === link.path || (link.path !== '/student' && location.pathname.startsWith(link.path));
                                    return (
                                        <NavLink
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                                                    : 'border-transparent text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-300'
                                                }`}
                                        >
                                            <link.icon className="w-5 h-5 mr-3" />
                                            {link.name}
                                        </NavLink>
                                    );
                                })}
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex w-full items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Đăng xuất
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
}
