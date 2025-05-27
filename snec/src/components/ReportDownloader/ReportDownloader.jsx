import React, { useState } from "react";

export default function ReportDownloader() {
  const [range, setRange] = useState("month");
  const [format, setFormat] = useState("pdf");

  const handleDownload = () => {
    const params = new URLSearchParams({ range, format });
    const url = `http://localhost:8080/api/reports/download?${params.toString()}`;

    const a = document.createElement("a");
    a.href = url;
    a.download = `event-report.${format === "excel" ? "xlsx" : "pdf"}`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ marginTop: "30px", textAlign: "center" }}>
      <h3>📁 Download Event Report</h3>
      <label>
        Time Range:&nbsp;
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </label>
      &nbsp;&nbsp;
      <label>
        Format:&nbsp;
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="pdf">PDF</option>
          <option value="excel">Excel</option>
        </select>
      </label>
      <br />
      <br />
      <button onClick={handleDownload}>⬇️ Download Report</button>
    </div>
  );
}
