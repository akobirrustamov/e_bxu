import React, { useEffect, useState } from "react";
import Card from "../../../components/card";
import ApiCall from "../../../config";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("Sirtqi bo'lim");
  const [isUpdating, setIsUpdating] = useState(false);

  // Обновить группы с сервера
  const handleUpdateGroups = async () => {
    try {
      setIsUpdating(true);
      await getGroupsFromHemis(); // просто инициирует обновление
      await getGroups(); // получает свежие группы
      const newResponse = await ApiCall(`/api/v1/groups/1`, "GET");
      console.log(newResponse.data);
    } catch (error) {
      console.error("Xatolik (yangilash):", error);
      alert("Guruhlar yangilanmadi. Iltimos, qayta urinib ko‘ring.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Получить список групп
  const getGroups = async () => {
    let AllGroups = [];
    let page = 1;
    let hasNextPage = true;
    try {
      const response = await ApiCall(`/api/v1/groups`, "GET");
      console.log("Fetched groups:", response.data);
      setGroups(response.data);
      if (response.data) {
        const items = response.data.items;
        AllGroups = [...AllGroups, ...items];

        hasNextPage = response.data.pagination?.hasNextPage || false;
        page++;
      } else {
        console.error("Failed to fetch groups:", response.message);
        hasNextPage = false;
      }
      const uniqueDepartments = [
        ...new Set(AllGroups.map((group) => group.departmentName)),
      ];
      setDepartments(uniqueDepartments);

      const storedDepartment = localStorage.getItem("selectedDepartment");
      if (storedDepartment) {
        setSelectedDepartment(storedDepartment);
      } else {
        setSelectedDepartment(uniqueDepartments[0]);
      }
    } catch (error) {
      console.error("Xatolik (guruhlar):", error);
    }
  };

  // Отправить запрос на обновление (не возвращает группы)
  const getGroupsFromHemis = async () => {
    try {
      const response = await ApiCall(`/api/v1/groups/update`, "GET");
      console.log("update", response);
    } catch (error) {
      console.error("Xatolik (yangilash):", error);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  // Фильтрация по названию группы
  const filteredGroups = groups.filter((group) =>
    group?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">
        Guruhlar ro'yxati
      </h1>
      <div className="mt-4 flex items-center justify-center gap-6">
        <h4 className="flex items-center gap-2 font-medium text-gray-700">
          {/* Jami bo'limlar */}
          Jami bo'limlar:{" "}
          <span className="ml-1 font-semibold text-blue-600">
            {departments.length}ta
          </span>
        </h4>
        <h4 className="flex items-center gap-2 font-medium text-gray-700">
          {/* Jami guruhlar */}
          Jami guruhlar:{" "}
          <span className="ml-1 font-semibold text-blue-600">
            {groups.length}ta
          </span>
        </h4>
      </div>
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        {departments.map((dept, index) => (
          <button
            key={index}
            className={`rounded-lg px-6 py-2 transition-all duration-200 hover:scale-105 ${
              selectedDepartment === dept
                ? "bg-blue-600 text-white"
                : "text-black bg-gray-200"
            }`}
            onClick={() => {
              setSelectedDepartment(dept);
              localStorage.setItem("selectedDepartment", dept);
            }}
          >
            {dept}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
        {/* Левая часть: кнопка обновления */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleUpdateGroups}
            disabled={isUpdating}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 text-white disabled:opacity-50"
          >
            {isUpdating ? (
              <>
                <span className="animate-spin">🌝</span> Yangilanmoqda...
              </>
            ) : (
              <>🔄 Yangilash</>
            )}
          </button>
        </div>

        {/* Поиск */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="🔍 Guruh qidiruvi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Карточки групп */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <Card key={group.id} extra="p-4 shadow-md rounded-xl bg-white">
              <h2 className="text-lg font-bold text-gray-800">{group?.name}</h2>
              <p className="text-gray-600">
                <b>Dekanat:</b> {group?.departmentName || "Noma'lum"}
              </p>
              <p className="text-gray-600">
                <b>Yo‘nalish:</b> {group?.specialtyName || "Noma'lum"}
              </p>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Guruhlar topilmadi.
          </p>
        )}
      </div>

      {/* Итоговое количество */}
      <div className="mt-6 text-center">
        <p className="text-xl text-gray-700">
          Topilgan guruhlar:{" "}
          <span className="font-bold text-blue-600">
            {filteredGroups.length} ta
          </span>
        </p>
      </div>
    </div>
  );
}

export default Groups;
