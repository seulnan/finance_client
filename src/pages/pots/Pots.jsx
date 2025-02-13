import React, { useState } from "react";
import PotAddModal from "../../components/common/potModal/PotAddModal.jsx"; // 모달 파일 import

const Pots = () => {
  const [modalType, setModalType] = useState(null);
  const [selectedPot, setSelectedPot] = useState(null);

  const handleOpenModal = (type, pot = null) => {
    setModalType(type);
    setSelectedPot(pot);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedPot(null);
  };

  return (
    <div>
      <h1>Pots</h1>

      {/* Add Pot 버튼 */}
      <button onClick={() => handleOpenModal("add")}>Add Pot</button>

      {/* 임시 Pot 리스트 */}
      <div>
        <h2>My Pots</h2>
        <div>
          <p>Rainy Days</p>
          <button onClick={() => handleOpenModal("edit", { name: "Rainy Days", color: "Green", target: 2000 })}>
            Edit
          </button>
          <button onClick={() => handleOpenModal("delete", { name: "Rainy Days" })}>Delete</button>
        </div>
        <div>
          <p>Vacation Fund</p>
          <button onClick={() => handleOpenModal("edit", { name: "Vacation Fund", color: "Blue", target: 5000 })}>
            Edit
          </button>
          <button onClick={() => handleOpenModal("delete", { name: "Vacation Fund" })}>Delete</button>
        </div>
      </div>

      {/* PotAddModal 모달 연결 */}
      {modalType && (
        <PotAddModal type={modalType} pot={selectedPot} onClose={handleCloseModal} onSuccess={handleCloseModal} />
      )}
    </div>
  );
};

export default Pots;
