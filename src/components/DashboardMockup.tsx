import { BarChart3, Users, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, LayoutDashboard, Home, Settings, Bell, Search, ChevronDown } from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "£124,500", change: "+12.5%", up: true, icon: DollarSign },
  { label: "Active Users", value: "8,432", change: "+5.2%", up: true, icon: Users },
  { label: "Conversion Rate", value: "3.8%", change: "+0.4%", up: true, icon: TrendingUp },
  { label: "Open Tickets", value: "24", change: "-18%", up: false, icon: BarChart3 },
];

const tableRows = [
  { name: "Acme Corp", status: "Active", amount: "£12,400", date: "24 Feb 2026" },
  { name: "Globex Ltd", status: "Pending", amount: "£8,200", date: "23 Feb 2026" },
  { name: "Stark Industries", status: "Active", amount: "£23,100", date: "22 Feb 2026" },
  { name: "Wayne Enterprises", status: "Completed", amount: "£5,750", date: "21 Feb 2026" },
  { name: "Umbrella Corp", status: "Active", amount: "£15,900", date: "20 Feb 2026" },
];

const sidebarItems = [
  { icon: Home, label: "Overview", active: true },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Users, label: "Customers", active: false },
  { icon: DollarSign, label: "Revenue", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const chartBars = [35, 55, 45, 70, 60, 80, 65, 90, 75, 85, 70, 95];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const DashboardMockup = () => {
  return (
    <div className="rounded-2xl overflow-hidden border border-border shadow-2xl shadow-primary/10 bg-[hsl(220,20%,10%)] text-white select-none pointer-events-none" aria-hidden="true">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-52 bg-[hsl(220,20%,8%)] border-r border-white/5 p-4 gap-1">
          <div className="flex items-center gap-2 mb-6 px-2">
            <LayoutDashboard className="w-5 h-5 text-[hsl(var(--primary))]" />
            <span className="font-bold text-sm">Advant Flow AI</span>
          </div>
          {sidebarItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                item.active
                  ? "bg-[hsl(var(--primary))] text-white"
                  : "text-white/50 hover:text-white/70"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 text-xs text-white/40 w-48">
              <Search className="w-3.5 h-3.5" />
              Search...
            </div>
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-white/40" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))]" />
                <span className="text-xs text-white/60 hidden sm:block">Admin</span>
                <ChevronDown className="w-3 h-3 text-white/40" />
              </div>
            </div>
          </div>

          {/* Dashboard title */}
          <div className="px-5 pt-4 pb-2">
            <h3 className="text-sm font-semibold text-white">Dashboard Overview</h3>
            <p className="text-[10px] text-white/40">Welcome back. Here's what's happening today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-5 pb-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-white/40">{stat.label}</span>
                  <stat.icon className="w-3.5 h-3.5 text-white/20" />
                </div>
                <div className="text-lg font-bold text-white leading-none mb-1">{stat.value}</div>
                <div className={`flex items-center gap-0.5 text-[10px] font-medium ${stat.up ? "text-emerald-400" : "text-rose-400"}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          {/* Chart + Table row */}
          <div className="grid lg:grid-cols-5 gap-3 px-5 pb-5">
            {/* Bar Chart */}
            <div className="lg:col-span-3 bg-white/[0.04] border border-white/[0.06] rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-white/70">Monthly Revenue</span>
                <span className="text-[10px] text-white/30">2026</span>
              </div>
              <div className="flex items-end gap-1.5 h-28">
                {chartBars.map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-sm bg-gradient-to-t from-[hsl(var(--primary))] to-[hsl(var(--accent))]"
                      style={{ height: `${height}%`, opacity: 0.6 + (height / 250) }}
                    />
                    <span className="text-[8px] text-white/25">{months[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="lg:col-span-2 bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 overflow-hidden">
              <span className="text-xs font-medium text-white/70 block mb-3">Recent Clients</span>
              <div className="space-y-0">
                <div className="grid grid-cols-3 gap-2 text-[9px] text-white/30 font-medium pb-2 border-b border-white/5">
                  <span>Name</span>
                  <span>Status</span>
                  <span className="text-right">Amount</span>
                </div>
                {tableRows.map((row) => (
                  <div key={row.name} className="grid grid-cols-3 gap-2 text-[10px] py-1.5 border-b border-white/[0.03]">
                    <span className="text-white/70 truncate">{row.name}</span>
                    <span className={`${
                      row.status === "Active" ? "text-emerald-400" :
                      row.status === "Pending" ? "text-amber-400" :
                      "text-white/40"
                    }`}>{row.status}</span>
                    <span className="text-white/60 text-right">{row.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
