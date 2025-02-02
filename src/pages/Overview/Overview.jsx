import React, { useState, useEffect } from "react";
import baseAxios from "../../baseAxios.js";
import { useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import "../../styles/colors.css"; // 색상 변수 적용
import "../Overview/Overview.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

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

  // Chart.js 색상 매핑 (CSS 변수 사용)
  const colormap = {
    Beige500: "#98908B",
    Beige100: "#F8F4F0",
    Grey900: "#201F24",
    Grey500: "#696868",
    Grey300: "#B3B3B3",
    Grey100: "#F2F2F2",
    Green: "#277C78",
    Yellow: "#F2CDAC",
    Cyan: "#82C9D7",
    Navy: "#626070",
    Red: "#C94736",
    Purple: "#826CB0",
    Turquoise: "#597C7C",
    Brown: "#93674F",
    Magenta: "#934F6F",
    Blue: "#3F82B2",
    NavyGrey: "#97A0AC",
    ArmyGreen: "#7F9161",
    Gold: "#CAB361",
    Orange: "#BE6C49",
    White: "#FFFFFF",
    Pink: "#9C6C7C",
  };

  // 도넛 차트 데이터 생성 (각 요소별 색상 적용)
  const chartData = {
    labels: budgetData.map((budget) => budget.name),
    datasets: [
      {
        data: budgetData.map((budget) => budget.used),
        backgroundColor: budgetData.map((budget) => colormap[budget.color] || "var(--grey-300)"),
        hoverBackgroundColor: budgetData.map((budget) => colormap[budget.color] || "var(--grey-500)"),
        borderColor: "#FFFFFF", // 구분선 색상 (흰색)
        hoverBorderColor: "#FFFFFF", // hover 시 강조
        borderWidth: 0, // 테두리 두께
      },
    ],
  };

  // 차트 옵션 (중앙 텍스트 추가)
  const chartOptions = {
    cutout: "70%", // 도넛 형태 만들기
    plugins: {
      legend: {
        display: false, // 범례 숨김
      },
    },
  };

  return (
    <div className="OverviewPage">
      <div className="OverviewHeader">
        <h1>Overview</h1>
      </div>

      <div className="BudgetOverviewContainer">
        <div className="BudgetHeader">
          <h2>Budgets</h2>
          <button className="SeeDetails" onClick={() => navigate("/budgets")}>
            See Details →
          </button>
        </div>
        <div className="BudgetContent">
          <div className="BudgetChart">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="BudgetChartCenter">
              <strong className="BudgetUsed">${totalUsed}</strong>
              <span className="BudgetLimit">of ${totalLimit} limit</span>
            </div>
          </div>
          <div className="BudgetList">
            {budgetData.map((budget) => (
              <div key={budget._id} className="BudgetItem">
                <span className="BudgetColor" style={{ background: colormap[budget.color] || "var(--grey-300)" }}></span>
                <div className="BudgetInfo">
                  <span>{budget.name}</span>
                  <strong>${parseFloat(budget.used).toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
