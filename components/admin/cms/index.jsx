"use client";

import AdminDashboardLayout from "../common/layout";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminContent, getBanners, deleteAdminContent, deleteBanner } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { Menu, MenuItem } from "@mui/material";

const index = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("static");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    {
      label: "Static Pages",
      value: "static",
    },
    {
      label: "Banner Management",
      value: "banner",
    },
  ];
  const statusColors = (status) => {
    switch (status) {
      case "Published":
      case "Active":
        return "bg-green-4 text-green-2";
      case "Draft":
        return "bg-yellow-4 text-dark-yellow";
      case "Inactive":
        return "bg-red-4 text-red-1";
      default:
        return "bg-light-2 text-light-1";
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === "static") {
        const res = await getAdminContent({ type: "static" });
        const list = res?.data?.items || res?.data || res?.items || res || [];
        const mapped = list.map((row) => ({
          id: row.id,
          title: row.title || row.name || "Untitled",
          status: row.status || (row.published ? "Published" : "Draft"),
          last_updated: row.updatedAt || row.updated_at || row.modified_at || row.createdAt || row.created_at,
        }));
        setItems(mapped);
      } else {
        const res = await getBanners();
        const list = res?.data?.banners || res?.data || res?.items || res || [];
        const mapped = list.map((row) => ({
          id: row.id,
          title: row.title || row.name || "Untitled Banner",
          position: row.position || row.placement || "-",
          status: row.status || (row.active ? "Active" : "Inactive"),
          last_updated: row.updatedAt || row.updated_at || row.modified_at || row.createdAt || row.created_at,
        }));
        setItems(mapped);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to load data");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleDelete = async (id) => {
    try {
      if (!id) return;
      if (activeTab === "static") {
        await deleteAdminContent(id);
      } else {
        await deleteBanner(id);
      }
      toast.success("Deleted successfully");
      loadData();
    } catch (error) {
      toast.error(error?.message || "Delete failed");
    }
  };

  // Menu handlers for dropdown actions
  const handleMenuOpen = (event, itemId) => {
    setMenuAnchor({ [itemId]: event.currentTarget });
  };

  const handleMenuClose = (itemId) => {
    setMenuAnchor({ [itemId]: null });
  };

  return (
    <AdminDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Content Management System</h1>
        </div>
      </div>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <div className="row px-10">
            {tabs.map((item) => (
              <div className="col-auto px-5" key={item.value}>
                <button
                  className={`text-14 px-10 fw-500 py-5 rounded-8 ${
                    activeTab === item.value ? "bg-white" : "text-light-1"
                  }`}
                  onClick={() => {
                    setActiveTab(item.value);
                  }}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-auto ms-auto">
          <button
            className="button bg-blue-1 text-white px-15 fw-400 py-10 rounded-8"
            onClick={() => router.push("/admin/cms/add?service=" + activeTab)}
          >
            <Plus size={20} /> Add New{" "}
            {activeTab == "static" ? "Page" : "Banner"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-8 border-light px-20 py-15">
        <div className="d-flex items-center justify-between mb-10">
          <div>
            <h1 className="text-24 lh-14 fw-500">
              Manage {activeTab == "static" ? "Static Pages" : "Banners"}
            </h1>
          </div>
          <div className="position-relative d-flex items-center w-180 sm:w-full">
            <input
              type="text"
              placeholder={`Search ${activeTab == "static" ? "pages" : "banners"}...`}
              className="border-light bg-white rounded-8 px-10 py-5 pl-30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i
              className="icon-search text-light-1 position-absolute"
              style={{
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            ></i>
          </div>
        </div>
        <div className="bg-white rounded-8 border-light py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-2 col-12 text-14">
              <thead className="text-nowrap">
                <tr>
                  <th>Title</th>
                  {activeTab != "static" && <th>Position</th>}
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={activeTab !== "static" ? 5 : 4} className="text-center py-30 text-14 text-light-1">Loading...</td>
                  </tr>
                ) : items
                    .filter((row) => {
                      if (!searchTerm) return true;
                      const search = searchTerm.toLowerCase();
                      return (
                        row.title?.toLowerCase().includes(search) ||
                        row.position?.toLowerCase().includes(search) ||
                        row.status?.toLowerCase().includes(search)
                      );
                    })
                    .length === 0 ? (
                  <tr>
                    <td colSpan={activeTab !== "static" ? 5 : 4} className="text-center py-30 text-14 text-light-1">
                      {searchTerm ? "No records found matching your search" : "No records found"}
                    </td>
                  </tr>
                ) : items
                    .filter((row) => {
                      if (!searchTerm) return true;
                      const search = searchTerm.toLowerCase();
                      return (
                        row.title?.toLowerCase().includes(search) ||
                        row.position?.toLowerCase().includes(search) ||
                        row.status?.toLowerCase().includes(search)
                      );
                    })
                    .map((row) => (
                  <tr key={row.id}>
                    <td className="align-middle text-14 fw-500 lh-16">
                      {row.title}
                    </td>
                    {activeTab != "static" && (
                      <td className="align-middle text-14 fw-500 lh-16">
                        {row.position}
                      </td>
                    )}
                    <td className="align-middle">
                      <span
                        className={`rounded-100 px-10 text-center text-12 fw-500 ${statusColors(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="align-middle text-12 lh-16 fw-500">
                      {row.last_updated ? new Date(row.last_updated).toLocaleString() : "—"}
                    </td>
                    <td className="align-middle">
                      <div className="position-relative">
                        <button
                          className="border-0 bg-transparent cursor-pointer px-5 py-5"
                          onClick={(e) => handleMenuOpen(e, row.id)}
                        >
                          <MoreVertical size={16} />
                        </button>
                        <Menu
                          anchorEl={menuAnchor[row.id]}
                          open={Boolean(menuAnchor[row.id])}
                          onClose={() => handleMenuClose(row.id)}
                        >
                          <MenuItem 
                            onClick={() => {
                              router.push(`/admin/cms/add?service=${activeTab}&view=${row.id}`);
                              handleMenuClose(row.id);
                            }}
                          >
                            View
                          </MenuItem>
                          <MenuItem 
                            onClick={() => {
                              router.push(`/admin/cms/add?service=${activeTab}&edit=${row.id}`);
                              handleMenuClose(row.id);
                            }}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem 
                            onClick={() => {
                              handleDelete(row.id);
                              handleMenuClose(row.id);
                            }}
                            className="text-red-2"
                          >
                            Delete
                          </MenuItem>
                        </Menu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default index;
