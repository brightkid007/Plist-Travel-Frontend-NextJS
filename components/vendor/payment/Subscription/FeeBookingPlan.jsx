import { toast } from "react-toastify";
import svgIcon from "@/components/data/svgIcon";
import CheckIcon from "@mui/icons-material/Check";
import { green } from "@mui/material/colors";
import { CircularProgress } from "@mui/material";
import { updateVendorSubscription } from "@/helpers/backend_helper";

const FeeBookingPlan = ({ plans = [], currentPlan = null, loading = false, onPlanUpdate }) => {
  const feePlans = plans || [];

  const handleSubscribe = async (plan) => {
    try {
      const plan_code = plan.code || plan.id?.toString();
      const response = await updateVendorSubscription({
        plan_code,
      });

      if (response.subscription?.plan_code) {
        toast.success("Subscription updated successfully!");
        onPlanUpdate();
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error(error?.message || "Failed to update subscription");
    }
  };

  const parseFeatures = (features) => {
    if (Array.isArray(features)) {
      return features;
    }
    if (typeof features === "string") {
      try {
        return JSON.parse(features || "[]");
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  return (
    <div className="bg-white rounded-8 border-light shadow-4 py-30 px-20">
      <div className="row y-gap-20 x-gap-20">
        <div className="col-12 d-flex flex-column items-center justify-center">
          <div className="size-60 flex-center rounded-full bg-green-1 text-gree-2">
            {svgIcon.fee_model}
          </div>
          <div className="text-24 fw-600">Fee per Booking</div>
          <div className="text-16 text-light-1">
            Pay only when you make a booking. No monthly fees, no commitments.
          </div>
          {loading && (
            <div className="text-14 text-light-1 mt-20 d-flex items-center justify-center gap-2">
              <CircularProgress size={20} thickness={5} />
              <span>Loading plans...</span>
            </div>
          )}
          {!loading && feePlans.length === 0 ? (
            <div className="d-flex flex-column items-center justify-center gap-2 text-14 text-light-1 mt-20 py-30">
              <span>No fee plans found</span>
            </div>
          ) : (
            <div className="row y-gap-20 mt-20 w-100">
              {feePlans.map((plan) => {
                const features = parseFeatures(plan.features);
                return (
                  <div className="col-md-4" key={plan.id}>
                    <div
                      className={
                        "rounded-8 px-15 py-15 h-100 border cursor-pointer transition-all " +
                        (plan.id == currentPlan
                          ? "bg-blue-2 border-blue-1"
                          : "bg-light-2 border-light hover:border-blue-1")
                      }
                      onClick={() => handleSubscribe(plan)}
                    >
                      <div className="d-flex flex-column justify-between h-100">
                        <div>
                          <div className="text-18 fw-600">{plan.name || "Fee Plan"}</div>
                          <div className="text-40 fw-600 lh-1 mt-10">
                            {plan.commission_percent ?? 0}%
                          </div>
                          <div className="text-12 text-light-1">
                            Commission per confirmed booking
                          </div>
                          {features.length > 0 && (
                            <div className="mt-15">
                              {features.map((f, idx) => (
                                <div
                                  className="d-flex items-center text-14 gap-2 mt-5"
                                  key={idx}
                                >
                                  <CheckIcon sx={{ color: green[400], fontSize: 16 }} />
                                  {typeof f === "string" ? f : f.name || f.description || ""}
                                </div>
                              ))}
                            </div>
                          )}
                          {plan.description && (
                            <div className="text-12 text-light-1 mt-10">
                              {plan.description}
                            </div>
                          )}
                        </div>
                        <button
                          className={
                            "text-14 py-10 px-20 rounded-8 w-100 mt-20 " +
                            (plan.id == currentPlan
                              ? "bg-blue-1 text-white"
                              : "fw-500 border-light text-dark-1")
                          }
                          onClick={() => plan.id == currentPlan ? null : handleSubscribe(plan)}
                        >
                          {/* {plan.id == currentPlan ? "Current Plan" : "Select Plan"} */}
                          {plan.id == currentPlan ? "Current Plan" : "Subscribe"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeeBookingPlan;
