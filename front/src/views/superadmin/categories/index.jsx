import React, { useEffect, useState } from "react";
import Card from "../../../components/card";
import ApiCall from "../../../config";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { useNavigate } from "react-router-dom";
// import Categories from "views/rector/categories";

function Categories() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("Sirtqi bo'lim");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // loading state

  // Обновить группы с сервера
  const handleUpdateGroups = async () => {
    try {
      setIsUpdating(true);
      await getGroupsFromHemis(); // просто инициирует обновление
      await getGroups(); // получает свежие группы
      // const newResponse = await ApiCall(`/api/v1/groups/1`, "GET");
      // console.log(newResponse.data);
    } catch (error) {
      console.error("Xatolik (yangilash):", error);
      alert(
        "O'quv rejalar ro'yxati yangilanmadi. Iltimos, qayta urinib ko‘ring."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Получить список групп
  const getGroups = async () => {
    try {
      setIsLoading(true);
      const response = await ApiCall(`/api/v1/curriculum`, "GET");
      const allGroups = response.data || [];
      console.log("categories", allGroups);

      setGroups(allGroups);

      const uniqueDepartments = [
        ...new Set(allGroups.map((group) => group.departmentName)),
      ];
      setDepartments(uniqueDepartments);

      const storedDepartment = localStorage.getItem("selectedDepartment");
      if (storedDepartment && uniqueDepartments.includes(storedDepartment)) {
        setSelectedDepartment(storedDepartment);
      } else {
        setSelectedDepartment(uniqueDepartments[0]);
      }
    } catch (error) {
      console.error("Xatolik (O'quv rejalar ro'yxati):", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Отправить запрос на обновление (не возвращает группы)
  const getGroupsFromHemis = async () => {
    try {
      const response = await ApiCall(`/api/v1/curriculum/update`, "GET");
      console.log("update", response);
    } catch (error) {
      console.error("Xatolik (yangilash):", error);
    }
  };

  useEffect(() => {
    getGroups();
    // getGroupsFromHemis();
  }, []);

  // Фильтрация по названию группы
  // Фильтрация по названию группы и выбранному отделу

  const filteredGroups = Array.isArray(groups)
    ? groups
        .filter((groups) => groups?.structureType === selectedDepartment)
        .filter((groups) =>
          groups?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-center text-4xl font-bold text-blue-700">
          O'quv rejalar ro'yxati ro'yxati
        </h1>

        {/* Stats Section */}
        <div className="p-2">
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
            <div className="flex items-center gap-2 rounded-lg px-6 py-3">
              <span className="font-medium text-gray-700">Jami bo'limlar:</span>
              <span className="text-xl font-semibold text-blue-600">
                {departments.length} ta
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg px-6 py-3">
              <span className="font-medium text-gray-700">
                Jami O'quv rejalar ro'yxati:
              </span>
              <span className="text-xl font-semibold text-blue-600">
                {groups.length} ta
              </span>
            </div>
          </div>
        </div>
        <hr />
        {/* Department Filters */}
        <div className="p-4">
          <h2 className="mb-4 text-center text-lg font-semibold text-gray-700">
            Bo'limlar bo'yicha filtrlash
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {departments.map((dept, index) => (
              <button
                key={index}
                className={`rounded-lg px-6 py-2 transition-all duration-200 hover:shadow-md ${
                  selectedDepartment === dept
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
        </div>

        {/* Actions Section */}
        <div className="py-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Search Input */}
            <div className="relative w-full md:w-1/3">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="O'quv rejalar ro'yxati qidiruvi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 pr-12 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
            {/* Update Button */}
            <button
              onClick={handleUpdateGroups}
              disabled={isUpdating}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-all ${
                isUpdating
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-green-500 to-green-600 shadow-md hover:from-green-600 hover:to-green-700 hover:shadow-lg"
              }`}
            >
              {isUpdating ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Yangilanmoqda...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  O'quv rejalar ro'yxatini yangilash
                </>
              )}
            </button>
          </div>
        </div>

        {/* Groups Cards */}
        <div className="mb-8">
          {isLoading ? (
            // 👇 Yuklanayotgan payt
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="h-10 w-10 animate-spin text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p className="mt-4 text-sm text-gray-500">
                O'quv rejalar ro'yxati yuklanmoqda...
              </p>
            </div>
          ) : filteredGroups.length > 0 ? (
            // 👇 Ma'lumotlar mavjud
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className="group relative transform cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="p-6">
                    <h2 className="mb-2 text-xl font-bold text-gray-800 transition-colors group-hover:text-white">
                      {group?.name}
                    </h2>
                    <p className="text-gray-600 transition-colors group-hover:text-blue-100">
                      <b>{group?.specialtyName || "Noma'lum"}</b>
                    </p>
                  </div>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>
              ))}
            </div>
          ) : (
            // 👇 Ma'lumotlar topilmadi
            <div className="rounded-xl bg-white py-12 text-center shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                O'quv rejalar ro'yxati topilmadi!
              </h3>
              <p className="mx-auto mt-1 max-w-md text-gray-500">
                {searchTerm || selectedDepartment !== "Sirtqi bo'lim"
                  ? "Qidiruvga mos yoki tanlangan bo'limdagi O'quv rejalar ro'yxati mavjud emas"
                  : "Hozircha hech qanday o'quv rejasi mavjud emas. Yangilash tugmasini bosib sinab ko‘ring."}
              </p>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="p-4 text-center">
          <p className="text-lg text-gray-700">
            Topilgan o'quv rejalar ro'yxati:{" "}
            <span className="text-2xl font-bold text-blue-600">
              {filteredGroups.length} ta
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Categories;
