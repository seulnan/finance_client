import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import baseAxios from "../../../baseAxios";
import "./TransOverview.css";
import nextIcon from "../../../assets/images/nextIcon.png";

const TransOverview = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await baseAxios.get("/api/transaction"); // ✅ 엔드포인트 수정
        console.log("API 응답 데이터:", response.data);
        setTransactions(response.data.transactions || []); // ✅ 구조 맞춤
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };
    fetchTransactions();
  }, []);

  // 날짜 포맷 함수 (Transactions.jsx 참고)
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // 금액 포맷 함수 (Transactions.jsx 참고)
  const formatAmount = (amount) => {
    const sign = amount >= 0 ? "+" : "-";
    return `${sign}$${Math.abs(amount).toFixed(2)}`;
  };

  return (
    <div className="TransOverviewContainer">
      <div className="TransOverviewHeader">
        <p className="OverviewsListTitles textPreset2">Transactions</p>
        <button className="textPreset4 SeeDetails" onClick={() => navigate("/transactions")}>
          View All <img src={nextIcon} alt="Next" className="SeeDetailsIcon" />
        </button>
      </div>
      <div className="TransOverviewList">
        {transactions.slice(0, 5).map((transaction) => (
          <div key={transaction._id} className="TransOverviewItem">
            <div className="TransOverviewPersonInfo">
              <img 
                src={transaction.avatar}
                alt={transaction.name} 
                className="TransOverviewIcon" 
              />
              <span className="textPreset4Bold">{transaction.name}</span>
            </div>
            <div className="TransOverviewDetails">
              <span className={`TransAmount textPreset4Bold ${transaction.amount >= 0 ? "positive" : "negative"}`}>
                {formatAmount(transaction.amount)}
              </span>
              <span className="textPreset4 TransOverviewDate">{formatDate(transaction.date)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransOverview;
