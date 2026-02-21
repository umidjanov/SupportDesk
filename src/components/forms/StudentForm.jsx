import { useState, useEffect, useMemo } from "react";
import { MENTORS, GROUPS, STATUSES, THEMES } from "../../api/mockApi";
import { todayString, nowTimeString } from "../../utils/helpers";
import { Input, Button } from "../ui";

const EMPTY_FORM = {
  date: "",
  time: "",
  group: "",
  mentor: "",
  student: "",
  theme: "",
  status: "",
};

function validate(form) {
  const errors = {};
  if (!form.date.trim()) errors.date = "Sanani kiriting";
  if (!form.time.trim()) errors.time = "Vaqtni kiriting";
  if (!form.group) errors.group = "Guruhni tanlang";
  if (!form.mentor) errors.mentor = "Mentorni tanlang";
  if (!form.student.trim()) errors.student = "O'quvchi ismini kiriting";
  if (!form.theme) errors.theme = "Mavzuni tanlang";
  if (!form.status) errors.status = "Statusni tanlang";
  return errors;
}

export default function StudentForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const [showGroupList, setShowGroupList] = useState(false);
  const [showMentorList, setShowMentorList] = useState(false);
  const [showThemeList, setShowThemeList] = useState(false);

  useEffect(() => {
    if (initial) setForm(initial);
    else setForm({ ...EMPTY_FORM, date: todayString(), time: nowTimeString() });
  }, [initial]);

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  }

  // 🔥 Filter functions
  const filteredGroups = useMemo(() => {
    return GROUPS.filter((g) =>
      g.toLowerCase().includes(form.group.toLowerCase()),
    );
  }, [form.group]);

  const filteredMentors = useMemo(() => {
    return MENTORS.filter((m) =>
      m.toLowerCase().includes(form.mentor.toLowerCase()),
    );
  }, [form.mentor]);

  const filteredThemes = useMemo(() => {
    return THEMES.filter((t) =>
      t.toLowerCase().includes(form.theme.toLowerCase()),
    );
  }, [form.theme]);

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    await onSubmit({ ...form, student: form.student.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          label="📅 Sana"
          value={form.date}
          onChange={(e) => setField("date", e.target.value)}
          error={errors.date}
        />
        <Input
          label="⏰ Vaqt"
          type="time"
          value={form.time}
          onChange={(e) => setField("time", e.target.value)}
          error={errors.time}
        />
      </div>

      {/* GROUP & MENTOR */}
      <div className="grid grid-cols-2 gap-4">
        {/* GROUP */}
        <div className="relative">
          <Input
            placeholder="Guruh raqami"
            label="👥 Guruh"
            value={form.group}
            onChange={(e) => {
              setField("group", e.target.value);
              setShowGroupList(true);
            }}
            onFocus={() => setShowGroupList(true)}
            error={errors.group}
          />
          {showGroupList && filteredGroups.length > 0 && (
            <div className="absolute z-20 w-full bg-white border rounded-xl shadow-lg max-h-40 overflow-y-auto">
              {filteredGroups.map((g) => (
                <div
                  key={g}
                  onClick={() => {
                    setField("group", g);
                    setShowGroupList(false);
                  }}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  {g}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MENTOR */}
        <div className="relative">
          <Input
            placeholder="Mentor ismi"
            label="👩‍🏫 Mentor"
            value={form.mentor}
            onChange={(e) => {
              setField("mentor", e.target.value);
              setShowMentorList(true);
            }}
            onFocus={() => setShowMentorList(true)}
            error={errors.mentor}
          />
          {showMentorList && filteredMentors.length > 0 && (
            <div className="absolute z-20 w-full bg-white border rounded-xl shadow-lg max-h-40 overflow-y-auto">
              {filteredMentors.map((m) => (
                <div
                  key={m}
                  onClick={() => {
                    setField("mentor", m);
                    setShowMentorList(false);
                  }}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* STUDENT */}
      <Input
        placeholder="O'quvchining ism familiyasi"
        label="🎓 O'quvchi ismi familiyasi"
        value={form.student}
        onChange={(e) => setField("student", e.target.value)}
        error={errors.student}
      />

      {/* 🔥 THEME AUTOCOMPLETE */}
      <div className="relative">
        <Input
          placeholder="Mavzuni tanlang"
          label="📚 Mavzu (Theme)"
          value={form.theme}
          onChange={(e) => {
            setField("theme", e.target.value);
            setShowThemeList(true);
          }}
          onFocus={() => setShowThemeList(true)}
          error={errors.theme}
        />
        {showThemeList && filteredThemes.length > 0 && (
          <div className="absolute z-20 w-full bg-white border rounded-xl shadow-lg max-h-40 overflow-y-auto">
            {filteredThemes.map((t) => (
              <div
                key={t}
                onClick={() => {
                  setField("theme", t);
                  setShowThemeList(false);
                }}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {t}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STATUS */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider block mb-2">
          📍 Status
        </label>
        <div className="flex gap-3">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setField("status", s)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 ${
                form.status === s
                  ? "bg-blue-50 border-blue-500 text-blue-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {s === "coworking" ? "🏢 Coworking" : "👥 Group"}
            </button>
          ))}
        </div>
        {errors.status && (
          <p className="text-xs text-red-500 mt-1">{errors.status}</p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading} className="flex-1">
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
