import { useMemo } from "react";
import { useData } from "../../context/DataContext";
import { PageHeader, StatCard, Card, Avatar } from "../../components/ui";
import { todayString } from "../../utils/helpers";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";

export default function CuratorDashboard() {
  const { records, supportUsers, notifs } = useData();
  const todayStr = todayString();

  const unseenCount = notifs.filter((n) => !n.seen).length;

  // 🔥 REAL-TIME SUPPORT STATS
  const supportStats = useMemo(() => {
    return supportUsers
      .map((s) => ({
        ...s,
        total: records.filter((r) => r.supportId === s.id).length,
      }))
      .sort((a, b) => b.total - a.total);
  }, [records, supportUsers]);

  // 🔥 REAL-TIME CHART CONFIG
  const chartConfig = useMemo(() => {
    return {
      type: "bar",
      height: 320,
      series: [
        {
          name: "Jami o'quvchilar",
          data: supportStats.map((s) => s.total),
        },
      ],
      options: {
        chart: {
          toolbar: { show: false },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 500,
          },
        },
        dataLabels: { enabled: false },
        colors: ["#3d5eff"],
        plotOptions: {
          bar: {
            columnWidth: "45%",
            borderRadius: 6,
          },
        },
        xaxis: {
          categories: supportStats.map((s) => s.name.split(" ")[0]),
          labels: {
            style: {
              colors: "#616161",
              fontSize: "12px",
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#616161",
              fontSize: "12px",
            },
          },
        },
        grid: {
          borderColor: "#e5e7eb",
          strokeDashArray: 4,
        },
        tooltip: {
          theme: "dark",
        },
      },
    };
  }, [supportStats]);

  return (
    <div>
      <PageHeader
        title="Kurator Paneli"
        subtitle="Barcha support teacherlar faoliyatini kuzating"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon="👨‍🏫"
          label="Supportlar"
          value={supportUsers.length}
          color="#3d5eff"
          delay={0}
        />
        <Link to="/curator/logs">
          <StatCard
            icon="📋"
            label="Jami yozuvlar"
            value={records.length}
            color="#059669"
            delay={60}
          />
        </Link>
        <StatCard
          icon="📅"
          label="Bugungi"
          value={records.filter((r) => r.date === todayStr).length}
          color="#d97706"
          delay={120}
        />
        <Link to="/curator/notifs">
          <StatCard
            icon="🔔"
            label="Yangi bildirishnomalar"
            value={unseenCount}
            color="#f43f5e"
            delay={180}
          />
        </Link>
      </div>

      {/* 📊 Support Reyting Grafik */}
      <div className="mb-6">
        <Card>
          <h2
            className="font-display font-bold text-base mb-5"
            style={{ color: "var(--text-1)" }}
          >
            📊 Support Reyting Grafik
          </h2>

          {supportStats.length === 0 ? (
            <p
              className="text-sm py-6 text-center"
              style={{ color: "var(--text-3)" }}
            >
              Ma'lumot yo'q
            </p>
          ) : (
            <Chart
              key={records.length} // 🔥 har yangi yozuvda re-render majburiy
              {...chartConfig}
            />
          )}
        </Card>
      </div>

      {/* 🔔 Recent notifs preview */}
      {notifs.length > 0 && (
        <Card>
          <h2
            className="font-display font-bold text-base mb-4"
            style={{ color: "var(--text-1)" }}
          >
            🔔 Oxirgi Bildirishnomalar
          </h2>
          <div className="space-y-2">
            {notifs.slice(0, 4).map((n) => (
              <div
                key={n.id}
                className="flex items-center gap-3 p-3 rounded-xl animate-fade-in"
                style={{
                  background: n.seen ? "transparent" : "rgba(61,94,255,.04)",
                  border: `1px solid ${
                    n.seen ? "var(--border)" : "rgba(61,94,255,.15)"
                  }`,
                }}
              >
                <Avatar
                  initials={n.supportName
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                  color="#3d5eff"
                  size={34}
                />
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-1)" }}
                  >
                    {n.supportName.split(" ")[0]} yozuv qo'shdi
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>
                    {n.student} · {n.group} · {n.theme}
                  </p>
                </div>
                {!n.seen && <div className="notif-dot" />}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
