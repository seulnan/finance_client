import React, { useState, useEffect } from "react";
import baseAxios from "../../baseAxios.js";
import { useNavigate } from "react-router-dom";
import BudgetsOverview from "../../components/OverviewList/BudgetsOverview/BudgetsOverview.jsx";
import "./Overview.css";

const Overview = () => {
  const [budgetData, setBudgetData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      const response = await baseAxios.get("/api/budget");
      console.log("API 응답 JSON:", response.data);

      if (!response.data || !Array.isArray(response.data)) {
        console.error("❌ API 응답 형식이 잘못되었습니다.", response.data);
        return;
      }

      setBudgetData(response.data);
    } catch (error) {
      console.error("❌ API 요청 실패:", error);
    }
  };

  // 총 사용 금액 및 한도 계산
  const totalLimit = budgetData.reduce((sum, budget) => sum + parseFloat(budget.limit || 0), 0);
  const totalUsed = budgetData.reduce((sum, budget) => sum + parseFloat(budget.used || 0), 0);

  return (
    <div className="OverviewPage">
      <div className="OverviewHeader">
        <h1>Overview</h1>
      </div>
      <BudgetsOverview budgetData={budgetData} totalUsed={totalUsed} totalLimit={totalLimit} />
    </div>
  );
};

export default Overview;
