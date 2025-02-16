import React, { useState, useEffect } from "react";
import BaseAxios from "../../baseAxios.js";
import PotAddModal from "../../components/common/potModal/PotAddModal.jsx";
import PotWithdrawModal from "../../components/common/potModal/PotWithdraw.jsx";
import MeatballMenu from "../../components/common/meatballMenu/MeatballMenu.jsx";
import "../pots/Pots.css";

const Pots = () => {
  const [pots, setPots] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedPot, setSelectedPot] = useState(null);

  // ✅ Pot 데이터 불러오는 함수
  const fetchPots = async () => {
    try {
      console.log("🔄 Fetching latest pots data...");
      const response = await BaseAxios.get("/api/pot");
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
    fetchPots(); // ✅ 최신 데이터 불러오기
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedPot(null);
  };

  return (
    <div>
      <h1>Pots</h1>
      <button onClick={() => handleOpenModal("add")}>+ Add New Pot</button>

      {/* Pot 리스트 */}
      <div className="PotsContainer">
        {pots.map((pot) => (
          <div key={pot._id} className="PotCard">
            <div className="PotHeader">
              <h3>{pot.name}</h3>
              {/* 미트볼 메뉴 */}
              <MeatballMenu
                onEdit={() => handleOpenModal("edit", pot)}
                onDelete={() => handleOpenModal("delete", pot)}
              />
            </div>
            <p>Total Saved</p>
            <h2>${pot.currentAmount}</h2>
            <p>{((pot.currentAmount / pot.target) * 100).toFixed(1)}% Target of ${pot.target}</p>
            <button onClick={() => handleOpenModal("add-money", pot)}>+ Add Money</button>
            <button onClick={() => handleOpenModal("withdraw", pot)}>Withdraw</button>
          </div>
        ))}
      </div>

      {/* ✅ PotAddModal (추가/수정/삭제) */}
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
