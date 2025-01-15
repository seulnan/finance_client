import React, { useEffect, useState } from "react";
import baseAxios from "../baseAxios";

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

  // ** 페이지 변경 함수 (다음/이전 페이지 버튼) **
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
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Transactions</h2>

      {error && (
        <div style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center" }}>
          <div className="spinner"></div> {/* 로딩 스피너 */}
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Recipient / Sender</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Category</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Transaction Date</th>
                <th style={{ padding: "10px", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td style={{ padding: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={transaction.avatar}
                          alt={`${transaction.name} avatar`}
                          style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }}
                        />
                        {transaction.name}
                      </div>
                    </td>
                    <td style={{ padding: "10px" }}>{transaction.category}</td>
                    <td style={{ padding: "10px" }}>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td style={{ padding: "10px", textAlign: "right", color: transaction.amount < 0 ? "red" : "green" }}>
                      {transaction.amount < 0 ? `-$${Math.abs(transaction.amount).toFixed(2)}` : `+$${transaction.amount.toFixed(2)}`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "gray" }}>
                    No transactions available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              style={{
                padding: "10px 20px",
                backgroundColor: page === 1 ? "#ccc" : "#277C78",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: page === 1 ? "default" : "pointer",
              }}
            >
              Previous
            </button>
            <span style={{ alignSelf: "center" }}>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              style={{
                padding: "10px 20px",
                backgroundColor: page === totalPages ? "#ccc" : "#277C78",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: page === totalPages ? "default" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Transactions;
