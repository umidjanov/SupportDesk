import { useState } from "react";
import { Badge, Button, EmptyState, ConfirmDialog, Skeleton } from "../ui";
import { Avatar } from "../ui";
import { statusLabel, timeAgo } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";

export default function RecordsTable({
  records,
  loading,
  onEdit,
  onDelete,
  showSupport = false,
  deleting = null,
}) {
  const { user } = useAuth();
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete() {
    setDeletingId(confirmId);
    try {
      await onDelete(confirmId);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    );
  }

  if (!records.length) {
    return (
      <EmptyState
        icon="📋"
        title="Hali yozuv yo'q"
        desc="Birinchi o'quvchi yozuvingizni qo'shing!"
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {showSupport && <th>Support</th>}
              <th>📅 Sana / ⏰ Vaqt</th>
              <th>👥 Guruh</th>
              <th>👩‍🏫 Mentor</th>
              <th>🎓 O'quvchi</th>
              <th>📚 Mavzu</th>
              <th>📍 Status</th>
              <th>⏱ Vaqt</th>
              {(onEdit || onDelete) && <th>Amallar</th>}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => {
              const isOwn = r.supportId === user?.id;
              const canAct = isOwn || user?.role === "curator";

              // 🔒 XAVFSIZ QILDIK
              const supportName = r.supportName || "Noma'lum";
              const mentorName = r.mentor || "Noma'lum";

              const supportInitials = supportName
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2);

              return (
                <tr key={r.id} className="animate-fade-in">
                  {showSupport && (
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar
                          initials={supportInitials}
                          color="#3d5eff"
                          size={28}
                        />
                        <span className="font-medium text-sm whitespace-nowrap">
                          {supportName.split(" ")[0]}
                        </span>
                      </div>
                    </td>
                  )}

                  <td>
                    <div>
                      <p
                        className="font-semibold text-sm font-mono"
                        style={{ color: "var(--text-1)" }}
                      >
                        {r.date}
                      </p>
                      <p
                        className="text-xs font-mono"
                        style={{ color: "var(--text-3)" }}
                      >
                        {r.time}
                      </p>
                    </div>
                  </td>

                  <td>
                    <Badge variant="blue">{r.group}</Badge>
                  </td>

                  <td
                    className="whitespace-nowrap"
                    style={{ color: "var(--text-2)" }}
                  >
                    {mentorName.split(" ")[0]}
                  </td>

                  <td>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "var(--text-1)" }}
                    >
                      {r.student}
                    </p>
                  </td>

                  <td>
                    <span
                      className="text-xs px-2.5 py-1 rounded-lg font-medium"
                      style={{
                        background: "var(--bg-2)",
                        color: "var(--text-2)",
                      }}
                    >
                      {r.theme}
                    </span>
                  </td>

                  <td>
                    <Badge
                      variant={r.status === "coworking" ? "blue" : "green"}
                    >
                      {statusLabel(r.status)}
                    </Badge>
                  </td>

                  <td
                    className="text-xs whitespace-nowrap"
                    style={{ color: "var(--text-3)" }}
                  >
                    {timeAgo(r.createdAt)}
                  </td>

                  {(onEdit || onDelete) && (
                    <td>
                      {isOwn ? (
                        <div className="flex items-center gap-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(r)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-fast cursor-pointer"
                              style={{
                                background: "rgba(61,94,255,.08)",
                                color: "var(--brand)",
                              }}
                            >
                              ✏️ Tahrir
                            </button>
                          )}

                          {onDelete && (
                            <button
                              onClick={() => setConfirmId(r.id)}
                              className="btn btn-danger btn-sm"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      ) : (
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-3)" }}
                        >
                          —
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deletingId === confirmId}
        title="Yozuvni o'chirish"
        message="Bu yozuvni o'chirishni tasdiqlaysizmi? Bu amalni bekor qilib bo'lmaydi."
      />
    </>
  );
}
