import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { PageHeader, StatCard, Card, Button } from "../../components/ui";
import RecordsTable from "../../components/tables/RecordsTable";
import { todayString } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

export default function SupportDashboard() {
  const { user } = useAuth();
  const { records, loadingRec, deleteRecord } = useData();
  const navigate = useNavigate();

  const todayStr = todayString();
  const myRecords = records.filter((r) => r.supportId === user?.id);
  const todayRecs = myRecords.filter((r) => r.date === todayStr);
  const weekRecs = myRecords.filter((r) => {
    const [d, m, y] = r.date.split(".").map(Number);
    const diff = (Date.now() - new Date(y, m - 1, d)) / 86400000;
    return diff >= 0 && diff < 7;
  });

  return (
    <div>
      <PageHeader
        title="Mening Dashboardim"
        subtitle={`${user?.name} — bugun ${new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "long" })}`}
        action={
          <Button variant="primary" onClick={() => navigate("/dashboard/add")}>
            ＋ Yangi yozuv
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon="📋"
          label="Jami yozuvlar"
          value={myRecords.length}
          color="#3d5eff"
          delay={0}
        />
        <StatCard
          icon="📅"
          label="Bugun"
          value={todayRecs.length}
          color="#059669"
          delay={60}
        />
        <StatCard
          icon="📆"
          label="Bu hafta"
          value={weekRecs.length}
          color="#d97706"
          delay={120}
        />
        <StatCard
          icon="🏆"
          label="Eng ko'p mavzu"
          value={
            myRecords.length
              ? (() => {
                  const t = {};
                  myRecords.forEach(
                    (r) => (t[r.theme] = (t[r.theme] || 0) + 1),
                  );
                  return (
                    Object.entries(t)
                      .sort((a, b) => b[1] - a[1])[0]?.[0]
                      ?.split(" ")?.[0] || "—"
                  );
                })()
              : "—"
          }
          color="#7c3aed"
          delay={180}
        />
      </div>

      {/* Quick add CTA */}
      {todayRecs.length === 0 && (
        <Card className="mb-6 animate-fade-up" padding="p-5">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: "rgba(61,94,255,.08)" }}
            >
              💡
            </div>
            <div className="flex-1">
              <p className="font-semibold" style={{ color: "var(--text-1)" }}>
                Bugun hali yozuv yo'q!
              </p>
              <p className="text-sm" style={{ color: "var(--text-3)" }}>
                Yordam bergan o'quvchingizni hoziroq kiriting.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/dashboard/add")}
            >
              Qo'shish →
            </Button>
          </div>
        </Card>
      )}

      {/* Recent records */}
      <Card padding="">
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2
            className="font-display font-bold text-base"
            style={{ color: "var(--text-1)" }}
          >
            Mening yozuvlarim
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/logs")}
          >
            Barchasini ko'rish →
          </Button>
        </div>
        <RecordsTable
          records={myRecords.slice(0, 5)}
          loading={loadingRec}
          onEdit={(r) =>
            navigate("/dashboard/logs", { state: { editId: r.id } })
          }
          onDelete={deleteRecord}
        />
      </Card>
    </div>
  );
}
