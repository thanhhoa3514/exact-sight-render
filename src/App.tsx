import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import DeTaiList from "@/pages/DeTaiList";
import LuanVanList from "@/pages/LuanVanList";
import SinhVienList from "@/pages/SinhVienList";
import BaoCao from "@/pages/BaoCao";
import Login from "@/pages/Login";
import NotFound from "./pages/NotFound";
import { LichBaoVe } from "@/pages/LichBaoVe";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="app-theme">
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/de-tai" element={<DeTaiList />} />
                <Route path="/luan-van" element={<LuanVanList />} />
                <Route path="/sinh-vien" element={<SinhVienList />} />
                <Route path="/bao-cao" element={<BaoCao />} />
                <Route path="/lich-bao-ve" element={<LichBaoVe />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
