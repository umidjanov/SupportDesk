import { useEffect } from "react";
import { useData } from "../../context/DataContext";
import {
  PageHeader,
  Card,
  Avatar,
  Badge,
  Button,
  EmptyState,
} from "../../components/ui";
import { timeAgo } from "../../utils/helpers";

export default function NotificationsPage() {
  const { notifs, loadingNotif, markAllSeen, unseenCount, fetchNotifs } =
    useData();

  useEffect(() => {
    fetchNotifs();
  }, []);

  async function handleMarkAll() {
    await markAllSeen();
  }

  const newNotifs = notifs.filter((n) => !n.seen);
  const seenNotifs = notifs.filter((n) => n.seen);

  return (
    <div>
      <PageHeader
        title="Bildirishnomalar"
        subtitle={
          unseenCount > 0
            ? `${unseenCount} ta yangi bildirishnoma`
            : "Barcha ko'rilgan"
        }
        action={
          unseenCount > 0 && (
            <Button variant="ghost" onClick={handleMarkAll} size="sm">
              ✓ Barchasini ko'rilgan deb belgilash
            </Button>
          )
        }
      />

      {loadingNotif ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="card p-5 animate-pulse"
              style={{ height: 80 }}
            />
          ))}
        </div>
      ) : notifs.length === 0 ? (
        <Card>
          <EmptyState
            icon="🔕"
            title="Hali bildirishnoma yo'q"
            desc="Support teacherlar yozuv qo'shganda bu yerda ko'rinadi."
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {/* New */}
          {newNotifs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--text-3)" }}
                >
                  Yangi
                </p>
                <Badge variant="red">{newNotifs.length}</Badge>
              </div>
              <div className="space-y-2">
                {newNotifs.map((n) => (
                  <NotifCard key={n.id} notif={n} isNew />
                ))}
              </div>
            </div>
          )}

          {/* Seen */}
          {seenNotifs.length > 0 && (
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wider mb-3"
                style={{ color: "var(--text-3)" }}
              >
                Ko'rilgan
              </p>
              <div className="space-y-2">
                {seenNotifs.map((n) => (
                  <NotifCard key={n.id} notif={n} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotifCard({ notif: n, isNew = false }) {
  return (
    <div
      className="card p-5 flex items-start gap-4 animate-fade-in"
      style={{
        background: isNew ? "rgba(61,94,255,.03)" : "var(--surface)",
        borderColor: isNew ? "rgba(61,94,255,.2)" : "var(--border)",
      }}
    >
      <Avatar
        initials={n.supportName
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)}
        color="#3d5eff"
        size={44}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p
            className="font-semibold text-sm"
            style={{ color: "var(--text-1)" }}
          >
            {n.supportName}
          </p>
          <p className="text-sm" style={{ color: "var(--text-3)" }}>
            yangi yozuv qo'shdi
          </p>
          {isNew && <div className="notif-dot" />}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="blue">{n.group}</Badge>
          <span
            className="text-xs px-2.5 py-1 rounded-lg font-medium"
            style={{ background: "var(--bg-2)", color: "var(--text-2)" }}
          >
            {n.student}
          </span>
          <span
            className="text-xs px-2.5 py-1 rounded-lg font-medium"
            style={{ background: "var(--bg-2)", color: "var(--text-2)" }}
          >
            📚 {n.theme}
          </span>
        </div>
      </div>
      <p
        className="text-xs whitespace-nowrap shrink-0"
        style={{ color: "var(--text-3)" }}
      >
        {timeAgo(n.createdAt)}
      </p>
    </div>
  );
}
