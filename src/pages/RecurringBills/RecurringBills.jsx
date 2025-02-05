import React, { useEffect, useState } from "react";
import baseAxios from "../../baseAxios";
import SearchField from "../../components/common/searchField/SearchField.jsx";
import Dropdown from "../../components/common/dropdown/dropdown.jsx";
import "../../styles/fonts.css";
import "./RecurringBills.css";

function RecurringBills() {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [sortOption, setSortOption] = useState("Latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sortOptions = [
    { value: "Latest", label: "Latest" },
    { value: "Oldest", label: "Oldest" },
    { value: "Highest", label: "Highest" },
    { value: "Lowest", label: "Lowest" },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `Monthly - ${date.getDate()}${["st", "nd", "rd"][((date.getDate() + 90) % 100 - 10) % 10 - 1] || "th"}`;
  };

  const formatAmount = (amount) => {
    const isNegative = parseFloat(amount) < 0;
    return (
      <span style={{ color: isNegative ? "#C94736" : "#277C78" }}>
        {`$${Math.abs(amount).toFixed(2)}`}
      </span>
    );
  };

  const fetchBills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await baseAxios.get("/api/recurring");
      setBills(response.data || []);
    } catch (error) {
      setError("Failed to fetch recurring bills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    let filtered = [...bills];
    if (searchQuery.trim()) {
      filtered = filtered.filter((bill) =>
        bill.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredBills(filtered);
  }, [bills, searchQuery]);

  return (
    <div className="RecurringBills">
      <h2 className="title">Recurring Bills</h2>
      <div className="summaryBox">
        <div className="totalBills">
          <p>Total Bills</p>
          <h1>$384.98</h1>
        </div>
        <div className="summaryDetails">
          <p>Paid Bills: <span>4 ($190.00)</span></p>
          <p>Total Upcoming: <span>4 ($194.98)</span></p>
          <p className="dueSoon">Due Soon: <span>2 ($59.98)</span></p>
        </div>
      </div>
      <div className="recurringBillsMain">
        <div className="searchFilters">
          <SearchField placeholder="Search bills" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Dropdown label="Sort By" options={sortOptions} value={sortOption} onChange={setSortOption} />
        </div>
        <div className="billsHeader">
          <span>Bill Title</span>
          <span>Due Date</span>
          <span>Amount</span>
        </div>
        <div className="billsList">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : filteredBills.length > 0 ? (
            filteredBills.map((bill) => (
              <div key={bill._id} className="billContainer">
                <div className="billInfo">
                  <img src={bill.avatar} alt={bill.name} className="billImg" />
                  <span>{bill.name}</span>
                </div>
                <span className="billDate">{formatDate(bill.date)}</span>
                <span className="billAmount">{formatAmount(bill.amount)}</span>
              </div>
            ))
          ) : (
            <p>No recurring bills available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecurringBills;
