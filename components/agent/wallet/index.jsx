"use client";

import WalletCard from "./WalletCard";
import AgentDashboardLayout from "../common/layout";
import { useState } from "react";
import { Drawer, Dialog, Radio } from "@mui/material";
import Filter from "@/components/agent/common/Filter";
import FormInput from "@/components/common/form/FormInput";
import { CreditCard, SwapVert } from "@mui/icons-material";

const index = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const handleClose = () => {
    setOpenFilter(false);
  };

  const [openModal, setOpenModal] = useState(false);

  const handleModalClose = () => {
    setOpenModal(false);
  };
  const [modalContent, setModalContent] = useState(<></>);

  const data = [
    {
      title: "Available Balance",
      amount: "$2,450.00",
      improve: "+12.5% from last month",
      icon: "/img/dashboard/icons/1.svg",
    },
    {
      title: "Total Deposits",
      amount: "$5,230.00",
      improve: "+18.3% from last month",
      icon: "/img/dashboard/icons/2.svg",
    },
    {
      title: "Total withdrawals",
      amount: "$2,780.00",
      improve: "+5.2% from last month",
      icon: "/img/dashboard/icons/3.svg",
    },
    {
      title: "Pending Transactions",
      amount: "$250.00",
      improve: "-3.7% from last month",
      icon: "/img/dashboard/icons/4.svg",
    },
  ];

  const transactions = [
    {
      transaction_id: "TRK-12345",
      type: "Deposit",
      amount: "$500.00",
      status: "Computed",
      date: "2024-04-15",
      description: "Wallet top-up via credit card",
    },
    {
      transaction_id: "TRK-12346",
      type: "Withdrawal",
      amount: "$250.00",
      status: "Pending",
      date: "2024-04-16",
      description: "Withdrawal request to bank account",
    },
    {
      transaction_id: "TRK-12347",
      type: "Booking Payment",
      amount: "$320.00",
      status: "Computed",
      date: "2024-04-10",
      description: "Payment for booking #BK-12347",
    },
    {
      transaction_id: "TRK-12348",
      type: "Commission",
      amount: "$78.00",
      status: "Computed",
      date: "2024-04-12",
      description: "Commission from booking #BK-12348",
    },
    {
      transaction_id: "TRK-12349",
      type: "Deposit",
      amount: "$1,000.00",
      status: "Computed",
      date: "2024-04-18",
      description: "Wallet top-up via bank transfer",
    },
    {
      transaction_id: "TRK-12350",
      type: "Withdrawal",
      amount: "$680.00",
      status: "Failed",
      date: "2024-04-20",
      description: "Withdrawal request failed - insufficient",
    },
  ];

  const colorStatus = (status) => {
    switch (status) {
      case "Computed":
        return "bg-green-4 text-green-2";
      case "Pending":
        return "bg-yellow-4 text-dark-yellow";
      case "Failed":
        return "bg-error-1 text-error-2";
      default:
        return "bg-light-2 text-light-2";
    }
  };

  return (
    <AgentDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Wallet</h1>
          <div className="text-14 lh-14 text-light-1">
            Manage your wallet and transactions
          </div>
        </div>
        <div className="col-auto ms-auto">
          <button
            className="button border-blue-1 text-blue-1 px-15 py-10 rounded-8"
            onClick={() => setOpenFilter(true)}
          >
            Filter
          </button>
          <Drawer anchor="right" open={openFilter} onClose={handleClose}>
            <div className="w-300 rounded-left rounded-8 bg-white px-20 py-20 h-100 d-flex flex-column justify-between">
              <Filter />
              <div className="col-12 d-flex justify-end gap-2">
                <button
                  className="border-light rounded-8 py-5 px-15 text-14"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-1 text-white rounded-8 py-5 px-15 text-14"
                  onClick={handleClose}
                >
                  Save
                </button>
              </div>
            </div>
          </Drawer>
        </div>
        <div className="col-auto">
          <button className="button bg-blue-1 text-white fw-400 px-15 py-10 rounded-8">
            Export Data
          </button>
        </div>
      </div>

      <WalletCard data={data} />

      <div className="row y-gap-10 x-gap-15 mt-20">
        <div className="col-md-6 col-sm-12">
          <div className="border-light px-20 py-20 rounded-8 bg-white h-100">
            <div className="text-22 lh-14 fw-500">Quick Actions</div>
            <div className="text-12 lh-14 text-light-1">
              Manage your wallet operations
            </div>
            <div className="row y-gap-10 x-gap-10 mt-10">
              <div className="col-sm-6">
                <button
                  className="button bg-blue-1 text-white px-15 py-10 rounded-8 w-100"
                  onClick={() => {
                    setModalContent(
                      <AddFunds handleClose={handleModalClose} />
                    );
                    setOpenModal(true);
                  }}
                >
                  Add Funds
                </button>
              </div>
              <div className="col-sm-6">
                <button
                  className="button border-light px-15 py-10 rounded-8 w-100"
                  onClick={() => {
                    setModalContent(
                      <WithdrawFunds handleClose={handleModalClose} />
                    );
                    setOpenModal(true);
                  }}
                >
                  Withdraw Funds
                </button>
              </div>
              <div className="col-sm-6">
                <button className="button border-light px-15 py-10 rounded-8 w-100">
                  Transfer Funds
                </button>
              </div>
              <div className="col-sm-6">
                <button className="button border-light px-15 py-10 rounded-8 w-100">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="border-light px-20 py-20 rounded-8 bg-white h-100">
            <div className="text-22 lh-14 fw-500">Loyalty Points</div>
            <div className="text-12 lh-14 text-light-1">
              Earn and redeem points for rewards
            </div>
            <div className="d-flex justify-between items-center mt-10">
              <div className="text-14 fw-500">Available Points</div>
              <div className="text-14 fw-500">1,250 pts</div>
            </div>

            <div className="position-relative w-100 mt-10">
              <div className="py-5 rounded-100 bg-light-2 w-100"></div>
              <div className="py-5 rounded-100 bg-dark-blue w-50 position-absolute top-0 start-0"></div>
            </div>
            <div className="text-12 text-light-1 lh-14 mt-10">
              750 more points until next tier
            </div>

            <div className="d-flex justify-between items-center mt-10">
              <div className="text-14 fw-500">Points Earned This Month</div>
              <div className="text-14 fw-500">350 pts</div>
            </div>
            <div className="d-flex justify-between items-center mt-10">
              <div className="text-14 fw-500">Points Redeemed</div>
              <div className="text-14 fw-500">500 pts</div>
            </div>

            <button className="button border-light px-15 py-10 rounded-8 w-100 mt-10">
              Redeem Points
            </button>
          </div>
        </div>

        <div className="col-12">
          <div className="bg-white rounded-8 border-light px-15 py-15">
            <div className="overflow-scroll scroll-bar-1">
              <table className="table-2 col-12 text-14">
                <thead className="text-nowrap">
                  <tr className="text-light-1 fw-600">
                    <th>Transaction ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((row, index) => (
                    <tr key={index}>
                      <td className="align-middle">{row.transaction_id}</td>
                      <td className="align-middle">{row.type}</td>
                      <td className="align-middle">{row.amount}</td>
                      <td className="align-middle">
                        <span
                          className={`rounded-100 px-15 text-center text-12 ${colorStatus(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="align-middle">{row.date}</td>
                      <td className="align-middle">{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={openModal} onClose={handleModalClose}>
        {modalContent}
      </Dialog>
    </AgentDashboardLayout>
  );
};

const AddFunds = ({ handleClose }) => {
  const [payemtType, setPaymentType] = useState("card");
  return (
    <div className="px-20 py-20 w-500 sm:w-full">
      <div className="text-20 lh-14 fw-500">Add Funds to Wallet</div>
      <div className="text-14 lh-14 text-light-1">
        Top up your wallet balance to make bookings for your clients.
      </div>
      <div className="row x-gap-10 y-gap-10 items-center">
        <FormInput
          label="Amount"
          type="number"
          step={0.01}
          gridClass="col-12 mt-20"
          placeholder="Enter amount"
        />

        <div className="col-12 mt-10">
          <h1 className="text-14 lh-12 fw-500">Payment Method</h1>
          <button
            className="border-light rounded-8 py-10 px-15 text-14 w-100 mt-10"
            onClick={() => setPaymentType("card")}
          >
            <div className="d-flex items-center gap-2 fw-500">
              <Radio className="px-0 py-0" checked={payemtType === "card"} />
              <CreditCard className="px-0 py-0 text-light-1" />
              Credit/Debit Card
            </div>
          </button>
          <button
            className="border-light rounded-8 py-10 px-15 text-14 w-100 mt-10"
            onClick={() => setPaymentType("bank")}
          >
            <div className="d-flex items-center gap-2 fw-500">
              <Radio className="px-0 py-0" checked={payemtType === "bank"} />
              <SwapVert className="px-0 py-0 text-light-1" />
              Bank Transfer
            </div>
          </button>
        </div>

        <div className="col-12 mt-10">
          <h1 className="text-14 lh-12 fw-500">Card Number</h1>
          <input
            type="text"
            className="border-light rounded-8 px-10 py-5 w-100 mt-10"
            placeholder="4242 4242 4242 4242"
          />
        </div>

        <div className="col-6 mt-10">
          <h1 className="text-14 lh-12 fw-500">Expiry Date</h1>
          <input
            type="text"
            className="border-light rounded-8 px-10 py-5 w-100 mt-10"
            placeholder="MM/YY"
          />
        </div>

        <div className="col-6 mt-10">
          <h1 className="text-14 lh-12 fw-500">CVC</h1>
          <input
            type="text"
            className="border-light rounded-8 px-10 py-5 w-100 mt-10"
            placeholder="123"
          />
        </div>

        <div className="d-flex justify-end gap-2 mt-10">
          <button
            className="text-14 border-light rounded-8 px-10 py-5"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="text-14 bg-blue-1 text-white rounded-8 px-10 py-5 fw-400"
            onClick={handleClose}
          >
            Add Funds
          </button>
        </div>
      </div>
    </div>
  );
};

const WithdrawFunds = ({ handleClose }) => {
  return (
    <div className="px-20 py-20 w-500 sm:w-full">
      <div className="text-20 lh-14 fw-500">Withdraw Funds</div>
      <div className="text-14 lh-14 text-light-1">
        Withdraw funds from your wallet to your bank account.
      </div>
      <div className="row x-gap-10 y-gap-10 items-center">
        <FormInput
          label="Amount"
          type="number"
          step={0.01}
          gridClass="col-12 mt-20"
          placeholder="Enter amount"
        />

        <div className="col-12 mt-10">
          <h1 className="text-14 lh-12 fw-500">Bank Account</h1>
          <select className="form-select border-light rounded-8 px-10 py-10 w-100 mt-10">
            <option value="1234 5678 9012 3456">1234 5678 9012 3456</option>
          </select>
        </div>

        <div className="col-12 mt-10">
          <h1 className="text-14 lh-12 fw-500">Notes (Optional)</h1>
          <input
            type="text"
            className="border-light rounded-8 px-10 py-5 w-100 mt-10"
            placeholder="Add notes for withdrawal"
          />
        </div>

        <div className="d-flex justify-end gap-2 mt-10">
          <button
            className="text-14 border-light rounded-8 px-10 py-5"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="text-14 bg-blue-1 text-white rounded-8 px-10 py-5 fw-400"
            onClick={handleClose}
          >
            Withdraw Funds
          </button>
        </div>
      </div>
    </div>
  );
};

export default index;
