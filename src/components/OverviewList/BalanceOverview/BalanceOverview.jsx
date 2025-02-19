import React, { useState, useEffect } from "react";
import baseAxios from "../../../baseAxios";
import "./BalanceOverview.css"; // 스타일 파일

const BalanceOverview = () => {
  const [overview, setOverview] = useState({
    currentBalance: "0.00",
    income: "0.00",
    expenses: "0.00",
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await baseAxios.get("/api/overview");
        setOverview(response.data);
      } catch (error) {
        console.error("Failed to fetch overview data:", error);
      }
    };

    fetchOverview();
  }, []);

  return (
    <div className="BalanceOverviewContainer">
      <div className="BalanceOverview" id="CurrentBalance">
        <p className="BalanceOverviewTitle textPreset4" id="CurrentBalanceTitle">Current Balance</p>
        <p className="BalanceOverviewItem textPreset1" id="CurrentBalanceItem">${parseFloat(overview.currentBalance).toLocaleString()}</p>
      </div>
      <div className="BalanceOverview">
        <p className="BalanceOverviewTitle textPreset4">Income</p>
        <p className="BalanceOverviewItem textPreset1">${parseFloat(overview.income).toLocaleString()}</p>
      </div>
      <div className="BalanceOverview">
        <p className="BalanceOverviewTitle textPreset4">Expenses</p>
        <p className="BalanceOverviewItem textPreset1">${parseFloat(overview.expenses).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default BalanceOverview;
