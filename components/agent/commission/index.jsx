import AgentDashboardLayout from "../common/layout";

const index = () => {
  const tierLevel = 2;

  const tierLevelData = [
    {
      id: 1,
      tier: "Tier 1",
      booking_volume_required: "$0 - $50,000",
      benefits: "Basic commission rates",
    },
    {
      id: 2,
      tier: "Tier 2",
      booking_volume_required: "$50,000 - $100,000",
      benefits: "Enhanced commission rates, priority support",
    },
    {
      id: 3,
      tier: "Tier 3",
      booking_volume_required: "$100,000 - $250,000",
      benefits: "Premium commission rates, dedicated account manager",
    },
    {
      id: 4,
      tier: "Elite",
      booking_volume_required: "$250,000+",
      benefits: "Maximum commission rates, VIP benefits, exclusive promo’",
    },
  ];

  const commissions = [
    {
      service_category: "Hotels",
      local_vendor_rate: "10%",
      api_vendor_rate: "7%",
      tier_rate: "10%",
    },
    {
      service_category: "Vacation Rental",
      local_vendor_rate: "5%",
      api_vendor_rate: "3%",
      tier_rate: "5%",
    },
    {
      service_category: "Spaces",
      local_vendor_rate: "15%",
      api_vendor_rate: "10%",
      tier_rate: "12%",
    },
    {
      service_category: "Event Venues",
      local_vendor_rate: "8%",
      api_vendor_rate: "5%",
      tier_rate: "8%",
    },
    {
      service_category: "Activities",
      local_vendor_rate: "12%",
      api_vendor_rate: "8%",
      tier_rate: "10%",
    },
    {
      service_category: "Tours",
      local_vendor_rate: "15%",
      api_vendor_rate: "10%",
      tier_rate: "12%",
    },
    {
      service_category: "Events",
      local_vendor_rate: "10%",
      api_vendor_rate: "7%",
      tier_rate: "9%",
    },
    {
      service_category: "Rides",
      local_vendor_rate: "12%",
      api_vendor_rate: "8%",
      tier_rate: "7%",
    },
    {
      service_category: "Flights",
      local_vendor_rate: "10%",
      api_vendor_rate: "7%",
      tier_rate: "8%",
    }
  ];

  const statusWidget = (id) => {
    let status = "";
    let badgeClass = "rounded-100 px-10 fw-500 text-12 ";

    const isArchived = id < tierLevel;
    const isCurrent = id === tierLevel;
    const isInProgress = id === tierLevel + 1;

    if (isArchived) {
      status = "Archived";
      badgeClass += "bg-green-4 text-green-2";
    } else if (isCurrent) {
      status = "Current";
      badgeClass += "bg-green-4 text-green-2";
    } else if (isInProgress) {
      status = "In Progress";
      badgeClass += "bg-yellow-4 text-dark-yellow";
    } else {
      status = "Locked";
      badgeClass += "bg-light-2 text-light-1";
    }

    return <span className={badgeClass}>{status}</span>;
  };

  return (
    <AgentDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Commission Settings</h1>
          <div className="text-14 lh-14 text-light-1">
            View and manage your commission rates
          </div>
        </div>
      </div>

      <div className="bg-white rounded-8 border-light px-20 py-15">
        <h1 className="text-24 lh-14 fw-500">Agent Classification</h1>
        <div className="text-14 lh-14 text-light-1">
          Your current tier and commission structure
        </div>
        <div className="overflow-scroll scroll-bar-1 pb-10 mt-10">
          <div className="d-flex items-start gap-3 mt-10">
            <div className="w-25" style={{ minWidth: "210px" }}>
              <div className="text-14 lh-14 fw-500">Current Tier</div>
              <div className="d-flex items-center gap-2">
                <span className="bg-dark-blue rounded-100 px-15 text-white fw-500 text-12">
                  Tier 2
                </span>
                <div className="text-14 text-light-1">Agent since Jan 2023</div>
              </div>
            </div>

            <div className="w-25" style={{ minWidth: "300px" }}>
              <div className="text-14 lh-14 fw-500">Next Tier</div>
              <div className="d-flex items-center gap-2">
                <span className="border-light rounded-100 px-15 fw-500 text-12">
                  Tier 3
                </span>
                <div className="text-14 text-light-1">
                  $25,000 more in bookings needed
                </div>
              </div>
            </div>

            <div className="w-25" style={{ minWidth: "150px" }}>
              <div className="text-14 lh-14 fw-500">Total Bookings Value</div>
              <div className="text-18 fw-600 lh-14">$75,230.50</div>
            </div>

            <div className="w-25" style={{ minWidth: "180px" }}>
              <div className="text-14 lh-14 fw-500">
                Total Commission Earned
              </div>
              <div className="text-18 fw-600 text-green-3 lh-14">$6,845.20</div>
            </div>
          </div>
        </div>
        <h1 className="text-16 lh-14 fw-500">Tier Requirements</h1>
        <div className="overflow-scroll scroll-bar-1">
          <table className="table-5 col-12 text-14">
            <thead className="text-nowrap">
              <tr className="text-light-1 fw-600 border-bottom-light">
                <th>Tier Level</th>
                <th>Booking Volume Required</th>
                <th>Benefits</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tierLevelData.map((row, index) => (
                <tr key={index}>
                  <td className="align-middle">
                    <span
                      className={
                        (row.id <= tierLevel
                          ? "bg-dark-blue text-white"
                          : "border-light") +
                        " rounded-100 px-10 fw-500 text-12"
                      }
                    >
                      {row.tier}
                    </span>
                  </td>
                  <td className="align-middle">{row.booking_volume_required}</td>
                  <td className="align-middle">{row.benefits}</td>
                  <td className="align-middle">{statusWidget(row.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-8 border-light px-20 py-15 mt-10">
        <h1 className="text-24 lh-14 fw-500">Standard Commission Rates</h1>
        <div className="text-14 lh-14 text-light-1">
          Your tier-based commission rates for each service category
        </div>
        <div className="overflow-scroll scroll-bar-1">
          <table className="table-5 col-12 text-14">
            <thead className="text-nowrap">
              <tr className="text-light-1 fw-600 border-bottom-light">
                <th>Service Category</th>
                <th>Local Vendor Rate</th>
                <th>API Vendor Rate</th>
                <th>Your Tier Rate</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((row, index) => (
                <tr key={index}>
                  <td className="align-middle">{row.service_category}</td>
                  <td className="align-middle">{row.local_vendor_rate}</td>
                  <td className="align-middle">{row.api_vendor_rate}</td>
                  <td className="align-middle">{row.tier_rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-14 lh-14 text-light-1">
          * Commission rates are based on your current Tier 2 classification.
          Upgrade to Tier 3 for enhanced rates.
        </div>
      </div>
    </AgentDashboardLayout>
  );
};

export default index;
