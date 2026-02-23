import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import {
  PageHeader,
  StatCard,
  Card,
  Avatar,
  Badge,
  Skeleton,
} from "../../components/ui";
import { todayString, statusLabel } from "../../utils/helpers";
import { Link } from "react-router-dom";

// Animated counter component
function AnimatedCounter({ value, duration = 500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    if (value === 0) return;

    const increment = value / (duration / 50); // 50ms interval
    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(interval);
      }
      setCount(Math.floor(start));
    }, 50);

    return () => clearInterval(interval);
  }, [value, duration]);

  return <>{count}</>;
}

export default function HomePage() {
  const { user } = useAuth();
  const { records, supportUsers, loadingRec } = useData();

  const todayStr = todayString();
  const todayRecs = records.filter((r) => r.date === todayStr);
  const allGroups = [...new Set(records.map((r) => r.group))];
  const groupsPath =
    user?.role === "support"
      ? "/dashboard/groups"
      : user?.role === "curator"
        ? "/curator/groups"
        : "/home";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={`Salom, ${user?.name?.split(" ")[0]}! 👋`}
        subtitle={`Bugun ${new Date().toLocaleDateString("uz-UZ", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })} — barcha faollik`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-8">
        <Link to="/curator/supports">
          <StatCard
            icon="👨‍🏫"
            label="Support teacherlar"
            value={supportUsers.length}
            color="#3d5eff"
            delay={0}
          />
        </Link>
        <Link to="/curator/logs" className="w-full">
          <StatCard
            icon="🎓"
            label="Jami yozuvlar"
            value={records.length}
            color="#059669"
            delay={60}
          />
        </Link>
        <Link to="/dashboard/logs">
          <StatCard
            icon="📅"
            label="Bugungi yozuvlar"
            value={<AnimatedCounter value={todayRecs.length} />}
            color="#d97706"
            delay={120}
          />
        </Link>
        <Link to={groupsPath} className="w-full">
          <StatCard
            icon="👥"
            label="Guruhlar"
            value={allGroups.length}
            color="#7c3aed"
            delay={180}
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Support teachers list */}
        <div className="lg:col-span-1">
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 gap-2 sm:gap-0">
              <h2
                className="font-display font-bold text-base sm:text-lg"
                style={{ color: "var(--text-1)" }}
              >
                👨‍🏫 Support Teacherlar
              </h2>
              <Badge variant="blue">{supportUsers.length} ta</Badge>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {supportUsers.length === 0 ? (
                <Skeleton className="h-16" />
              ) : (
                supportUsers.map((s) => {
                  const sRecs = records.filter((r) => r.supportId === s.id);
                  const today = sRecs.filter((r) => r.date === todayStr).length;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 p-3 rounded-xl transition-fast hover:bg-gray-50 animate-fade-in"
                    >
                      <Avatar initials={s.avatar} color={s.color} size={40} />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm sm:text-base font-semibold truncate"
                          style={{ color: "var(--text-1)" }}
                        >
                          {s.name}
                        </p>
                        <p
                          className="text-xs sm:text-sm"
                          style={{ color: "var(--text-3)" }}
                        >
                          Jami: {sRecs.length} · Bugun: {today}
                        </p>
                      </div>
                      {today > 0 && <div className="notif-dot" />}
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Recent records */}
        <div className="lg:col-span-2">
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 gap-2 sm:gap-0">
              <h2
                className="font-display font-bold text-base sm:text-lg"
                style={{ color: "var(--text-1)" }}
              >
                📋 Oxirgi yozuvlar
              </h2>
              <Badge variant="gray">{records.length} jami</Badge>
            </div>

            {loadingRec ? (
              <div className="space-y-2 sm:space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : records.length === 0 ? (
              <p
                className="text-sm sm:text-base text-center py-6 sm:py-8"
                style={{ color: "var(--text-3)" }}
              >
                Hali yozuv yo'q
              </p>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {records.slice(0, 8).map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-fast animate-fade-in border border-gray-200"
                  >
                    <Avatar
                      initials={(r.supportName || "User")
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                      color="#3d5eff"
                      size={36}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className="text-sm sm:text-base font-semibold"
                          style={{ color: "var(--text-1)" }}
                        >
                          {r.student}
                        </p>
                        <Badge variant="blue">{r.group}</Badge>
                      </div>
                      <p
                        className="text-xs sm:text-sm"
                        style={{ color: "var(--text-3)" }}
                      >
                        {(r.supportName || "User").split(" ")[0]} · {r.theme} ·{" "}
                        {r.date}
                      </p>
                    </div>
                    <Badge
                      variant={r.status === "coworking" ? "blue" : "green"}
                    >
                      {statusLabel(r.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
