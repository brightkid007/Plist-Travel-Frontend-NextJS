"use client";

const LinkTable = ({ links }) => {
  return (
    <div className="w-100 mt-10 overflow-scroll scroll-bar-1">
      <table className="table-2 col-12 text-14">
        <thead className="bg-light-2 text-nowrap">
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Clicks</th>
            <th>Earnings</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link, index) => (
            <tr>
              <td>
                <div className="text-14 lh-16 fw-500">{link.name}</div>
                <div className="text-12 lh-16 fw-500 text-light-1">
                  https://plistravels.com/r/london-hot…
                </div>
              </td>
              <td>
                <span className="border-light text-center px-10 rounded-100 text-12 fw-500 mr-20">
                  {link.type}
                </span>
              </td>
              <td>
                <div className="text-12 lh-16 fw-500">{link.clicks}</div>
                <div className="text-12 lh-16 fw-500 text-light-1">
                  {link.conversions} conversions
                </div>
              </td>
              <td className="lh-16">${link.earnings}</td>
              <td>
                {link.status == "Active" ? (
                  <span className="rounded-100 px-10 text-center text-12 fw-500 bg-green-1 text-green-2">
                    Active
                  </span>
                ) : (
                  <span className="rounded-100 px-10 text-center text-12 fw-500 bg-light-2 text-dark-1">
                    Expired
                  </span>
                )}
              </td>
              <td className="fw-500">
                <div className="d-flex">
                  <div className="px-5 py-5">
                    <img src="/img/dashboard/icons/paste.svg" />
                  </div>
                  <div className="px-5 py-5">
                    <img src="/img/dashboard/icons/link.svg" />
                  </div>
                  <div className="px-5 py-5">
                    <img src="/img/dashboard/icons/delete.svg" />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LinkTable;
