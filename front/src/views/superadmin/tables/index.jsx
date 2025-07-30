import React, { useEffect, useState } from "react";
import ApiCall from "../../../config";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import Card from "../../../components/card";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import Select from "react-select";
import autoprefixer from "autoprefixer";

const Admins = () => {
    const [admins, setAdmins] = useState([]);
    const [newAdmin, setNewAdmin] = useState({ id: '', name: '', phone: '', password: '' });
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [show, setShow] = useState(false);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [adminDuties, setAdminDuties] = useState([]);

    useEffect(() => {
        getAdmins();
        getSubCategory();

    }, []);

    const getSubCategory = async () => {
        try {
            const response = await ApiCall(`/api/v1/superadmin/subcategory`, "GET");
            const formattedOptions = response.data
                .filter(sub => !sub.strange )
                .map(sub => ({
                    service_day: sub.service_day,
                    value: sub.id,
                    label: sub.name
                }));
            setSubCategories(formattedOptions);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    const getAdminDuties = async () => {
        try {
            const response = await ApiCall(`/api/v1/superadmin/duty`, "GET");
            setAdminDuties(response.data);
        } catch (error) {
            console.error("Error fetching admin duties:", error);
        }
    };

    const getAdmins = async () => {
        getAdminDuties();
        try {
            const response = await ApiCall(`/api/v1/superadmin/admins`, "GET");
            setAdmins(response.data);
        } catch (error) {
            console.error("Error fetching admins:", error);
        }
    };

    const addAdmin = async () => {
        const obj = {
            phone: newAdmin.phone,
            password: newAdmin.password,
            name: newAdmin.name
        };
        try {
            const response = await ApiCall(`/api/v1/superadmin/admins`, "POST", obj);
            await saveAdminDuties(response.data.id);
            await getAdmins();
            setShow(false);
            setNewAdmin({ id: '', name: '', phone: '', password: '' });
            setSelectedSubCategories([]);
        } catch (error) {
            console.error("Error adding admin:", error);
        }
    };

    const saveAdminDuties = async (adminId) => {
        const duties = selectedSubCategories.map(subCat => ({
            adminId: adminId,
            subCategoryId: subCat.value
        }));
        try {
            await ApiCall(`/api/v1/superadmin/duty`, "POST", duties);
        } catch (error) {
            console.error("Error saving admin duties:", error);
        }
    };

    const updateAdmin = async () => {
        try {
            const updatedAdmin = {
                phone: editingAdmin.phone,
                name: editingAdmin.name,
                password: editingAdmin.password
            };
            await ApiCall(`/api/v1/superadmin/admins/${editingAdmin.id}`, "PUT", updatedAdmin);
            await saveAdminDuties(editingAdmin.id);
            await getAdmins();
            setEditingAdmin(null);
            setShow(false);
            setSelectedSubCategories([]);
        } catch (error) {
            console.error("Error updating admin:", error);
        }
    };

    const handleEditClick = (admin) => {
        setEditingAdmin({ ...admin, password: '' });
        setSelectedSubCategories(adminDuties.filter(duty => duty.admin.id === admin.id).map(duty => ({
            value: duty.subCategory.id,
            label: duty.subCategory.name
        })));
        setShow(true);
    };

    const deleteAdmin = async (id) => {
        try {
            await ApiCall(`/api/v1/superadmin/admins/${id}`, "DELETE");
            await getAdmins();
        } catch (error) {
            console.error("Error deleting admin:", error);
        }
    };

    const handleDeleteClick = (id) => {
        if (window.confirm("Are you sure you want to delete this admin?")) {
            deleteAdmin(id);
        }
    };

    return (
        <div>
            <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
                <div></div>
                <div className="text-end w-full">
                    <button
                        onClick={() => {
                            setNewAdmin({ id: '', name: '', phone: '', password: '' });
                            setEditingAdmin(null);
                            setSelectedSubCategories([]); // Clear selected subcategories
                            setShow(true);
                        }}
                        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Yangi admin
                    </button>
                </div>
            </div>

            <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-1 pt-0 pb-0 pr-32">
                <Card extra={"w-full h-full"}>
                    <div className="p-4 overflow-x-scroll xl:overflow-x-hidden">
                        <table className="w-full">
                            <thead>
                            <tr className={"border-b-2"}>
                                <th>№</th>
                                <th>Ism</th>
                                <th>Phone/Login</th>
                                <th>Vazifalari</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {admins.map((row, index) => (
                                <tr key={index} className={"border-b-2"}>
                                    <td >{index + 1}</td>
                                    <td><p className={"text-lg bold"}>{row.name}</p></td>
                                    <td><p className={"text-lg bold"}>{row.phone}</p></td>
                                    <td>
                                        {adminDuties.length>0 && adminDuties.filter(item => item.admin.id === row.id).map((item, subIndex) => (
                                            <p key={subIndex} className="bg-blue-100 rounded-2xl p-2 pb-0 pt-0 my-1">{subIndex+1}. {item.subCategory.name}</p>
                                        ))}
                                    </td>
                                    <td className="flex">
                                        <MdDelete className="h-6 w-6 cursor-pointer" onClick={() => handleDeleteClick(row.id)} />
                                        <MdModeEditOutline className="h-6 w-6 cursor-pointer" onClick={() => handleEditClick(row)} />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <Rodal width={750} height={700} visible={show} onClose={() => setShow(false)}>
                <div className={"mb-8 "}>
                    <h2 className="text-lg font-bold mb-4">{editingAdmin ? 'Admin tahrirlash' : "Admin qo'shish"}</h2>
                    <form className={""} onSubmit={(e) => {
                        e.preventDefault();
                        if (editingAdmin) {
                            updateAdmin();
                        } else {
                            addAdmin();
                        }
                    }}>
                        <div className="mb-4">
                            <label className="block mb-2">Ism Familya:</label>
                            <input
                                type="text"
                                value={editingAdmin ? editingAdmin.name : newAdmin.name}
                                onChange={(e) => {
                                    if (editingAdmin) {
                                        setEditingAdmin({...editingAdmin, name: e.target.value});
                                    } else {
                                        setNewAdmin({...newAdmin, name: e.target.value});
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Phone/Login:</label>
                            <input
                                type="text"
                                value={editingAdmin ? editingAdmin.phone : newAdmin.phone}
                                onChange={(e) => {
                                    if (editingAdmin) {
                                        setEditingAdmin({...editingAdmin, phone: e.target.value});
                                    } else {
                                        setNewAdmin({...newAdmin, phone: e.target.value});
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Password:</label>
                            <input
                                type="text"
                                value={editingAdmin ? editingAdmin.password : newAdmin.password}
                                onChange={(e) => {
                                    if (editingAdmin) {
                                        setEditingAdmin({...editingAdmin, password: e.target.value});
                                    } else {
                                        setNewAdmin({...newAdmin, password: e.target.value});
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Vazifalari:</label>
                            <Select
                                isMulti
                                options={subCategories}
                                value={selectedSubCategories}
                                onChange={setSelectedSubCategories}
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                            {editingAdmin ? 'Yangilash' : 'Qo\'shish'}
                        </button>
                    </form>
                </div>
            </Rodal>
        </div>
    );
};

export default Admins;
