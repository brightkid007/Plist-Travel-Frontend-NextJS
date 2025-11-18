import { toast } from "react-toastify";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import CheckIcon from "@mui/icons-material/Check";
import { green } from "@mui/material/colors";
import { CircularProgress } from "@mui/material";
import { initiateSubscription } from "@/helpers/backend_helper";

const SubscriptionPlan = ({ plans = [], currentPlan = null, loading = false }) => {
  const getPlanIcon = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes("basic")) {
      return (
        <div className="size-40 flex-center rounded-full bg-light-2 text-dark-1">
          <CreditCardIcon />
        </div>
      );
    } else if (name.includes("professional") || name.includes("pro")) {
      return (
        <div className="size-40 flex-center rounded-full bg-blue-2 text-blue-1">
          <StarOutlineIcon />
        </div>
      );
    } else {
      return (
        <div className="size-40 flex-center rounded-full bg-purple-2 text-purple-1">
          <ElectricBoltIcon />
        </div>
      );
    }
  };

  // Transform backend data to frontend format
  const subscriptionPlans = plans.map((plan) => ({
    id: plan.id,
    title: plan.name || "Plan",
    value: plan.name?.toLowerCase().replace(/\s+/g, "-") || "plan",
    description: plan.description || "",
    icon: getPlanIcon(plan.name || ""),
    price: parseFloat(plan.price) || 0,
    services: plan.features || [],
    isPopular: plan.is_popular || false,
    plan_code: plan.code || plan.id?.toString(),
  }));

  const handleSubscribe = async (plan) => {
    try {
      toast.info("Initiating subscription...");

      const response = await initiateSubscription({
        plan_code: plan.plan_code || plan.id.toString(),
        currency: "USD", // TODO: Get from user preferences
      });

      const data = response?.data || response;

      if (data.gateway === "stripe" && data.session_url) {
        // Redirect to Stripe checkout
        window.location.href = data.session_url;
      } else if (data.gateway === "paystack" && data.authorization_url) {
        // Redirect to Paystack checkout
        window.location.href = data.authorization_url;
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error) {
      console.error("Error initiating subscription:", error);
      toast.error(error?.message || "Failed to initiate subscription");
    }
  };

  return (
    <>
      <div className="row y-gap-20 justify-between">
        <div className="text-20 fw-600 col-auto">Subscription Plan</div>
        {/* <div className="col-sm-auto d-flex justify-end items-center">
          <div className="text-14 fw-500 mr-10">Monthly</div>
          <div className="form-check form-switch mt-5">
            <input
              className="form-check-input border-light"
              type="checkbox"
              role="switch"
              id="serviceActive"
            />
          </div>
          <div className="text-14 fw-500 mr-20">
            Yearly
            <span className="text-green-2 text-14 fw-400 ml-5">(Save 20%)</span>
          </div>
        </div> */}
      </div>
      {loading ? (
        <div className="d-flex justify-center items-center py-40">
          <CircularProgress size={40} />
          <p className="text-14 text-light-1 ml-10">Loading subscription plans...</p>
        </div>
      ) : (
        <div className="row y-gap-20">
          {subscriptionPlans.length === 0 ? (
            <div className="col-12 text-center py-40">
              <p className="text-14 text-light-1">No subscription plans available at the moment.</p>
            </div>
          ) : (
            subscriptionPlans.map((item, index) => (
              <div className="col-md-4" key={index}>
                <div
                  className={
                    "rounded-8 bg-white px-15 py-15 h-100 " +
                    (item.id == currentPlan ? "border-blue-1" : "border-light")
                  }
                >
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
                    <div className="text-14 text-light-1 mb-5">/ month</div>
                  </div>
                  {item.services && item.services.length > 0 ? (
                    item.services.map((service, idx) => (
                      <div
                        className="d-flex items-center text-14 gap-2 mt-5"
                        key={"service" + idx}
                      >
                        <CheckIcon sx={{ color: green[400], fontSize: 16 }} />
                        {typeof service === "string" ? service : service.name || service.description || ""}
                      </div>
                    ))
                  ) : (
                    <div className="text-12 text-light-1 mt-10">No features listed</div>
                  )}
                  <button
                    className={
                      "text-14 py-10 px-20 rounded-8 w-100 mt-20 " +
                      (item.id == currentPlan
                        ? "bg-blue-1 text-white"
                        : "fw-500 border-light text-dark-1")
                    }
                    onClick={() => item.id == currentPlan ? null : handleSubscribe(item)}
                  >
                    {/* {item.id == currentPlan
                      ? "Current Plan"
                      : item.id > currentPlan
                        ? "Upgrade"
                        : "Select Plan"} */}
                    {item.id == currentPlan ? "Current Plan" : "Subscribe"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default SubscriptionPlan;
