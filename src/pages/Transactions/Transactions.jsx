import React, { useEffect, useState } from "react";
import baseAxios from "../../baseAxios";
import "../../styles/fonts.css"; // fonts.css 파일을 import합니다.

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
      <h2 style={{ margin: "8px 0px 40px", fontSize: "32px" }}>Transactions</h2>

      <div
        style={{
          padding: "32px", // 내부 여백 (spacing/400)
          backgroundColor: "#fff", // 박스 배경색
          borderRadius: "8px", // 모서리 둥글게
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // 박스 그림자
        }}
      >
        {/* 에러 메시지 */}
        {error && (
          <div style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {/* 로딩 상태 */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "32px" }}> {/* spacing/400 */}
            <div className="spinner"></div> {/* 로딩 스피너 */}
            <p>Loading...</p>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: "24px" }}> {/* spacing/300 */}
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    className="textPreset5"
                    style={{
                      color: "#696868", // 제목 색상
                      borderBottom: "2px solid #F2F2F2", // 제목과 항목들 사이 구분선
                    }}
                  >
                    <th style={{ padding: "12px 0px 12px 16px", textAlign: "left" }}>Recipient / Sender</th>
                    <th style={{ padding: "12px 0px", textAlign: "left" }}>Category</th>
                    <th style={{ padding: "12px 0px", textAlign: "left" }}>Transaction Date</th>
                    <th style={{ padding: "12px 16px 12px 0px", textAlign: "right" }}>Amount</th>
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
                        <td
                          className="textPreset4Bold"
                          style={{
                            padding: "16px 0px 16px 12px", // spacing/200
                            color: "#201F24", // Recipient / Sender 항목 색상
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                              src={transaction.avatar}
                              alt={`${transaction.name} avatar`}
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                marginRight: "16px", // spacing/200
                              }}
                            />
                            {transaction.name}
                          </div>
                        </td>
                        <td
                          className="textPreset5"
                          style={{
                            padding: "16px 0px",
                            color: "#696868", // Category 항목 색상
                          }}
                        >
                          {transaction.category}
                        </td>
                        <td
                          className="textPreset5"
                          style={{
                            padding: "16px 0px",
                            color: "#696868", // Transaction Date 항목 색상
                          }}
                        >
                          {formatDate(transaction.date)}
                        </td>
                        <td style={{ padding: "16px 12px 16px 0px", textAlign: "right" }}>
                          {formatAmount(transaction.amount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          textAlign: "center",
                          padding: "32px", // spacing/400
                          color: "gray",
                        }}
                      >
                        No transactions available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}> {/* spacing/300 */}
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
              <span>Page {page} of {totalPages}</span>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;
