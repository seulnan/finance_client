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

  // 초기 퍼센트 설정
  useEffect(() => {
    if (targetAmount > 0) {
      const initialPercentage = ((currentAmount / targetAmount) * 100).toFixed(2);
      setCurrentPercentage(initialPercentage);
      setNewPercentage(initialPercentage);
      console.log("✅ 초기 퍼센트 설정:", initialPercentage);
    }
  }, [currentAmount, targetAmount]);

  // 금액 입력 시 새로운 퍼센트 계산
  useEffect(() => {
    const inputAmount = parseFloat(amount || 0);
    if (isNaN(inputAmount) || targetAmount === 0) return;

    const updatedAmount = type === "add"
      ? currentAmount + inputAmount
      : currentAmount - inputAmount;

    const updatedPercentage = ((updatedAmount / targetAmount) * 100);
    setNewPercentage(updatedPercentage);

    console.log("📊 입력된 금액:", inputAmount);
    console.log("📊 업데이트된 금액:", updatedAmount);
    console.log("📊 새로운 퍼센트:", updatedPercentage);
  }, [amount, currentAmount, targetAmount, type]);

  // API 요청 처리
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

      setCurrentPercentage(newPercentage); // ✅ API 요청 후 Progress Bar 업데이트
      onSuccess();
    } catch (error) {
      console.error("❌ 서버 오류:", error);
      alert("Error: Could not update the pot.");
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
              style={{
                width: `${currentPercentage}%`,
                transition: "width 0.5s ease-in-out",
              }}
            />

            {/* ✅ 감소 또는 증가가 발생하면 구분선 추가 */}
            {newPercentage !== currentPercentage && (
              <div
                className="ProgressBarDivider"
                style={{
                  left: `${newPercentage}%`,
                }}
              />
            )}

            {/* ✅ 입력 값이 존재할 때만 바를 추가 또는 제거 */}
            {!isNaN(parseFloat(amount)) && (
              <>
                {/* ✅ 증가한 금액 (초록색) */}
                {newPercentage > currentPercentage && (
                  <>
                    <div
                      className="ProgressBarChange increase"
                      style={{
                        width: `${newPercentage - currentPercentage}%`,
                        left: `${currentPercentage}%`,
                        transition: "width 0.5s ease-in-out, left 0.5s ease-in-out",
                      }}
                    ></div>

                    {/* ✅ 증가할 때 기존 바의 오른쪽에도 구분선 추가 */}
                    <div
                      className="ProgressBarDivider"
                      style={{
                        left: `${currentPercentage}%`, // ✅ 기존 바 끝에 구분선 표시
                      }}
                    />
                  </>
                )}

                {/* ✅ 감소한 금액 (빨간색) */}
                {newPercentage < currentPercentage && (
                  <div
                    className="ProgressBarChange decrease"
                    style={{
                      width: `${currentPercentage - newPercentage}%`,
                      left: `${newPercentage}%`,
                      background: "var(--red)",
                      transition: "width 0.5s ease-in-out, left 0.5s ease-in-out",
                    }}
                  ></div>
                )}
              </>
            )}
          </div>

          <div className="ProgressBarText">
            <span
              className="PercentageText"
              style={{
                color:
                  !isNaN(parseFloat(amount))
                    ? type === "add"
                      ? "var(--green)"
                      : "var(--red)"
                    : "var(--grey-500)", 
              }}
            >
              {newPercentage.toFixed(2)}%
            </span>
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
