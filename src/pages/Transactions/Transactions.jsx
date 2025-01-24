import React, { useEffect, useState } from "react";
import baseAxios from "../../baseAxios";
import "../../styles/fonts.css";
import "./Transactions.css";
import Pagination from "../../components/common/pagination/pagination.jsx";

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
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // ** 금액 포맷 함수 **
  const formatAmount = (amount) => {
    if (isNaN(Number(amount))) return "N/A";

    const color = amount >= 0 ? "#277C78" : "#201F24";
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

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  return (
    <div className="Transactions">
      <h2 id="TransactionTitle" className="textPreset4Bold">Transactions</h2>

      <div className="mainBox">
        {error && <div className="errorMessage textPreset5">{error}</div>}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p className="textPreset5">Loading...</p>
          </div>
        ) : (
          <div>
            {/* 헤더 */}
            <div className="transactionHeader">
              <div className="headerItem textPreset5">Recipient / Sender</div>
              <div className="headerItem textPreset5" id="CategoryTitle">Category</div>
              <div className="headerItem textPreset5" id="DateTitle">Transaction Date</div>
              <div className="headerItem textPreset5" id="amountTitle">Amount</div>
            </div>

            {/* 데이터 리스트 */}
            <div className="transactionList">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div key={transaction._id} className="transactionContainer">
                    <div className="personInfo">
                      <img
                        src={transaction.avatar}
                        alt={`${transaction.name} avatar`}
                        className="personImg"
                      />
                    </div>
                    <div key={transaction._id} className="transactionRow">
                      <div className="rowItem personName textPreset4Bold">{transaction.name}</div>
                      <div className="rowItem CategoryDateInfo textPreset5">{transaction.category}</div>
                      <div className="rowItem CategoryDateInfo textPreset5">{formatDate(transaction.date)}</div>
                      <div className="rowItem amountInfo textPreset4Bold">{formatAmount(transaction.amount)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="noTransactions textPreset5">No transactions available.</div>
              )}
            </div>
          </div>
        )}
        
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}

export default Transactions;
