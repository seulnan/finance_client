import React, { useEffect, useState } from "react";
import baseAxios from "../../../baseAxios";
import { useNavigate } from "react-router-dom";
import "./PotsOverview.css";
import { ReactComponent as PotIcon } from "../../../assets/images/IconsPotColor.svg";
import nextIcon from "../../../assets/images/nextIcon.png";

const colormap = {
  Red: "#C94736",
  Blue: "#3F82B2",
  Green: "#277C78",
  Yellow: "#F2CDAC",
  Purple: "#826CB0",
  Cyan: "#82C9D7",
  Orange: "#BE6C49",
  Grey: "#696868",
  Brown: "#93674F",
  Pink: "#9C6C7C",
  Navy: "#626070",
  Gold: "#CAB361",
};

const PotOverview = () => {
  const navigate = useNavigate();
  const [pots, setPots] = useState([]);
  const [totalSaved, setTotalSaved] = useState(0);

  useEffect(() => {
    const fetchPots = async () => {
      try {
        const response = await baseAxios.get("/api/pot");
        setPots(response.data);

        const total = response.data.reduce((acc, pot) => acc + parseFloat(pot.currentAmount), 0);
        setTotalSaved(total);
      } catch (error) {
        console.error("Error fetching pots:", error);
      }
    };

    fetchPots();
  }, []);

  return (
    <div className="PotOverviewContainer">
      <div className="PotOverviewHeader">
        <span className="Title">Pots</span>
        <button className="textPreset4 SeeDetails" onClick={() => navigate("/pots")}>
          See Details <img src={nextIcon} alt="Next" className="SeeDetailsIcon" />
        </button>
      </div>
      <div className="PotOverviewContent">
        <div className="PotOverviewTotal">
          <PotIcon className="PotIcon" />
          <div className="TotalInfo">
            <span className="TotalLabel">Total Saved</span>
            <span className="TotalAmount">${totalSaved.toFixed(2)}</span>
          </div>
        </div>
        <div className="PotOverviewList">
          <div className="PotOverviewScroll">
            {pots.map((pot) => (
              <div key={pot._id} className="PotItem">
                <span
                  className="PotColor"
                  style={{ background: colormap[pot.color] || "#B3B3B3" }}
                ></span>
                <div className="PotInfo">
                  <span className="PotName">{pot.name}</span>
                  <span className="PotAmount">${parseFloat(pot.currentAmount).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PotOverview;
