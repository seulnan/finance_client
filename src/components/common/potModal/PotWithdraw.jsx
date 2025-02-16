import React, { useState } from "react";
import baseAxios from "../../../baseAxios.js"; // ✅ baseAxios 대신 axios 직접 사용
import SearchField from "../searchField/SearchField.jsx"; // ✅ SearchField 적용
import "../potModal/PotWithdraw.css"; // 기존 CSS 재사용

const PotWithdraw = ({ type, pot, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    const updatedData = { amount: Number(amount) };// ✅ amount만 보내도록 수정

    const endpoint =
      type === "add"
        ? `/api/pot/${pot._id}/add-savings`
        : `/api/pot/${pot._id}/withdraw-savings`;

    try {
      console.log(`🔄 요청 전송: ${endpoint}`, updatedData); // ✅ 요청 로그 추가

      const response = await baseAxios.patch(endpoint, updatedData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ 업데이트된 Pot:", response.data);
      alert("Pot updated successfully!");
      onSuccess();
    } catch (error) {
      if (error.response) {
        console.error("❌ 서버 오류:", error.response.data.message);
        alert(`Error: ${error.response.data.message}`); // ✅ 서버에서 보낸 오류 메시지 표시
      } else {
        console.error("❌ 네트워크 오류: 서버에 연결할 수 없음.");
        alert("Error: Could not connect to server.");
      }
    }
  };

  return (
    <div className="Modal">
      <div className="ModalContent">
        <div className="ModalHeader">
          <h2>{type === "add" ? "Add to ‘Savings’" : "Withdraw from ‘Savings’"}</h2>
          <button className="CloseButton" onClick={onClose}></button>
        </div>

        <div className="ExplainBox">
          {type === "add"
            ? "Add funds to your savings pot."
            : "Withdraw funds from your savings pot."}
        </div>

        <div className="FormGroup">
          <div className="Title">New Amount</div>
          <div className = "Money">
            ${type === "add"
              ? (parseFloat(pot.currentAmount) + parseFloat(amount || 0)).toFixed(2)
              : (parseFloat(pot.currentAmount) - parseFloat(amount || 0)).toFixed(2)}
          </div>
        </div>

        <div className="FormGroup">
          <div className="Title">Amount to {type === "add" ? "Add" : "Withdraw"}</div>
          <SearchField
            type="icon-left"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button className="ModalSubmitButton" onClick={handleSubmit}>
          {type === "add" ? "Confirm Addition" : "Confirm Withdrawal"}
        </button>
      </div>
    </div>
  );
};

export default PotWithdraw;
