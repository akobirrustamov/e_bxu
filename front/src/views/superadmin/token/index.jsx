import React, { useEffect, useState } from "react";
import ApiCall from "../../../config";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import Card from "../../../components/card";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";

const index = () => {
  const [tokens, setTokens] = useState([]);
  const [newToken, setNewToken] = useState({
    id: "",
    name: "",
  });
  const [show, setShow] = useState(false);

  useEffect(() => {
    getTokens();
  }, []);

  const addToken = async () => {
    try {
      const response = await ApiCall(
        `/api/v1/hemis/${newToken.name}`,
        "POST",
        null
      );
      await getTokens();
      setShow(false);
      setNewToken({ id: "", name: "" });
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  const getTokens = async () => {
    try {
      const response = await ApiCall(`/api/v1/token/hemis/last`, "GET");
      setTokens(response.data);
    } catch (error) {
      console.error("Error fetching Tokens:", error);
    }
  };

  const deleteToken = async (id) => {
    try {
      await ApiCall(`/api/v1/hemis/${id}`, "DELETE");
      await getTokens();
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      deleteToken(id);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Adminlar boshqaruvi
        </h1>
        <button
          onClick={() => {
            setNewToken({ id: "", name: "" });
            setShow(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <FiPlus className="text-lg" />
          Yangi token
        </button>
      </div>

      <Card extra={"w-full h-full shadow-sm"}>
        <div className="overflow-x-auto p-4">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left font-medium text-gray-600">
                  №
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">
                  Token
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">
                  Vaqt
                </th>
                <th className="py-3 px-4 text-right font-medium text-gray-600">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-800">{row.name}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-gray-700">{row.phone}</p>
                  </td>
                  <td className="flex justify-end gap-4 py-3 px-4">
                    <button
                      onClick={() => handleDeleteClick(row.id)}
                      className="rounded-full p-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
                      title="O'chirish"
                    >
                      <MdDelete className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tokens.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              Hech qanday token topilmadi.
            </div>
          )}
        </div>
      </Card>

      <Rodal
        width={500}
        height="auto"
        visible={show}
        onClose={() => setShow(false)}
        customStyles={{
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <div className="p-4">
          <h2 className="mb-6 text-xl font-bold text-gray-800">
            Yangi token qo'shish
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              addToken();
            }}
          >
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Token
              </label>
              <input
                type="text"
                value={newToken.name}
                onChange={(e) => {
                  setNewToken({ ...newToken, name: e.target.value });
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ism familya kiriting"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Qo'shish
              </button>
            </div>
          </form>
        </div>
      </Rodal>
    </div>
  );
};

export default index;
