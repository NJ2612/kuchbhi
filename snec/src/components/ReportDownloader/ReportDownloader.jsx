import React, { useState } from "react";
import "./ReportDownloader.css";

export default function ReportDownloader({ onDownloadClick, showDownloadDialog, setShowDownloadDialog }) {
  const [customRangeMode, setCustomRangeMode] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const resetDialog = () => {
    setCustomRangeMode(false);
    setCustomStart("");
    setCustomEnd("");
    setShowDownloadDialog(false);
  };

  const triggerDownload = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadOption = (range) => {
    if (range === "custom") {
      setCustomRangeMode(true);
      return;
    }
    if (range) {
      const downloadUrl = `http://localhost:8000/api/reports/download?range=${range}`;
      triggerDownload(downloadUrl);
    }
    resetDialog();
  };

  const handleCustomDownload = () => {
    if (!customStart || !customEnd) {
      alert("Please select both start and end dates.");
      return;
    }
    const range = JSON.stringify({ start: customStart, end: customEnd });
    const downloadUrl = `http://localhost:8000/api/reports/download?range=${encodeURIComponent(range)}`;
    triggerDownload(downloadUrl);
    resetDialog();
  };

  return (
    <>
      <button className="report-downloader-btn" onClick={onDownloadClick}>
        <i className="fa-solid fa-file-arrow-down" style={{ marginRight: "8px" }}></i>
        Download Report
      </button>

      {showDownloadDialog && (
        <div id="download-dialog" className="modal">
          <div className="modal-content">
            <h3>Select Report Period</h3>
            <div className="button-group">
              <button onClick={() => handleDownloadOption("week")}>Weekly</button>
              <button onClick={() => handleDownloadOption("month")}>Monthly</button>
              <button onClick={() => handleDownloadOption("year")}>Yearly</button>
              <button onClick={() => handleDownloadOption("custom")}>Custom Range</button>
              <button onClick={() => handleDownloadOption(null)}>Cancel</button>
            </div>

            {customRangeMode && (
              <div className="custom-date-modal-center">
                <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Select Custom Date Range</h3>
                <div className="custom-date-fields">
                  <div className="custom-date-row">
                    <label className="custom-date-label" htmlFor="custom-start">Start Date:</label>
                    <input
                      className="custom-date-input"
                      type="date"
                      id="custom-start"
                      value={customStart}
                      onChange={e => setCustomStart(e.target.value)}
                      placeholder="dd-mm-yyyy"
                    />
                  </div>
                  <div className="custom-date-row">
                    <label className="custom-date-label" htmlFor="custom-end">End Date:</label>
                    <input
                      className="custom-date-input"
                      type="date"
                      id="custom-end"
                      value={customEnd}
                      onChange={e => setCustomEnd(e.target.value)}
                      placeholder="dd-mm-yyyy"
                    />
                  </div>
                  <button className="custom-range-download-btn" onClick={handleCustomDownload}>
                    <i className="fa-solid fa-download" style={{ marginRight: "8px" }}></i>
                    Download Custom Range
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
