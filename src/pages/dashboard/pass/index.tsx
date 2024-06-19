import DashboardHome from "@/components/dashboard/dashboard-home";
import DashboardLayout from "@/components/dashboard/layout";
import { MintPassHome } from "@/components/dashboard/pass/mint-pass-home";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center md:py-6 ">
        <MintPassHome />
      </div>
    </DashboardLayout>
  );
}
