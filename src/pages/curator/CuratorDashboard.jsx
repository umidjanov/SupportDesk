import { useData } from "../../context/DataContext";
import { PageHeader, StatCard, Card, Avatar, Badge } from "../../components/ui";
import { todayString, statusLabel } from "../../utils/helpers";

export default function CuratorDashboard() {
  const { records, supportUsers, notifs, loadingRec } = useData();
  const todayStr = todayString();

  const groups = [...new Set(records.map((r) => r.group))];

  // per-support stats
  const supportStats = supportUsers
    .map((s) => ({
      ...s,
      total: records.filter((r) => r.supportId === s.id).length,
      today: records.filter((r) => r.supportId === s.id && r.date === todayStr)
        .length,
    }))
    .sort((a, b) => b.total - a.total);

  // theme frequency
  const themeFreq = {};
  records.forEach((r) => {
    themeFreq[r.theme] = (themeFreq[r.theme] || 0) + 1;
  });
  const topThemes = Object.entries(themeFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const unseenCount = notifs.filter((n) => !n.seen).length;

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
        <StatCard
          icon="📋"
          label="Jami yozuvlar"
          value={records.length}
          color="#059669"
          delay={60}
        />
        <StatCard
          icon="📅"
          label="Bugungi"
          value={records.filter((r) => r.date === todayStr).length}
          color="#d97706"
          delay={120}
        />
        <StatCard
          icon="🔔"
          label="Yangi bildirishnomalar"
          value={unseenCount}
          color="#f43f5e"
          delay={180}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Support leaderboard */}
        <Card>
          <h2
            className="font-display font-bold text-base mb-5"
            style={{ color: "var(--text-1)" }}
          >
            🏆 Support Faoliyati
          </h2>
          {supportStats.length === 0 ? (
            <p
              className="text-sm py-6 text-center"
              style={{ color: "var(--text-3)" }}
            >
              Ma'lumot yo'q
            </p>
          ) : (
            <div className="space-y-3">
              {supportStats.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-fast animate-fade-in"
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      background:
                        i === 0
                          ? "rgba(245,158,11,.15)"
                          : i === 1
                            ? "rgba(107,114,128,.1)"
                            : i === 2
                              ? "rgba(180,83,9,.1)"
                              : "var(--bg-2)",
                      color:
                        i === 0
                          ? "#d97706"
                          : i === 1
                            ? "#6b7280"
                            : i === 2
                              ? "#b45309"
                              : "var(--text-3)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <Avatar initials={s.avatar} color={s.color} size={38} />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "var(--text-1)" }}
                    >
                      {s.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>
                      Jami: {s.total} · Bugun: {s.today}
                    </p>
                  </div>
                  {/* progress */}
                  <div className="w-20">
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: "var(--bg-2)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${records.length ? (s.total / records.length) * 100 : 0}%`,
                          background: s.color,
                        }}
                      />
                    </div>
                    <p
                      className="text-xs mt-1 text-right"
                      style={{ color: "var(--text-3)" }}
                    >
                      {records.length
                        ? Math.round((s.total / records.length) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top themes */}
        <Card>
          <h2
            className="font-display font-bold text-base mb-5"
            style={{ color: "var(--text-1)" }}
          >
            📚 Eng Ko'p O'tilgan Mavzular
          </h2>
          {topThemes.length === 0 ? (
            <p
              className="text-sm py-6 text-center"
              style={{ color: "var(--text-3)" }}
            >
              Ma'lumot yo'q
            </p>
          ) : (
            <div className="space-y-3">
              {topThemes.map(([theme, count]) => (
                <div key={theme} className="animate-fade-in">
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-2)" }}
                    >
                      {theme}
                    </span>
                    <Badge variant="blue">{count}x</Badge>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-2)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(count / (topThemes[0][1] || 1)) * 100}%`,
                        background: "linear-gradient(90deg, #3d5eff, #6488ff)",
                        transition: "width 0.7s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent notifs preview */}
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
                  border: `1px solid ${n.seen ? "var(--border)" : "rgba(61,94,255,.15)"}`,
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
