import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import CheckIcon from "@mui/icons-material/Check";
import { green } from "@mui/material/colors";
import { CreditCard, Edit, Star, Trash, Package } from "lucide-react";
import { CircularProgress } from "@mui/material";

const BothPlan = ({ plans = [], loading = false, hasPermission = () => false, onEdit = () => { }, onDelete = () => { } }) => {
  const subscriptionPlans = plans.length > 0 ? plans.map(p => ({
    id: p.id,
    title: p.name,
    value: p.name?.toLowerCase?.() || String(p.id),
    description: p.description || "",
    icon: (
      <div className="size-40 flex-center rounded-full bg-light-2 text-dark-1">
        <CreditCard />
      </div>
    ),
    commission_percent: p.commission_percent || 0,
    price: p.price || 0,
    services: Array.isArray(p.features)
      ? p.features
      : typeof (p.features) === 'string'
        ? (() => {
          try {
            return JSON.parse(p.features || '[]');
          } catch (e) {
            return [];
          }
        })()
        : [],
    duration_unit: p.duration_unit || "months",
    duration_value: p.duration_value || 1,
    isPopular: !!p.is_popular,
    status: p.status || "Active",
  })) : [];

  return (
    <>
      <div className="text-20 fw-600 col-auto">Both</div>
      <div className="row y-gap-20">
        {loading ? (
          <div className="col-12 d-flex items-center justify-center gap-2 text-14 text-light-1">
            <CircularProgress size={20} thickness={5} />
            <span>Loading plans...</span>
          </div>
        ) : subscriptionPlans.length === 0 ? (
          <div className="col-12 d-flex flex-column items-center justify-center gap-2 text-14 text-light-1 py-30">
            <Package size={32} className="text-light-1 mb-5" />
            <span>No plans found</span>
          </div>
        ) : (
          subscriptionPlans.map((item, index) => (
          <div className="col-md-4" key={index}>
            <div
              className={
                "rounded-8 bg-white px-15 py-15 h-100 d-flex flex-column justify-between " +
                (item.isPopular ? "border-blue-1" : "border-light")
              }
            >
              <div>
                <div className="d-flex flex-wrap items-center">
                  <div className="d-flex items-center">
                    {item.icon}
                    <h3 className="ml-10 text-24 lh-1 fw-600">{item.title}</h3>
                  </div>
                  {item.isPopular && (
                    <div className="text-white px-10 rounded-100 bg-blue-1 text-10 fw-500 ms-auto">
                      Popular
                    </div>
                  )}
                </div>
                <div className="text-12 lh-1 text-light-1 mt-5">
                  {item.description}
                </div>
                <div className="d-flex items-end mt-20">
                  <h1 className="text-30 fw-600 mr-5">${item.price} </h1>
                  <div className="text-14 text-light-1 mb-5">/ {item.duration_value} {item.duration_unit}</div>
                </div>
                <div className="text-14 text-green-3 mb-5">
                  {item.commission_percent}% <span className="text-12">commission per booking</span>
                </div>
                {item.services.map((service, idx) => (
                  <div
                    className="d-flex items-center text-14 gap-2 mt-5"
                    key={"service" + idx}
                  >
                    <CheckIcon size={16} color="green" />
                    {service}
                  </div>
                ))}
              </div>
              <div className="d-flex items-center justify-end gap-2 mt-auto">
                <span className="text-12 fw-500 text-white bg-green-3 rounded-100 px-10">
                  {item.status}
                </span>
                <Edit 
                  size={16} 
                  className={`${hasPermission("package_management", "update") ? "text-light-1 cursor-pointer" : "text-light-1 cursor-not-allowed opacity-50"}`}
                  onClick={() => {
                    if (hasPermission("package_management", "update")) {
                      onEdit(item.id);
                    }
                  }}
                />
                <Trash 
                  size={16} 
                  className={`${hasPermission("package_management", "delete") ? "text-light-1 cursor-pointer" : "text-light-1 cursor-not-allowed opacity-50"}`}
                  onClick={() => {
                    if (hasPermission("package_management", "delete")) {
                      onDelete(item.id);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ))
        )}
      </div>
    </>
  );
};

export default BothPlan;
