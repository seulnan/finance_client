import React, { useState, useEffect, useRef } from "react";
import baseAxios from "../../baseAxios.js";
import { useNavigate } from "react-router-dom";
import "../../styles/colors.css";
import "../Overview/Overview.css";

const Overview = () => {
  const [BudgetData, SetBudgetData] = useState([]);
  const CanvasRef = useRef(null);
  const Navigate = useNavigate();

  useEffect(() => {
    FetchBudgetData();
  }, []);

  const FetchBudgetData = async () => {
    try {
      const Response = await baseAxios.get("/api/budget");
      console.log("API 응답 JSON:", Response.data);

      if (!Response.data || !Array.isArray(Response.data)) {
        console.error("❌ API 응답 형식이 잘못되었습니다.", Response.data);
        return;
      }

      SetBudgetData(Response.data);
    } catch (Error) {
      console.error("❌ API 요청 실패:", Error);
    }
  };

  useEffect(() => {
    if (BudgetData.length > 0) {
      DrawBudgetChart();
    }
  }, [BudgetData]);

  const GetColorVariable = (Color) => {
    const ColorMap = {
      Green: "var(--green)",
      Yellow: "var(--yellow)",
      Cyan: "var(--cyan)",
      Navy: "var(--navy)",
      Red: "var(--red)",
      Purple: "var(--purple)",
      Turquoise: "var(--turquoise)",
      Brown: "var(--brown)",
      Magenta: "var(--magenta)",
      Blue: "var(--blue)",
      Grey: "var(--grey-900)",
      Army: "var(--army-green)",
      Pink: "var(--pink)",
      Gold: "var(--gold)",
      Orange: "var(--orange)",
    };
    return ColorMap[Color] || "var(--grey-300)";
  };

  const DrawBudgetChart = () => {
    if (!BudgetData.length || !CanvasRef.current) return;

    const Canvas = CanvasRef.current;
    const Ctx = Canvas.getContext("2d");

    const TotalLimit = BudgetData.reduce((Sum, Budget) => Sum + parseFloat(Budget.limit), 0);
    const TotalUsed = BudgetData.reduce((Sum, Budget) => Sum + parseFloat(Budget.used), 0);

    let StartAngle = -Math.PI / 2;

    Ctx.clearRect(0, 0, Canvas.width, Canvas.height);

    BudgetData.forEach((Budget) => {
      const Angle = (parseFloat(Budget.used) / TotalLimit) * 2 * Math.PI;
      Ctx.beginPath();
      Ctx.moveTo(100, 100);
      Ctx.arc(100, 100, 80, StartAngle, StartAngle + Angle);
      Ctx.fillStyle = GetColorVariable(Budget.color);
      Ctx.fill();
      StartAngle += Angle;
    });

    // 내부 텍스트
    Ctx.fillStyle = "var(--grey-900)";
    Ctx.font = "bold 22px Arial";
    Ctx.textAlign = "center";
    Ctx.fillText(`$${TotalUsed}`, 100, 100);
    Ctx.font = "12px Arial";
    Ctx.fillText(`of $${TotalLimit} limit`, 100, 120);
  };

  return (
    <div className="BudgetOverviewContainer">
      <div className="BudgetHeader">
        <h2>Budgets</h2>
        <button className="SeeDetails" onClick={() => Navigate("/budgets")}>
          See Details →
        </button>
      </div>
      <div className="BudgetContent">
        <canvas ref={CanvasRef} width={200} height={200} className="BudgetChart" />
        <div className="BudgetList">
          {BudgetData.map((Budget) => (
            <div key={Budget._id} className="BudgetItem">
              <span className="BudgetColor" style={{ background: GetColorVariable(Budget.color) }}></span>
              <div className="BudgetInfo">
                <p>{Budget.name}</p>
                <strong>${parseFloat(Budget.used).toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
