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
        console.log("API 응답 데이터:", response.data); // 디버깅용 로그 추가
        const billsData = response.data || [];
        setBills(billsData);

        const today = new Date().getDate();
        const fiveDaysLater = new Date();
        fiveDaysLater.setDate(today + 5);
        const fiveDaysLaterDate = fiveDaysLater.getDate();

        const extractDay = (dateString) => parseInt(dateString.match(/\d+/)[0]);

        const paidBills = billsData.filter(bill => extractDay(bill.date) < today);
        const totalUpcomingBills = billsData.filter(bill => extractDay(bill.date) >= today);
        const dueSoonBills = totalUpcomingBills.filter(bill => extractDay(bill.date) <= fiveDaysLaterDate);

        const calculateSummary = (billsArray) => {
          return billsArray.reduce((sum, bill) => sum + Math.abs(parseFloat(bill.amount) || 0), 0).toFixed(2);
        };

        const paidTotal = calculateSummary(paidBills);
        const upcomingTotal = calculateSummary(totalUpcomingBills);
        const dueSoonTotal = calculateSummary(dueSoonBills);

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
