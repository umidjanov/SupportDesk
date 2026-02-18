import { useState, useEffect } from "react";
import { MENTORS, GROUPS, STATUSES, THEMES } from "../../api/mockApi";
import { todayString, nowTimeString } from "../../utils/helpers";
import { Input, Select, Button } from "../ui";

const EMPTY_FORM = {
  date:    "",
  time:    "",
  group:   "",
  mentor:  "",
  student: "",
  theme:   "",
  status:  "",
};

function validate(form) {
  const errors = {};
  if (!form.date.trim())    errors.date    = "Sanani kiriting";
  if (!form.time.trim())    errors.time    = "Vaqtni kiriting";
  if (!form.group)          errors.group   = "Guruhni tanlang";
  if (!form.mentor)         errors.mentor  = "Mentorni tanlang";
  if (!form.student.trim()) errors.student = "O'quvchi ismini kiriting";
  if (!form.theme)          errors.theme   = "Mavzuni tanlang";
  if (!form.status)         errors.status  = "Statusni tanlang";
  return errors;
}

export default function StudentForm({ initial, onSubmit, onCancel, loading }) {
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) setForm(initial);
    else setForm({ ...EMPTY_FORM, date: todayString(), time: nowTimeString() });
  }, [initial]);

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await onSubmit({ ...form, student: form.student.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="📅 Sana"
          placeholder="19.02.2026"
          value={form.date}
          onChange={e => set("date", e.target.value)}
          error={errors.date}
          hint="Masalan: 19.02.2026"
        />
        <Input
          label="⏰ Vaqt"
          type="time"
          value={form.time}
          onChange={e => set("time", e.target.value)}
          error={errors.time}
        />
      </div>

      {/* Group & Mentor */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="👥 Guruh"
          options={GROUPS}
          placeholder="— Guruhni tanlang —"
          value={form.group}
          onChange={e => set("group", e.target.value)}
          error={errors.group}
        />
        <Select
          label="👩‍🏫 Mentor"
          options={MENTORS}
          placeholder="— Mentorni tanlang —"
          value={form.mentor}
          onChange={e => set("mentor", e.target.value)}
          error={errors.mentor}
        />
      </div>

      {/* Student */}
      <Input
        label="🎓 O'quvchi ismi familiyasi"
        placeholder="Masalan: Mahliyo Xudoyberdiyeva"
        value={form.student}
        onChange={e => set("student", e.target.value)}
        error={errors.student}
      />

      {/* Theme */}
      <Select
        label="📚 Mavzu (Theme)"
        options={THEMES}
        placeholder="— Mavzuni tanlang —"
        value={form.theme}
        onChange={e => set("theme", e.target.value)}
        error={errors.theme}
      />

      {/* Status */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-3)" }}>
          📍 Status — Qayerda o'tildi?
        </label>
        <div className="flex gap-3">
          {STATUSES.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => set("status", s)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border-2"
              style={{
                background: form.status === s ? (s === "coworking" ? "rgba(61,94,255,.08)" : "rgba(5,150,105,.08)") : "var(--bg-2)",
                borderColor: form.status === s ? (s === "coworking" ? "var(--brand)" : "#059669") : "var(--border)",
                color: form.status === s ? (s === "coworking" ? "var(--brand)" : "#059669") : "var(--text-2)",
              }}
            >
              {s === "coworking" ? "🏢 Coworking" : "👥 Group"}
            </button>
          ))}
        </div>
        {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status}</p>}
      </div>

      {/* Preview */}
      {form.student && form.group && form.mentor && (
        <div
          className="rounded-xl p-4 animate-fade-in"
          style={{ background: "var(--bg-2)", border: "1px solid var(--border-2)" }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--brand)" }}>
            Ko'rib chiqish
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs" style={{ color: "var(--text-2)" }}>
            <div><span style={{ color: "var(--text-3)" }}>Sana:</span><br /><strong>{form.date} {form.time}</strong></div>
            <div><span style={{ color: "var(--text-3)" }}>Guruh:</span><br /><strong>{form.group}</strong></div>
            <div><span style={{ color: "var(--text-3)" }}>Status:</span><br /><strong>{form.status}</strong></div>
            <div className="col-span-2"><span style={{ color: "var(--text-3)" }}>O'quvchi:</span><br /><strong>{form.student}</strong></div>
            <div><span style={{ color: "var(--text-3)" }}>Mentor:</span><br /><strong>{form.mentor?.split(" ")[0]}</strong></div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" loading={loading} className="flex-1">
          {initial ? "💾 Saqlash" : "✅ Qo'shish"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Bekor
          </Button>
        )}
      </div>
    </form>
  );
}
