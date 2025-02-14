import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import baseAxios from "../../../baseAxios";
import "./BillsOverview.css";
import nextIcon from "../../../assets/images/nextIcon.png";

const BillsOverview = ({ setPaidBills, setTotalUpcoming, setDueSoon }) => {
  const navigate = useNavigate();
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
        <p className="OverviewsListTitles textPreset2">Recurring Bills</p>
        <button className="textPreset4 SeeDetails" onClick={() => navigate("/RecurringBills")}>
          See Details <img src={nextIcon} alt="Next" className="SeeDetailsIcon" />
        </button>
      </div>
      <div className="BillsOverviewList">
        <div className="BillsOverviewItem" id="BillsOverviewPaidBills">
          <span className="textPreset4 BillsOverviewItemTitle">Paid Bills</span>
          <span className="BillAmount textPreset4Bold">${paidAmount}</span>
        </div>
        <div className="BillsOverviewItem" id="BillsOverviewUpcoming">
          <span className="textPreset4 BillsOverviewItemTitle">Total Upcoming</span>
          <span className="BillAmount textPreset4Bold">${upcomingAmount}</span>
        </div>
        <div className="BillsOverviewItem" id="BillsOverviewDueSoon">
          <span className="textPreset4 BillsOverviewItemTitle">Due Soon</span>
          <span className="BillAmount textPreset4Bold">${dueSoonAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default BillsOverview;
