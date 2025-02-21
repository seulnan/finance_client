import React, { useState, useEffect } from "react";
import prevIcon from "../../../assets/images/prevIcon.png";
import nextIcon from "../../../assets/images/nextIcon.png";
import "./pagination.css";

const Pagination = ({ page, totalPages, onPageChange }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 675);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 675);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPageNumbers = () => {
    console.log("isMobile 상태:", isMobile);
    console.log("현재 페이지:", page);

    // ✅ totalPages가 5 이하일 때도 모바일이면 `...`을 적용하도록 수정!
    if (totalPages <= 5 && !isMobile) {
      console.log("🔴 totalPages가 5 이하 (PC) → 전체 표시");
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (isMobile) {
      if (page <= 2) {
        console.log("🟢 1, 2페이지 → [1, 2, '...', totalPages]");
        return [1, 2, "...", totalPages]; 
      }

      if (page === 3) {
        console.log("🟢 3페이지 → [2, 3, '...', totalPages]");
        return [2, 3, "...", totalPages];
      }

      if (page >= 4) {
        console.log("🟢 4, 5페이지 → ['...', 3, 4, 5]");
        return ["...", 3, 4, 5];
      }
    } 
    
    console.log("🔵 PC 환경 → 전체 표시");
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  console.log("페이지네이션 버튼:", getPageNumbers()); 

  return (
    <div className="pagination">
      {/* Prev 버튼 */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`paginationButton prevButton ${page === 1 ? "disabled" : ""}`}
      >
        <img src={prevIcon} alt="Prev" className="paginationIcon" />
        Prev
      </button>

      {/* 페이지 번호 버튼 */}
      <div className="pageNumbers">
        {getPageNumbers().map((pageNumber, index) => (
          <span key={index}>
            {pageNumber === "..." ? (
              <span className="dots">...</span>
            ) : (
              <button
                onClick={() => onPageChange(pageNumber)}
                className={`pageButton ${pageNumber === page ? "currentPage" : ""}`}
              >
                {pageNumber}
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Next 버튼 */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`paginationButton nextButton ${page === totalPages ? "disabled" : ""}`}
      >
        Next
        <img src={nextIcon} alt="Next" className="paginationIcon" />
      </button>
    </div>
  );
};

export default Pagination;
