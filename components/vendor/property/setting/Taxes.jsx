import { Radio } from "@mui/material";
import { useState } from "react";

const Taxes = () => {
  const data = [
    {
      authority: "DENTON",
      government_level: "County",
      rate: "2%",
      type: "Accommodations Tax",
      amount: "Rent & Your Fees",
      effective_date: "Active",
    },
    {
      authority: "DENTON TOURISM PUBLIC IMPROVEMENT DISTRICT",
      government_level: "Special Purpose District",
      rate: "2%",
      type: "Accommodations Tax",
      amount: "Rent & Your Fees",
      effective_date: "Active",
    },
    {
      authority: "DENTON",
      government_level: "City",
      rate: "7%",
      type: "Accommodations Tax",
      amount: "Rent & Your Fees",
      effective_date: "Active",
    },
  ];

  const taxOptions = [
    {
      id: 1,
      title: "No tax collection",
      description:
        "You are responsible for collecting, filing, and paying your taxes to tax authorities.",
    },
    {
      id: 2,
      title: "Collect my taxes and send them to me",
      description:
        "Your taxes will be collected during booking and sent to you. You are responsible for filing and paying your taxes to tax authorities.",
    },
    {
      id: 3,
      title: "Collect, file, and pay my taxes for me",
      subtitle: "$27 per month, plus $299 setup fee",
      description:
        "To make lodging taxes faster, more accurate, and easier than ever, we’ve partnered with MyLodgeTax to automatically collect, file, and pay your taxes for you.",
      poweredBy: "Avalara",
      learnMoreUrl: "#",
    },
  ];

  const [taxOption, setTaxOption] = useState(1);

  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-1 fw-600">Tax Collection</h1>
      <div className="text-14 text-light-1 lh-14">
        Based on the location this property, both you and Plist are responsible
        for collecting filling and paying taxes on bookings.
      </div>
      <div className="col-auto py-0">
        <button className="btn btn-link text-12 px-0 py-0">
          View Plist taxes
        </button>
      </div>
      <h1 className="text-20 lh-1 fw-600">Your taxes</h1>
      <div className="text-14 text-light-1 lh-14">
        You are required to collect and pay the following taxes on bookings:
      </div>

      <div className="overflow-scroll scroll-bar-1 pt-10">
        <table className="table-2 col-12 text-12">
          <thead>
            <tr>
              <th>Taxing authority</th>
              <th>Government level</th>
              <th>Tax rate</th>
              <th>Tax type</th>
              <th>Taxable amounts</th>
              <th>Effective date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="text-12">{row.authority}</td>
                <td className="text-12">{row.government_level}</td>
                <td className="text-12">{row.rate}</td>
                <td className="text-12">{row.type}</td>
                <td className="text-12">{row.amount}</td>
                <td>
                  <span className="rounded-100 px-10 text-center col-12 text-12 fw-500 bg-dark-blue text-white">
                    {row.effective_date}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-14 text-light-1 lh-14">
        How would you like to manage your taxes?
        <span className="fw-500 text-10 text-white bg-dark-blue px-10 ml-10 rounded-100">
          New!
        </span>
      </div>

      {taxOptions.map((item, index) => (
        <div key={index} className="col-sm-7">
          <div
            className={
              "rounded-8 px-15 py-15 d-flex items-start gap-2 cursor-pointer " +
              (taxOption == item.id ? "border-blue-1" : "border-light")
            }
            onClick={() => setTaxOption(item.id)}
          >
            <Radio checked={taxOption == item.id} className="px-0 py-0" />
            <div>
              <div className="d-flex justify-between items-center">
                <div>
                  <h1 className="text-14 fw-500 lh-14">{item.title}</h1>
                  <div className="text-12 lh-14 text-light-1">
                    {item.subtitle}
                  </div>
                </div>
                <div className="text-12 lh-14 text-light-1">
                  Powered by
                  <span className="text-dark-yellow ml-5">
                    {item.poweredBy}
                  </span>
                </div>
              </div>
              <div className="text-12 lh-14 mt-5">{item.description}</div>
            </div>
          </div>
        </div>
      ))}

      <div className="border-top-light mt-15 pt-15 d-flex justify-end gap-2">
        <button className="bg-white border-light rounded-8 px-15 py-5 text-14 fw-500">
          Cancel
        </button>
        <button className="text-white bg-blue-1 rounded-8 px-15 py-5 text-14">
          Save
        </button>
      </div>
    </div>
  );
};

export default Taxes;
