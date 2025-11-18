"use client";

import { Plus } from "lucide-react";
import AdminDashboardLayout from "../../common/layout";
import { useRouter } from "next/navigation";
import svgIcon from "@/components/data/svgIcon";
import SubscriptionPlan from "./SubscriptionPlan";
import FeeBookingPlan from "./FeeBookingPlan";
import BothPlan from "./BothPlan";
import { useEffect, useState } from "react";
import { getPackagePlans, deletePackagePlan } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { CircularProgress } from "@mui/material";
import { usePermissions } from "@/hooks/usePermissions";

const index = () => {
  const { hasPermission } = usePermissions();
  const [selectedModel, setSelectedModel] = useState("subscription");
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const reloadPlans = async () => {
    try {
      setLoading(true);
      const res = await getPackagePlans();
      const list = res?.plans || res?.data?.plans || res?.data || res || [];
      setPlans(list);
    } catch (e) {
      toast.error(e?.message || "Failed to load plans");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id, name) => {
    if (!hasPermission("package_management", "delete")) {
      toast.error("You don't have permission to delete plans");
      return;
    }
    setPlanToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;

    try {
      setDeleting(true);
      await deletePackagePlan(planToDelete.id);
      toast.success("Plan deleted");
      await reloadPlans();
      setDeleteModalOpen(false);
      setPlanToDelete(null);
    } catch (e) {
      toast.error(e?.message || "Failed to delete plan");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  const handleEdit = (id) => {
    if (!hasPermission("package_management", "update")) {
      toast.error("You don't have permission to edit plans");
      return;
    }
    router.push(`/admin/package/plan/add?edit=${id}`);
  };

  const paymentModel = [
    {
      title: "Subscription Plan",
      value: "subscription",
      description: "Pay a monthly/yearly fee with different features",
      icon: (
        <div className="d-flex align-items-center justify-center">
          {svgIcon.subscription_plan}
        </div>
      ),
      content: <SubscriptionPlan plans={plans.filter(p => p.model === "subscription")} loading={loading} hasPermission={hasPermission} onEdit={handleEdit} onDelete={(id) => {
        const plan = plans.find(p => p.id === id);
        handleDeleteClick(id, plan?.name || `Plan #${id}`);
      }} />,
    },
    {
      title: "Fee Per Booking",
      value: "fee-per-booking",
      description: "Pay a monthly/yearly fee with different features",
      icon: (
        <div className="d-flex align-items-center justify-center">
          {svgIcon.fee_model}
        </div>
      ),
      content: <FeeBookingPlan plans={plans.filter(p => p.model === "fee-per-booking")} loading={loading} hasPermission={hasPermission} onEdit={handleEdit} onDelete={(id) => {
        const plan = plans.find(p => p.id === id);
        handleDeleteClick(id, plan?.name || `Plan #${id}`);
      }} />,
    },
    {
      title: "Both",
      value: "both",
      description: "Pay a monthly/yearly fee with different features",
      icon: (
        <div className="d-flex align-items-center justify-center">
          {svgIcon.subscription_plan} + {svgIcon.fee_model}
        </div>
      ),
      content: <BothPlan plans={plans.filter(p => p.model === "both")} loading={loading} hasPermission={hasPermission} onEdit={handleEdit} onDelete={(id) => {
        const plan = plans.find(p => p.id === id);
        handleDeleteClick(id, plan?.name || `Plan #${id}`);
      }} />,
    },
  ];

  useEffect(() => {
    reloadPlans();
  }, []);

  return (
    <AdminDashboardLayout>
      <div className="row y-gap-15 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Package Plan Management</h1>
          <div className="text-14 text-light-1 lh-14">
            Manage and monitor all package plans across the platform.
          </div>
        </div>
        <div className="col-auto ms-auto">
          <button
            className="button bg-dark-blue text-white px-20 py-10 rounded-8"
            onClick={() => {
              if (!hasPermission("package_management", "create")) {
                toast.error("You don't have permission to create plans");
                return;
              }
              router.push("/admin/package/plan/add");
            }}
            disabled={!hasPermission("package_management", "create")}
            style={{ 
              opacity: !hasPermission("package_management", "create") ? 0.5 : 1,
              cursor: !hasPermission("package_management", "create") ? "not-allowed" : "pointer"
            }}
          >
            <Plus size={18} className="mr-10" /> Create New Plan
          </button>
        </div>
      </div>

      <div className="row y-gap-20 x-gap-20">
        {paymentModel.map((item, index) => (
          <div
            className="col-md-4"
            key={index}
            onClick={() => setSelectedModel(item.value)}
          >
            <div
              className={
                "d-flex flex-column items-center justify-between rounded-8 bg-white px-15 py-15 h-100 cursor-pointer " +
                (selectedModel === item.value
                  ? "border-blue-1"
                  : "bg-light-2 border-light")
              }
            >
              {item.icon}
              <h3 className="text-14 lh-1 fw-500 mt-15 mb-5">{item.title}</h3>
              <div className="text-12 lh-1 text-light-1 mb-10">
                {item.description}
              </div>
            </div>
          </div>
        ))}
        {paymentModel.find((item) => item.value === selectedModel)["content"]}
      </div>

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Package Plan"
        message={`Are you sure you want to delete the plan "${planToDelete?.name}"?`}
        itemName={planToDelete?.name}
        loading={deleting}
      />
    </AdminDashboardLayout>
  );
};

export default index;
