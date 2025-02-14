import React, { useEffect, useState } from "react";
import baseAxios from "../../../baseAxios";
import "./BillsOverview.css";

const BillsOverview = ({ setPaidBills, setTotalUpcoming, setDueSoon }) => {
  const [bills, setBills] = useState([]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [upcomingAmount, setUpcomingAmount] = useState(0);
  const [dueSoonAmount, setDueSoonAmount] = useState(0);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await baseAxios.get("/api/recurring");
        const billsData = response.data || [];
        setBills(billsData);

        const today = new Date();
        const fiveDaysLater = new Date();
        fiveDaysLater.setDate(today.getDate() + 5);

        const paid = billsData.filter(bill => new Date(bill.date) < today);
        const upcoming = billsData.filter(bill => new Date(bill.date) >= today);
        const dueSoonList = upcoming.filter(bill => new Date(bill.date) <= fiveDaysLater);

        const paidTotal = paid.reduce((sum, bill) => sum + Math.abs(parseFloat(bill.amount)), 0).toFixed(2);
        const upcomingTotal = upcoming.reduce((sum, bill) => sum + Math.abs(parseFloat(bill.amount)), 0).toFixed(2);
        const dueSoonTotal = dueSoonList.reduce((sum, bill) => sum + Math.abs(parseFloat(bill.amount)), 0).toFixed(2);

        setPaidAmount(paidTotal);
        setUpcomingAmount(upcomingTotal);
        setDueSoonAmount(dueSoonTotal);

        setPaidBills(paidTotal);
        setTotalUpcoming(upcomingTotal);
        setDueSoon(dueSoonTotal);
      } catch (error) {
        console.error("Failed to fetch recurring bills", error);
      }
    };
    fetchBills();
  }, [setPaidBills, setTotalUpcoming, setDueSoon]);

  return (
    <div className="BillsOverviewContainer">
      <div className="BillsOverviewHeader">
        <h2>Recurring Bills</h2>
        <button className="SeeDetails">See Details →</button>
      </div>
      <div className="BillsList">
        <div className="BillItem">
          <span>Paid Bills</span>
          <span className="BillAmount">${paidAmount}</span>
        </div>
        <div className="BillItem">
          <span>Total Upcoming</span>
          <span className="BillAmount">${upcomingAmount}</span>
        </div>
        <div className="BillItem">
          <span>Due Soon</span>
          <span className="BillAmount">${dueSoonAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default BillsOverview;
