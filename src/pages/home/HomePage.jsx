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

export default function HomePage() {
  const { user } = useAuth();
  const { records, supportUsers, loadingRec } = useData();

  const todayStr = todayString();
  const todayRecs = records.filter((r) => r.date === todayStr);
  const allGroups = [...new Set(records.map((r) => r.group))];

  return (
    <div>
      <PageHeader
        title={`Salom, ${user?.name?.split(" ")[0]}! 👋`}
        subtitle={`Bugun ${new Date().toLocaleDateString("uz-UZ", { weekday: "long", day: "numeric", month: "long" })} — barcha faollik`}
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon="👨‍🏫"
          label="Support teacherlar"
          value={supportUsers.length}
          color="#3d5eff"
          delay={0}
        />
        <StatCard
          icon="🎓"
          label="Jami yozuvlar"
          value={records.length}
          color="#059669"
          delay={60}
        />
        <StatCard
          icon="📅"
          label="Bugungi yozuvlar"
          value={todayRecs.length}
          color="#d97706"
          delay={120}
        />
        <StatCard
          icon="👥"
          label="Guruhlar"
          value={allGroups.length}
          color="#7c3aed"
          delay={180}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support teachers list */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h2
                className="font-display font-bold text-base"
                style={{ color: "var(--text-1)" }}
              >
                👨‍🏫 Support Teacherlar
              </h2>
              <Badge variant="blue">{supportUsers.length} ta</Badge>
            </div>
            <div className="space-y-3">
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
                          className="text-sm font-semibold truncate"
                          style={{ color: "var(--text-1)" }}
                        >
                          {s.name}
                        </p>
                        <p
                          className="text-xs"
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
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h2
                className="font-display font-bold text-base"
                style={{ color: "var(--text-1)" }}
              >
                📋 Oxirgi yozuvlar
              </h2>
              <Badge variant="gray">{records.length} jami</Badge>
            </div>

            {loadingRec ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : records.length === 0 ? (
              <p
                className="text-sm text-center py-8"
                style={{ color: "var(--text-3)" }}
              >
                Hali yozuv yo'q
              </p>
            ) : (
              <div className="space-y-2">
                {records.slice(0, 8).map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-fast animate-fade-in"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    <Avatar
                      initials={r.supportName
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                      color="#3d5eff"
                      size={36}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--text-1)" }}
                        >
                          {r.student}
                        </p>
                        <Badge variant="blue">{r.group}</Badge>
                      </div>
                      <p className="text-xs" style={{ color: "var(--text-3)" }}>
                        {r.supportName.split(" ")[0]} · {r.theme} · {r.date}
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
