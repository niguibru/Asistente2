import SuggestedPrompts from "../../components/chatAgent/SuggestedPrompts";
//import RecentOrders from "../../components/ecommerce/RecentOrders";
import PageMeta from "../../components/common/PageMeta";
import ChatAgent from "../../components/chatAgent/ChatAgent";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Portal Zinco "
        description=""
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <ChatAgent />

        </div>

        <div className="col-span-12 xl:col-span-5">
          <SuggestedPrompts />
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div> */}

        {/* <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
      </div>
    </>
  );
}
