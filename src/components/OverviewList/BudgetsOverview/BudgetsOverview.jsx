import React from "react";
import { useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./BudgetsOverview.css"; // 새로운 CSS 파일 import
import nextIcon from "../../../assets/images/nextIcon.png";

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetsOverview = ({ budgetData, totalUsed, totalLimit }) => {
  const navigate = useNavigate();

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
        borderColor: "#FFFFFF",
        hoverBorderColor: "#FFFFFF",
        borderWidth: 0,
      },
    ],
  };

  // 차트 옵션 (중앙 텍스트 추가)
  const chartOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="BudgetOverviewContainer">
      <div className="BudgetHeader">
        <span className = 'Title'>Budgets</span>
        <button className="textPreset4 SeeDetails" onClick={() => navigate("/budgets")}> 
          See Details <img src={nextIcon} alt="Next" className="SeeDetailsIcon" />
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
                <span className='BudgetName'>{budget.name}</span>
                <span className ='BudgetMoney'>${parseFloat(budget.used).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetsOverview;
