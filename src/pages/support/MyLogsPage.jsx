import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { PageHeader, Card, Modal, Badge } from "../../components/ui";
import RecordsTable from "../../components/tables/RecordsTable";
import StudentForm from "../../components/forms/StudentForm";
import toast from "react-hot-toast";
import { todayString } from "../../utils/helpers";

export default function MyLogsPage() {
  const { user } = useAuth();
  const { records, loadingRec, updateRecord, deleteRecord } = useData();
  const location = useLocation();

  const [editRec, setEditRec] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFilter, setDate] = useState("");

  const myRecords = records.filter((r) => r.supportId === user?.id);

  // Support deep-link edit from dashboard
  useEffect(() => {
    if (location.state?.editId) {
      const rec = myRecords.find((r) => r.id === location.state.editId);
      if (rec) setEditRec(rec);
    }
  }, [location.state]);

  const filtered = myRecords.filter((r) => {
    if (dateFilter && r.date !== dateFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !`${r.student}${r.mentor}${r.theme}${r.group}`.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  async function handleUpdate(data) {
    setUpdating(true);
    try {
      await updateRecord(editRec.id, data);
      toast.success("✅ Yozuv yangilandi!");
      setEditRec(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  }

  const todayStr = todayString();
  const todayCount = myRecords.filter((r) => r.date === todayStr).length;

  return (
    <div>
      <PageHeader
        title="Mening yozuvlarim"
        subtitle={`Jami ${myRecords.length} ta yozuv · Bugun ${todayCount} ta`}
      />

      {/* Filters */}
      <Card className="mb-5 animate-fade-up" padding="p-4">
        <div className="flex gap-3 flex-wrap items-center">
          <input
            className="input-field flex-1 min-w-[200px]"
            placeholder="🔍 O'quvchi, mavzu, guruh..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            className="input-field w-40"
            placeholder="📅 Sana filter"
            value={dateFilter}
            onChange={(e) => setDate(e.target.value)}
            style={{ maxWidth: 160 }}
          />
          {(search || dateFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setDate("");
              }}
              className="text-sm font-medium cursor-pointer transition-fast px-3 py-2 rounded-lg hover:bg-gray-100"
              style={{ color: "var(--text-3)" }}
            >
              ✕ Tozalash
            </button>
          )}
          <Badge variant="gray">{filtered.length} natija</Badge>
        </div>
      </Card>

      <Card padding="">
        <RecordsTable
          records={filtered}
          loading={loadingRec}
          onEdit={(r) => setEditRec(r)}
          onDelete={deleteRecord}
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        open={!!editRec}
        onClose={() => setEditRec(null)}
        title="Yozuvni tahrirlash"
        width="max-w-xl"
      >
        {editRec && (
          <StudentForm
            initial={editRec}
            onSubmit={handleUpdate}
            onCancel={() => setEditRec(null)}
            loading={updating}
          />
        )}
      </Modal>
    </div>
  );
}
