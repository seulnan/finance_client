import React from "react";
import prevIcon from "../../../assets/images/prevIcon.png";
import nextIcon from "../../../assets/images/nextIcon.png";
import "./Pagination.css";

const Pagination = ({ page, totalPages, onPageChange }) => {
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
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`pageButton ${
                pageNumber === page ? "currentPage" : ""
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next 버튼 */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`paginationButton nextButton ${
          page === totalPages ? "disabled" : ""
        }`}
      >
        Next
        <img src={nextIcon} alt="Next" className="paginationIcon" />
      </button>
    </div>
  );
};

export default Pagination;
