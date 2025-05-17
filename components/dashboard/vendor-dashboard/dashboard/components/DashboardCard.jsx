const DashboardCard = ({ data }) => {
  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-3 col-md-6">
          <div className="py-20 px-20 rounded-4 bg-white shadow-3 h-100">
            <div className="row justify-between items-start">
              <div className="col-auto">
                <div className="fw-500 lh-14">{item.title}</div>
                <div className="text-26 lh-16 fw-600 mt-5">{item.amount}</div>
              </div>
              <div className="col-auto">
                <img src={item.icon} alt="icon" width={45} />
              </div>
              <div className="col-12">
                <div className="text-12 lh-14 text-light-1 mt-5">
                  {item.improve}
                </div>
                {item.description && (
                  <div className="text-12 lh-14 text-light-1 mt-5">
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard;
