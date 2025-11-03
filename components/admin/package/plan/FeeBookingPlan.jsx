import svgIcon from "@/components/data/svgIcon";
import CheckIcon from "@mui/icons-material/Check";
import { green } from "@mui/material/colors";
import { Edit, Trash } from "lucide-react";

const FeeBookingPlan = ({ plans = [], loading = false, onEdit = () => { }, onDelete = () => { } }) => {
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
          {plans.length === 0 ? (
            <>
              <div className="text-14 text-light-1 mt-20">No fee plans found.</div>
            </>
          ) : (
            <div className="row y-gap-20 mt-20 w-100">
              {plans.map((p) => {
                const features = isArray(p.features) 
                  ? p.features 
                  : typeof (p.features) === 'string' 
                    ? (() => { 
                        try { 
                          return JSON.parse(p.features || '[]'); 
                        } catch (e) { 
                          return []; 
                        } 
                      })() 
                    : [];
                return <div className="col-md-4" key={p.id}>
                  <div className="bg-light-2 px-15 py-15 rounded-8 h-100 d-flex flex-column justify-between">
                    <div>
                      <div className="text-18 fw-600">{p.name}</div>
                      <div className="text-40 fw-600 lh-1 mt-10">{p.commission_percent ?? 0}%</div>
                      <div className="text-12 text-light-1">Commission per confirmed booking</div>
                      {features.map((f, idx) => (
                        <div className="d-flex items-center text-14 gap-2 mt-5" key={idx}>
                          <CheckIcon sx={{ color: green[400], fontSize: 16 }} />
                          {f}
                        </div>
                      ))}
                    </div>
                    <div className="d-flex items-center justify-end gap-2 mt-10">
                      <span className="text-12 fw-500 text-white bg-green-3 rounded-100 px-10">{p.status || 'Active'}</span>
                      <Edit size={16} className="text-light-1 cursor-pointer" onClick={() => onEdit(p.id)} />
                      <Trash size={16} className="text-light-1 cursor-pointer" onClick={() => onDelete(p.id)} />
                    </div>
                  </div>
                </div>
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeeBookingPlan;
