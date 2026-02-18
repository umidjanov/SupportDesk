import { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import { PageHeader, Card, Badge, Select } from "../../components/ui";
import RecordsTable from "../../components/tables/RecordsTable";
import { apiGetRecords } from "../../api/mockApi";
import { GROUPS } from "../../api/mockApi";

export default function CuratorLogsPage() {
  const { supportUsers } = useData();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSupport, setFilterSupport] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await apiGetRecords({
        supportId: filterSupport || undefined,
        date: filterDate || undefined,
        group: filterGroup || undefined,
        search: search || undefined,
      });
      setRecords(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filterSupport, filterDate, filterGroup, search]);

  const hasFilter = filterSupport || filterDate || filterGroup || search;

  return (
    <div>
      <PageHeader
        title="Barcha Yozuvlar"
        subtitle="Barcha support teacherlarning yozuvlari — filterlash imkoniyati bilan"
      />

      {/* Filter bar */}
      <Card className="mb-5 animate-fade-up" padding="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-wider block mb-1.5"
              style={{ color: "var(--text-3)" }}
            >
              👨‍🏫 Support
            </label>
            <select
              className="input-field"
              value={filterSupport}
              onChange={(e) => setFilterSupport(e.target.value)}
            >
              <option value="">Barchasi</option>
              {supportUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="text-xs font-semibold uppercase tracking-wider block mb-1.5"
              style={{ color: "var(--text-3)" }}
            >
              📅 Sana
            </label>
            <input
              className="input-field"
              placeholder="19.02.2026"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          <div>
            <label
              className="text-xs font-semibold uppercase tracking-wider block mb-1.5"
              style={{ color: "var(--text-3)" }}
            >
              👥 Guruh
            </label>
            <select
              className="input-field"
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
            >
              <option value="">Barchasi</option>
              {GROUPS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="text-xs font-semibold uppercase tracking-wider block mb-1.5"
              style={{ color: "var(--text-3)" }}
            >
              🔍 Qidiruv
            </label>
            <input
              className="input-field"
              placeholder="O'quvchi, mavzu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {hasFilter && (
          <div
            className="flex items-center gap-3 mt-4 pt-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <p className="text-xs" style={{ color: "var(--text-3)" }}>
              Faol filtrlar:
            </p>
            {filterSupport && (
              <Badge variant="blue">
                {
                  supportUsers
                    .find((u) => u.id === filterSupport)
                    ?.name?.split(" ")[0]
                }
              </Badge>
            )}
            {filterDate && <Badge variant="amber">📅 {filterDate}</Badge>}
            {filterGroup && <Badge variant="cyan">{filterGroup}</Badge>}
            {search && <Badge variant="gray">"{search}"</Badge>}
            <button
              onClick={() => {
                setFilterSupport("");
                setFilterDate("");
                setFilterGroup("");
                setSearch("");
              }}
              className="text-xs font-medium cursor-pointer ml-auto transition-fast px-3 py-1.5 rounded-lg hover:bg-gray-100"
              style={{ color: "var(--text-3)" }}
            >
              ✕ Tozalash
            </button>
            <Badge variant="gray">{records.length} natija</Badge>
          </div>
        )}
      </Card>

      <Card padding="">
        <RecordsTable records={records} loading={loading} showSupport />
      </Card>
    </div>
  );
}
