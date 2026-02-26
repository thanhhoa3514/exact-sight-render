import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-16 transition-all duration-200 lg:pl-64">
        <TopBar />
        <main className="content-area mx-auto max-w-[1280px] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
