import React, { useState, useEffect } from "react";
import baseAxios from "../../../baseAxios.js";
import SearchField from "../searchField/SearchField.jsx";
import "../potModal/PotWithdraw.css";

const PotWithdraw = ({ type, pot, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [newPercentage, setNewPercentage] = useState(0);

  console.log("🔍 pot data:", pot);

  const currentAmount = Number(pot?.currentAmount);
  const targetAmount = Number(pot?.target);

  useEffect(() => {
    if (targetAmount > 0) {
      const initialPercentage = ((currentAmount / targetAmount) * 100).toFixed(2);
      setCurrentPercentage(initialPercentage);
      setNewPercentage(initialPercentage);
    }
  }, [currentAmount, targetAmount]);

  useEffect(() => {
    const inputAmount = parseFloat(amount || 0);
    if (isNaN(inputAmount) || targetAmount === 0) return;

    // ✅ 현재 금액에서 입력된 금액을 더하거나 빼고 새로운 금액을 계산
    const updatedAmount = type === "add"
      ? currentAmount + inputAmount
      : currentAmount - inputAmount;

    // ✅ 새로운 금액이 목표 금액 대비 몇 %인지 계산
    const updatedPercentage = ((updatedAmount / targetAmount) * 100).toFixed(2);

    // ✅ 새로운 퍼센트 설정
    setNewPercentage(updatedPercentage);
  }, [amount, currentAmount, targetAmount, type]);

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const updatedData = { amount: Number(amount) };
    const endpoint =
      type === "add"
        ? `/api/pot/${pot._id}/add-savings`
        : `/api/pot/${pot._id}/withdraw-savings`;

    try {
      console.log(`🔄 요청 전송: ${endpoint}`, updatedData);
      const response = await baseAxios.patch(endpoint, updatedData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ 업데이트된 Pot:", response.data);
      alert("Pot updated successfully!");
      onSuccess();
    } catch (error) {
      if (error.response) {
        console.error("❌ 서버 오류:", error.response.data.message);
        alert(`Error: ${error.response.data.message}`);
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
          <h2>{type === "add" ? `Add to ‘${pot.name}’` : `Withdraw from ‘${pot.name}’`}</h2>
          <button className="CloseButton" onClick={onClose}></button>
        </div>

        <div className="ExplainBox">
          {type === "add"
            ? "Add money to your pot to keep it separate from your main balance."
            : "Withdraw from your pot to put money back in your main balance."}
        </div>

        <div className="FormGroup AmountRow">
          <span className="Title">New Amount</span>
          <span className="Money">
            ${type === "add"
              ? (currentAmount + parseFloat(amount || 0)).toFixed(2)
              : (currentAmount - parseFloat(amount || 0)).toFixed(2)}
          </span>
        </div>

        <div className="ProgressBarContainer">
          <div className="ProgressBarBackground">
            <div
              className="ProgressBarFilled"
              style={{ width: `${currentPercentage}%` }}
            ></div>
            <div
              className={`ProgressBarChange ${type === "add" ? "increase" : "decrease"}`}
              style={{
                width: `${Math.abs(newPercentage - currentPercentage)}%`,
                left: type === "add" ? `${currentPercentage}%` : "0%",
              }}
            ></div>
          </div>
          <div className="ProgressBarText">
            <span className="PercentageText">{newPercentage}%</span>
            <span className="TargetMoney">Target of ${targetAmount.toFixed(2)}</span>
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
