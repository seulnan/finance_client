import React, { useState, useEffect } from "react";
import BaseAxios from "../../baseAxios.js";
import PotAddModal from "../../components/common/potModal/PotAddModal.jsx";
import PotWithdrawModal from "../../components/common/potModal/PotWithdraw.jsx";
import MeatballMenu from "../../components/common/meatballMenu/MeatballMenu.jsx";
import "../pots/Pots.css";
import "../../styles/colors.css"; // ✅ 색상 변수 파일 가져오기

const Pots = () => {
  const [pots, setPots] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedPot, setSelectedPot] = useState(null);

  // ✅ 색상 매핑 (colorMap)
  const colorMap = {
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
    Grey: "var(--grey-500)",
    Army: "var(--army-green)",
    Pink: "var(--magenta)",
    Gold: "var(--gold)",
    Orange: "var(--orange)",
  };

  // ✅ Pot 데이터 불러오는 함수
  const fetchPots = async () => {
    try {
      console.log("🔄 Fetching latest pots data...");
      const response = await BaseAxios.get("/api/pot"); // API 호출
      setPots(response.data);
      console.log("✅ Updated pots:", response.data);
    } catch (error) {
      console.error("❌ Failed to fetch pots:", error);
    }
  };

  // ✅ 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchPots();
  }, []);

  // ✅ 모달 열기
  const handleOpenModal = (type, pot = null) => {
    setModalType(type);
    setSelectedPot(pot);
  };

  // ✅ 모달 닫기 및 데이터 새로고침
  const handleSuccess = () => {
    console.log("✅ Fetching pots after update...");
    fetchPots(); // 최신 데이터 불러오기
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedPot(null);
  };

  return (
    <div className="BudgetContainer">
      <div className="BudgetHeaderOne">
        <h1 className="BudgetTitle">Pots</h1>
        <button className="AddBudgetButton" onClick={() => handleOpenModal("add")}>
          + Add New Pot
        </button>
      </div>

      <div className="PotsContainer">
        {pots.map((pot) => {
          const progress = ((pot.currentAmount / pot.target) * 100).toFixed(1);
          const potColor = colorMap[pot.color] || "var(--grey-300)"; // ✅ colorMap에서 색상 가져오기

          return (
            <div key={pot._id} className="PotCard">
              <div className="PotHeader">
                <div className="PotTitleContainer">
                  <span className="PotCircle" style={{ backgroundColor: potColor }}></span>
                  <span className="PotTitle">{pot.name}</span>
                </div>
                <MeatballMenu
                  onEdit={() => handleOpenModal("edit", pot)}
                  onDelete={() => handleOpenModal("delete", pot)}
                />
              </div>
              <div className='Total'>
              <span className="TotalSaved">Total Saved</span>
              <span className="Money">${pot.currentAmount}</span>
              </div>
              <div className="PotProgressContainer">
                <div
                  className="PotProgressBar"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: potColor, // ✅ colorMap에서 가져온 색상 적용
                  }}
                />
              </div>
              <div className = 'Target'>
                <span className = 'Percentage'>{progress}%</span>
                <span className = 'TargetOf'>Target of ${pot.target}</span> 
              </div>
              
              <div className='AWButtonContainer'>
                <button className = 'AWButton' onClick={() => handleOpenModal("add-money", pot)}>+ Add Money</button>
                <button className = 'AWButton' onClick={() => handleOpenModal("withdraw", pot)}>Withdraw</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ PotAddModal */}
      {modalType === "add" || modalType === "edit" || modalType === "delete" ? (
        <PotAddModal type={modalType} pot={selectedPot} onClose={handleCloseModal} onSuccess={handleSuccess} />
      ) : null}

      {/* ✅ PotWithdrawModal */}
      {modalType === "withdraw" || modalType === "add-money" ? (
        <PotWithdrawModal type={modalType === "withdraw" ? "withdraw" : "add"} pot={selectedPot} onClose={handleCloseModal} onSuccess={handleSuccess} />
      ) : null}
    </div>
  );
};

export default Pots;
