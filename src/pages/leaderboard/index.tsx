import DashboardLayout from "@/src/components/dashboard/layout";
import LeaderboardTable from "./leaderboard-table";
import HeadComponent from "@/src/components/head-component";

export default function LeaderboardPage() {
  return (
    <DashboardLayout>
      <HeadComponent
        title="Etherway Leaderboard: Compete and Excel in Blockchain Efficiency"
        description="Discover the top performers in the Etherway community. Our leaderboard showcases users who excel in blockchain transactions and gas efficiency, featuring cutting-edge technology."
      />
      <LeaderboardTable />
    </DashboardLayout>
  );
}
