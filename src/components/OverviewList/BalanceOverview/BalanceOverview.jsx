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
      <div className="BalanceOverview dark">
        <p>Current Balance</p>
        <h2>${parseFloat(overview.currentBalance).toLocaleString()}</h2>
      </div>
      <div className="BalanceOverview">
        <p>Income</p>
        <h2>${parseFloat(overview.income).toLocaleString()}</h2>
      </div>
      <div className="BalanceOverview">
        <p>Expenses</p>
        <h2>${parseFloat(overview.expenses).toLocaleString()}</h2>
      </div>
    </div>
  );
};

export default BalanceOverview;
