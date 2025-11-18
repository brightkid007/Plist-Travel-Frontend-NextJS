import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import svgIcon from "@/components/data/svgIcon";
import SubscriptionPlan from "./SubscriptionPlan";
import FeeBookingPlan from "./FeeBookingPlan";
import BothPlan from "./BothPlan";
import { getPackagePlans, getCurrentSubscription } from "@/helpers/backend_helper";

const index = () => {
  const [loading, setLoading] = useState(true);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [feePlans, setFeePlans] = useState([]);
  const [bothPlans, setBothPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(0);
  const [selectedModel, setSelectedModel] = useState("subscription");

  useEffect(() => {
    loadAllPlans();
  }, []);

  const loadAllPlans = async () => {
    try {
      setLoading(true);

      // Run both API calls in parallel for better performance
      const [planRes, currentRes] = await Promise.all([
        getPackagePlans({ status: "Active" }).catch(() => ({ plans: [] })),
        getCurrentSubscription().catch(() => ({ data: null })),
      ]);

      setSubscriptionPlans(planRes?.plans?.filter((plan) => plan.model === "subscription") || []);
      setFeePlans(planRes?.plans?.filter((plan) => plan.model === "fee-per-booking") || []);
      setBothPlans(planRes?.plans?.filter((plan) => plan.model === "both") || []);
      
      const planId = parseInt(currentRes?.data?.subscription?.plan_code || currentRes?.subscription?.plan_code, 10) || 0;
      setCurrentPlan(planId);
      setSelectedModel(planRes?.plans?.find((p) => p.id === planId)?.model || "subscription");
    } catch (error) {
      console.error("Error loading plans:", error);
      toast.error(error?.message || "Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const refreshCurrentPlan = async () => {
    try {
      const currentRes = await getCurrentSubscription().catch(() => ({ data: null }));
      const planId = parseInt(currentRes?.data?.subscription?.plan_code || currentRes?.subscription?.plan_code, 10) || 0;
      setCurrentPlan(planId);
      
      // Also update selectedModel if needed
      const allPlans = [...subscriptionPlans, ...feePlans, ...bothPlans];
      const planModel = allPlans.find((p) => p.id === planId)?.model;
      if (planModel) {
        setSelectedModel(planModel);
      }
    } catch (error) {
      console.error("Error refreshing current plan:", error);
    }
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
      content: <SubscriptionPlan plans={subscriptionPlans} currentPlan={currentPlan} loading={loading} />,
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
      content: <FeeBookingPlan plans={feePlans} currentPlan={currentPlan} loading={loading} onPlanUpdate={refreshCurrentPlan} />,
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
      content: <BothPlan plans={bothPlans} currentPlan={currentPlan} loading={loading} />,
    },
  ];

  return (
    <>
      <div className="px-15">
        <div className="row y-gap-20 py-10 px-10 rounded-8 bg-white border-light shadow-3 mb-20">
          <h1 className="text-18 lh-1 fw-600">Choose Your Payment Model</h1>
          <div className="text-16 text-light-1 lh-1">
            Select how you want to be charged for using our platform.
          </div>
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
                <div className="text-12 lh-1 text-light-1 mb-10 text-center">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {paymentModel.find((item) => item.value === selectedModel)["content"]}
    </>
  );
};

export default index;
