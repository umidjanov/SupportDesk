import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input, Button } from "../../components/ui";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showDemo, setShowDemo] = useState(false);
  const [demoUsers, setDemoUsers] = useState([]);

  function validate() {
    const e = {};
    if (!phone.trim()) e.phone = "Telefon raqamini kiriting";
    if (!password.trim()) e.password = "Parolni kiriting";
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      const user = await login(phone, password);
      toast.success(`Xush kelibsiz, ${user.name.split(" ")[0]}! 👋`);
      navigate(user.role === "curator" ? "/curator" : "/dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  }

  function fillDemo(u) {
    setPhone(u.phone);
    setPassword(u.password || ""); // demo password bo'lmasa bo'sh qoldiramiz
    setErrors({});
  }

  useEffect(() => {
    const lastRegistered = localStorage.getItem("lastRegisteredUser");
    if (lastRegistered) {
      setDemoUsers([JSON.parse(lastRegistered)]);
    }
  }, []);

  return (
    <div className="auth-page">
      <div
        className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(61,94,255,.15), transparent)",
        }}
      />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(100,136,255,.12), transparent)",
        }}
      />

      <div className="w-full max-w-md relative z-10 animate-fade-up px-4">
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
            Tizimga kirish
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-3)" }}>
            SupportDesk boshqaruv tizimi
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="📱 Telefon raqam"
              placeholder="90-000-00-00"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErrors((er) => ({ ...er, phone: "" }));
              }}
              error={errors.phone}
            />
            <Input
              label="🔑 Parol"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((er) => ({ ...er, password: "" }));
              }}
              error={errors.password}
            />
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full justify-center"
            >
              Kirish →
            </Button>
          </form>

          <p
            className="text-center text-sm mt-5"
            style={{ color: "var(--text-3)" }}
          >
            Akkauntingiz yo'qmi?{" "}
            <Link
              to="/register"
              className="font-semibold"
              style={{ color: "var(--brand)" }}
            >
              Ro'yxatdan o'ting
            </Link>
          </p>
        </div>

        {/* Demo foydalanuvchi */}
        {demoUsers.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="w-full text-center text-xs cursor-pointer transition-fast py-2 rounded-xl hover:bg-white/50"
              style={{ color: "var(--text-3)" }}
            >
              {showDemo ? "▲ Demo loginni yashirish" : "▼ Demo loginni ko'rish"}
            </button>

            {showDemo && (
              <div className="mt-2 card overflow-hidden animate-fade-up">
                <div className="px-4 py-2.5 border-b bg-gray-100">
                  <p className="text-xs font-semibold uppercase tracking-wider">
                    Oxirgi ro'yxatdan o'tgan foydalanuvchi
                  </p>
                </div>
                {demoUsers.map((u, i) => (
                  <button
                    key={i}
                    onClick={() => fillDemo(u)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer text-left border-b"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: u.color }}
                      >
                        {u.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.phone}</p>
                      </div>
                    </div>
                    <span
                      className="badge"
                      style={{
                        background: "rgba(61,94,255,.1)",
                        color: "var(--brand)",
                      }}
                    >
                      {u.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
