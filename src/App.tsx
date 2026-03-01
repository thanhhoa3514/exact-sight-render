import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NotificationProvider } from "@/contexts/NotificationContext"; // Added import
import { ToastStack } from "@/components/layout/ToastStack";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import PortalSelection from "@/pages/PortalSelection";
import DeTaiList from "@/pages/DeTaiList";
import LuanVanList from "@/pages/LuanVanList";
import SinhVienList from "@/pages/SinhVienList";
import BaoCao from "@/pages/BaoCao";
import Login from "@/pages/Login";
import NotFound from "./pages/NotFound";
import { LichBaoVe } from "@/pages/LichBaoVe";
import { GiangVien } from "@/pages/GiangVien";
import { HoiDong } from "@/pages/HoiDong";

import StudentLayout from "@/components/layout/StudentLayout";
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentDocuments from "@/pages/student/StudentDocuments";
import StudentMessages from "@/pages/student/StudentMessages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="app-theme">
      <LanguageProvider>
        <NotificationProvider> {/* Added NotificationProvider */}
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<PortalSelection />} />
                <Route path="/login" element={<Login />} />

                {/* Admin Portal Routes */}
                <Route path="/admin" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="de-tai" element={<DeTaiList />} />
                  <Route path="luan-van" element={<LuanVanList />} />
                  <Route path="sinh-vien" element={<SinhVienList />} />
                  <Route path="bao-cao" element={<BaoCao />} />
                  <Route path="lich-bao-ve" element={<LichBaoVe />} />
                  <Route path="giang-vien" element={<GiangVien />} />
                  <Route path="hoi-dong" element={<HoiDong />} />
                </Route>

                {/* Student Portal Routes */}
                <Route path="/student" element={<StudentLayout />}>
                  <Route index element={<StudentDashboard />} />
                  <Route path="documents" element={<StudentDocuments />} />
                  <Route path="messages" element={<StudentMessages />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
              <ToastStack />
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider> {/* Closed NotificationProvider */}
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
