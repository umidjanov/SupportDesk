import { useState, useMemo } from "react";
import { GROUPS, MENTORS } from "../../api/mockApi";
import { Card, Badge, Button } from "../../components/ui";
import { motion } from "framer-motion";

export const SupportGroups = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Yo‘nalishni aniqlash
  const getDirection = (group) => {
    if (group.startsWith("GW"))
      return { label: "Web Dasturlash", color: "blue" };
    if (group.startsWith("GR"))
      return { label: "Robototexnika", color: "green" };
    if (group.startsWith("D")) return { label: "Design", color: "yellow" };
    return { label: "Unknown", color: "gray" };
  };

  // Mentor biriktirish
  const groupsWithMentor = GROUPS.map((group, index) => ({
    group,
    mentor: MENTORS[index % MENTORS.length],
    direction: getDirection(group),
  }));

  // Search filter
  const filteredGroups = useMemo(() => {
    return groupsWithMentor.filter(
      (item) =>
        item.group.toLowerCase().includes(search.toLowerCase()) ||
        item.mentor.toLowerCase().includes(search.toLowerCase()) ||
        item.direction.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  // Pagination
  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);
  const paginatedGroups = filteredGroups.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Title + Counter */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0"
      >
        <h1 className="text-xl sm:text-2xl font-bold">👥 Barcha Guruhlar</h1>
        <span className="text-gray-600 font-medium text-sm sm:text-base">
          Jami {filteredGroups.length} ta guruh topildi
        </span>
      </motion.div>

      {/* Search */}
      <motion.input
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        type="text"
        placeholder="Guruh, mentor yoki yo‘nalish qidiring..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full sm:w-3/4 md:w-1/2 mb-6 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
      />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {paginatedGroups.map((item, index) => (
          <motion.div
            key={item.group}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Card className="p-4 sm:p-6 rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-semibold">
                  {item.group}
                </h2>
                <Badge
                  className={`${
                    item.direction.label === "Design"
                      ? "bg-yellow-400 text-black"
                      : item.direction.label === "Web Dasturlash"
                        ? "bg-blue-500 text-white"
                        : item.direction.label === "Robototexnika"
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-white"
                  } px-3 py-1 rounded-full text-xs sm:text-sm`}
                >
                  {item.direction.label}
                </Badge>
              </div>
              <p className="text-sm sm:text-base text-gray-500">
                👨‍🏫 Mentor:{" "}
                <span className="ml-1 font-medium text-gray-700">
                  {item.mentor}
                </span>
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* No results */}
      {filteredGroups.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-sm sm:text-base">
          Hech narsa topilmadi
        </p>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 sm:gap-4 mt-6 flex-wrap">
          <Button
            onClick={handlePrev}
            disabled={page === 1}
            className="text-sm sm:text-base"
          >
            ⬅ Oldingi
          </Button>
          <span className="font-medium text-gray-700 text-sm sm:text-base">
            {page} / {totalPages}
          </span>
          <Button
            onClick={handleNext}
            disabled={page === totalPages}
            className="text-sm sm:text-base"
          >
            Keyingi ➡
          </Button>
        </div>
      )}
    </div>
  );
};
