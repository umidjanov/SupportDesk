import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input, Button } from "../../components/ui";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim() || form.name.trim().split(" ").length < 2)
      e.name = "Ism va familiyangizni kiriting";
    if (!form.phone.trim()) e.phone = "Telefon raqamini kiriting";
    if (!form.password || form.password.length < 5)
      e.password = "Parol kamida 5 belgidan iborat bo'lishi kerak";
    if (form.password !== form.confirm) e.confirm = "Parollar mos kelmadi";
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      const user = await register({
        name: form.name.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      toast.success(`Xush kelibsiz, ${user.name.split(" ")[0]}! 🎉`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div
        className="absolute top-20 right-20 w-72 h-72 rounded-full opacity-25 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(61,94,255,.15), transparent)",
        }}
      />

      <div className="w-full max-w-md relative z-10 animate-fade-up px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center font-display font-black text-2xl text-white"
            style={{
              background: "linear-gradient(135deg,#3d5eff,#6488ff)",
              boxShadow: "0 8px 32px rgba(61,94,255,.4)",
            }}
          >
            S
          </div>
          <h1
            className="font-display font-bold text-3xl"
            style={{ color: "var(--text-1)" }}
          >
            Ro'yxatdan o'tish
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-3)" }}>
            Support teacher sifatida qo'shiling
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="👤 Ism familiya"
              placeholder="Aziza Karimova"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              error={errors.name}
              hint="Ism va familiyani kiriting"
            />
            <Input
              label="📱 Telefon raqam"
              placeholder="90-000-00-00"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              error={errors.phone}
              hint="Bu login sifatida ishlatiladi"
            />
            <Input
              label="🔑 Parol"
              type="password"
              placeholder="Kamida 5 belgi"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              error={errors.password}
            />
            <Input
              label="🔑 Parolni tasdiqlang"
              type="password"
              placeholder="Parolni qaytaring"
              value={form.confirm}
              onChange={(e) => set("confirm", e.target.value)}
              error={errors.confirm}
            />

            {/* Role notice */}
            <div
              className="rounded-xl p-3.5 text-xs"
              style={{
                background: "rgba(61,94,255,.06)",
                border: "1px solid rgba(61,94,255,.15)",
              }}
            >
              <p className="font-semibold" style={{ color: "var(--brand)" }}>
                ℹ️ Eslatma
              </p>
              <p className="mt-1" style={{ color: "var(--text-2)" }}>
                Ro'yxatdan o'tgan foydalanuvchilar avtomatik ravishda{" "}
                <strong>Support</strong> roliga ega bo'ladi.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full justify-center"
            >
              Ro'yxatdan o'tish →
            </Button>
          </form>

          <p
            className="text-center text-sm mt-5"
            style={{ color: "var(--text-3)" }}
          >
            Allaqachon akkauntingiz bormi?{" "}
            <Link
              to="/login"
              className="font-semibold"
              style={{ color: "var(--brand)" }}
            >
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
