import React, { useEffect, useState } from "react";
import baseAxios from "../../baseAxios";
import "../../styles/fonts.css";
import "./Transactions.css";
import Pagination from "../../components/common/pagination/pagination.jsx"; // 분리된 Pagination 컴포넌트

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ** API 호출 함수 **
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await baseAxios.get(`/api/transaction?page=${page}&limit=${limit}`);
      const data = response.data;
      setTransactions(data.transactions || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ** 날짜 포맷 함수 **
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" }; // "20 Aug 2024" 형식
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // ** 금액 포맷 함수 **
  const formatAmount = (amount) => {
    if (isNaN(Number(amount))) return "N/A";

    const color = amount >= 0 ? "#277C78" : "#201F24"; // 양수는 녹색, 음수는 검정
    const sign = amount >= 0 ? "+" : "-";

    return (
      <span style={{ color }} className="textPreset4Bold">
        {`${sign}$${Math.abs(Number(amount)).toFixed(2)}`}
      </span>
    );
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
    <div className="Transactions">
      <h2 id="TransactionTitle">Transactions</h2>

      <div className="mainBox">
        {error && <div className="errorMessage">{error}</div>}

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
                    transactions.map((transaction) => (
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
                        <td className="textPreset5 CategoryDateInfo">{formatDate(transaction.date)}</td>
                        <td className="amountInfo">{formatAmount(transaction.amount)}</td>
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

            {/* Pagination 컴포넌트 */}
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;
