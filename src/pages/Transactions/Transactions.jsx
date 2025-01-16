import React, { useEffect, useState } from "react";
import baseAxios from "../../baseAxios";
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

  // ** 날짜 포맷 함수 **
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" }; // 20 Aug 2024 형식
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // ** 금액 포맷 함수 **
  const formatAmount = (amount) => {
    if (isNaN(Number(amount))) return "N/A";

    const color = amount >= 0 ? "#277C78" : "#201F24"; // +는 녹색, -는 검정
    const sign = amount >= 0 ? "+" : "-";

    return (
      <span className="textPreset4Bold" style={{ color }}>
        {`${sign}$${Math.abs(Number(amount)).toFixed(2)}`}
      </span>
    );
  };

  return (
    <div>
      <h2>Transactions</h2>

      <div className="mainBox">
        {/* 에러 메시지 */}
        {error && (
          <div className="errorMessage">
            {error}
          </div>
        )}

        {/* 로딩 상태 */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div> {/* 로딩 스피너 */}
            <p>Loading...</p>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: "24px" }}> {/* spacing/300 */}
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
                      <tr
                        key={transaction._id}
                        style={{
                          borderBottom: index === transactions.length - 1 ? "none" : "1px solid #F2F2F2", // 마지막 행 제외
                        }}
                      >
                        <td className="textPreset4Bold personInfo">
                          <div className="imgName">
                            <img src={transaction.avatar} alt={`${transaction.name} avatar`}/>
                            {transaction.name}
                          </div>
                        </td>
                        <td className="textPreset5 CategoryDateInfo">
                          {transaction.category}
                        </td>
                        <td className="textPreset5 CategoryDateInfo">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="amountInfo">
                          {formatAmount(transaction.amount)}
                        </td>
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
            <div className="pagination"> {/* spacing/300 */}
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                style={{
                  backgroundColor: page === 1 ? "#ccc" : "#277C78",
                  cursor: page === 1 ? "default" : "pointer",
                }}
              >
                Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                style={{
                  backgroundColor: page === totalPages ? "#ccc" : "#277C78",
                  cursor: page === totalPages ? "default" : "pointer",
                }}
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
