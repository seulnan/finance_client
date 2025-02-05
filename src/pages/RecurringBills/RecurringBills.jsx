import React, { useEffect, useState } from "react";
import baseAxios from "../../baseAxios";
import SearchField from "../../components/common/searchField/SearchField.jsx";
import Dropdown from "../../components/common/dropdown/dropdown.jsx";
import "../../styles/fonts.css";
import "./RecurringBills.css";
import totalBillsIcon from "../../assets/images/totalBillsIcon.svg";

function RecurringBills() {
  const [bills, setBills] = useState([]);
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

  useEffect(() => {
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
    fetchBills();
  }, []);

  const calculateSummary = (type) => {
    if (!bills || bills.length === 0) return { count: 0, totalAmount: "0.00" };
    const filteredBills = bills.filter(bill => bill.type && bill.type === type);
    const count = filteredBills.length;
    const totalAmount = filteredBills.reduce((sum, bill) => {
      const amount = parseFloat(bill.amount);
      return isNaN(amount) ? sum : sum + Math.abs(amount);
    }, 0).toFixed(2);
    return { count, totalAmount };
  };

  const paidSummary = calculateSummary("paid");
  const upcomingSummary = calculateSummary("upcoming");
  const payableSummary = calculateSummary("payable");
  const totalAmount = bills.reduce((sum, bill) => {
    const amount = parseFloat(bill.amount);
    return isNaN(amount) ? sum : sum + Math.abs(amount);
  }, 0).toFixed(2);

  return (
    <div className="RecurringBills">
      <h2 className="title textPreset4Bold">Recurring Bills</h2>
      <div className="BillsBoxes">
        <div className="summaryBox">
          <div className="totalBills">
            <img src={totalBillsIcon} alt="Total Bills" />
            <p id="totalTitle" className="textPreset4">Total Bills</p>
            <h1 id="totalBills" className="textPreset1">${totalAmount}</h1>
          </div>
          <div className="summaryDetails">
            <p id="SummaryTitle" className="textPreset3">Summary</p>
            <div className="SummaryContent">
              <p className="textPreset5">
                Paid Bills
                <span className="textPreset5Bold">{paidSummary.count} (${paidSummary.totalAmount})</span>
              </p>
              <hr className="divider" />
              <p className="textPreset5">
                Total Upcoming
                <span className="textPreset5Bold">{upcomingSummary.count + payableSummary.count} (${(parseFloat(upcomingSummary.totalAmount) + parseFloat(payableSummary.totalAmount)).toFixed(2)})</span>
              </p>
              <hr className="divider" />
              <p className="textPreset5 dueSoon">
                Due Soon
                <span className="textPreset5Bold dueSoon">{upcomingSummary.count} (${upcomingSummary.totalAmount})</span>
              </p>
            </div>
          </div>
        </div>
        <div className="recurringBillsMain">
          <div className="searchFilters">
            <SearchField placeholder="Search bills" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <Dropdown label="Sort By" options={sortOptions} value={sortOption} onChange={setSortOption} />
          </div>
          <div className="billsHeader">
            <span className="textPreset5" id="BillTitle">Bill Title</span>
            <span className="textPreset5" id="BillDueTitle">Due Date</span>
            <span className="textPreset5" id="BillAmountTitle">Amount</span>
          </div>
          <div className="billsList">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : bills.length > 0 ? (
              bills.map((bill) => (
                <div key={bill._id} className="billContainer">
                  <div className="billInfo">
                    <img src={bill.avatar} alt={bill.name} className="billImg" />
                    <span className="textPreset4Bold">{bill.name}</span>
                  </div>
                  <span className="billDate textPreset5">{new Date(bill.date).toLocaleDateString()}</span>
                  <span className="billAmount textPreset4Bold">${parseFloat(bill.amount).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p>No recurring bills available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecurringBills;
