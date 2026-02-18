import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { PageHeader, Card } from "../../components/ui";
import StudentForm from "../../components/forms/StudentForm";
import toast from "react-hot-toast";

export default function AddRecordPage() {
  const { addRecord } = useData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data) {
    setLoading(true);
    try {
      await addRecord(data);
      toast.success("✅ Yozuv muvaffaqiyatli qo'shildi!");
      navigate("/dashboard/logs");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Yangi yozuv qo'shish"
        subtitle="Yordam bergan o'quvchingiz haqida ma'lumot kiriting"
      />
      <div className="max-w-2xl">
        <Card>
          <StudentForm
            onSubmit={handleSubmit}
            loading={loading}
            onCancel={() => navigate(-1)}
          />
        </Card>
      </div>
    </div>
  );
}
