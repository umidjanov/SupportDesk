import { useEffect, useState } from "react";
import { apiGetSupportUsers } from "./../../api/mockApi";
import { Link } from "react-router-dom";

export const CuratorSupports = () => {
  const [supports, setSupports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupports = async () => {
      try {
        const data = await apiGetSupportUsers();
        setSupports(data);
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSupports();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
        Supportlar ro'yxati{" "}
        <span className="text-indigo-600">({supports.length})</span>
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-600">
                #
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">
                Ism Familiya
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">
                Telefon
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">
                Rol
              </th>
            </tr>
          </thead>
          <tbody>
            {supports.map((u, idx) => (
              <tr
                key={u.id}
                className={`border-b transition-all duration-300 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-100 cursor-pointer`}
              >
                <td className="p-3 text-sm text-gray-700">{idx + 1}</td>
                <td className="p-3 text-sm font-medium text-gray-800">
                  <Link to={`/support/${u.id}`} className="hover:underline">
                    {u.name}
                  </Link>
                </td>
                <td className="p-3 text-sm text-gray-700">{u.phone}</td>
                <td className="p-3 text-sm text-gray-700 capitalize">
                  {u.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
