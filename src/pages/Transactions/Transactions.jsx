import React, { useEffect, useState } from "react";
import baseAxios from "../../baseAxios";
import prevIcon from "../../assets/images/prevIcon.png";
import nextIcon from "../../assets/images/nextIcon.png";
import "../../styles/fonts.css";
import "./Transactions.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]); // 거래 데이터
  const [page, setPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const limit = 10; // 한 페이지에 표시할 데이터 수
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 메시지

  // ** API 호출 함수 **
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null); // 기존 에러 초기화
    try {
      const response = await baseAxios.get(`/api/transaction?page=${page}&limit=${limit}`);
      const data = response.data;
      setTransactions(data.transactions || []); // 거래 내역 설정
      setTotalPages(data.totalPages || 1); // 총 페이지 수 설정
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ** 페이지 변경 함수 **
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // ** 컴포넌트 마운트 시 첫 API 호출 **
  useEffect(() => {
    fetchTransactions();
  }, [page]);

  return (
    <div>
      <h2>Transactions</h2>

      <div className="mainBox">
        {/* 에러 메시지 */}
        {error && <div className="errorMessage">{error}</div>}

        {/* 로딩 상태 */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <table className="table">
                <thead>
                  <tr className="textPreset5 titles">
                    <th id="personTitle">Recipient / Sender</th>
                    <th className="CategoryDate">Category</th>
                    <th className="CategoryDate">Transaction Date</th>
                    <th id="amountTitle">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={transaction._id} className="transactionRow">
                        <td className="textPreset4Bold personInfo">
                          <div className="imgName">
                            <img
                              src={transaction.avatar}
                              alt={`${transaction.name} avatar`}
                              className="personImg"
                            />
                            {transaction.name}
                          </div>
                        </td>
                        <td className="textPreset5 CategoryDateInfo">{transaction.category}</td>
                        <td className="textPreset5 CategoryDateInfo">{transaction.date}</td>
                        <td className="amountInfo">{transaction.amount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="noTransactions">
                        No transactions available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            <div className="pagination">
              {/* Prev 버튼 */}
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className={`paginationButton prevButton ${page === 1 ? "disabled" : ""}`}
              >
                Prev
              </button>

              {/* 페이지 번호 버튼 */}
              <div className="pageNumbers">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`pageButton ${pageNumber === page ? "currentPage" : ""}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              {/* Next 버튼 */}
              <button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                className={`paginationButton nextButton ${page === totalPages ? "disabled" : ""}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;
