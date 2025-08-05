import React, { useEffect, useState } from "react";
import Card from "../../../components/card";
import ApiCall from "../../../config";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

function Marketplace() {
  const [groups, setGroups] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const [token, setToken] = useState("");

  // Fetch departments
  const getDepartments = async () => {
    try {
      const response = await ApiCall(`/api/v1/groups/departments`, "GET");
      setDepartments(response.data);
    } catch (error) {
      console.error("Xatolik (yo'nalishlar):", error);
    }
  };

  // Fetch groups
  const getGroups = async () => {
    try {
      const response = await ApiCall(`/api/v1/groups`, "GET");
      console.log("Fetched groups:", response.data);

      setGroups(response.data);
    } catch (error) {
      console.error("Xatolik (guruhlar):", error);
    }
  };
  const getGroupsFromHemis = async () => {
    try {
      const response = await ApiCall(`/api/v1/groups/update`, "GET");
      console.log("Fetched groups from hemis:", response.data);

      setGroups(response.data);
    } catch (error) {
      console.error("Xatolik (guruhlar):", error);
    }
  };

  // Fetch on mount
  useEffect(() => {
    getDepartments();
    getGroups();
    getGroupsFromHemis();
  }, []);
  // Filtering
  const filteredGroups = groups.filter((group) => {
    const matchesDepartment = selectedDepartment
      ? group.department.name === selectedDepartment
      : true;
    const matchesSearch = searchTerm
      ? group.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesDepartment && matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">
        Guruhlar ro'yxati
      </h1>

      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
        {/* Department buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-lg px-4 py-2 ${
              !selectedDepartment
                ? "bg-blue-600 text-white"
                : "text-black bg-gray-200"
            }`}
            onClick={() => setSelectedDepartment("")}
          >
            Barchasi
          </button>
          {departments.map((dept, index) => (
            <button
              key={index}
              className={`rounded-lg px-4 py-2 ${
                selectedDepartment === dept
                  ? "bg-blue-600 text-white"
                  : "text-black bg-gray-200"
              }`}
              onClick={() => setSelectedDepartment(dept)}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Search */}
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

        {/* Token Modal Button */}
        <button
          onClick={() => setShow(true)}
          className="rounded-lg bg-blue-500 px-6 py-2 text-white"
        >
          Token orqali guruhlar
        </button>
      </div>

      {/* Group Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <Card key={group.id} extra="p-4 shadow-md rounded-xl bg-white">
              <h2 className="text-lg font-bold text-gray-800">{group.name}</h2>
              <p className="text-gray-600">Dekanat: {group.department.name}</p>
              <p className="text-gray-600">Yo‘nalish: {group.specialty.name}</p>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Guruhlar topilmadi.
          </p>
        )}
      </div>

      {/* Bottom Info */}
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

export default Marketplace;
