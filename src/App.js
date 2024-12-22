// import './App.css';
// import { Routes, Route } from "react-router-dom";
// import About from "./routes/About";
// import Careers from "./routes/Careers";
// import Home from "./routes/Home";
// import Navbar from './Navbar';
// function App() {
//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/upload" element={<Upload />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/careers" element={<Careers />} />
//       </Routes>
//     </>
//   );
// }
// export default App;
import React, { useState } from "react";
import Papa from "papaparse";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

function App() {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Parse CSV
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data.map((row) => ({
          ...row,
          Winnings_Non_Ticket: parseFloat(row["Winnings_Non_Ticket"].replace("$", "")) || 0,
          Winnings_Ticket: parseFloat(row["Winnings_Ticket"].replace("$", "")) || 0,
        }));
        setData(parsedData);

        // Analyze data for chart
        const winningsBySport = parsedData.reduce((acc, row) => {
          const sport = row["Sport"];
          const winnings = row.Winnings_Non_Ticket + row.Winnings_Ticket;
          acc[sport] = (acc[sport] || 0) + winnings;
          return acc;
        }, {});

        // Convert to array format for charting
        const chartDataArray = Object.entries(winningsBySport).map(([sport, totalWinnings]) => ({
          sport,
          totalWinnings,
        }));
        setChartData(chartDataArray);
      },
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>DraftKings Contest Analyzer</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} style={{ marginBottom: "20px" }} />

      {data.length > 0 && (
        <>
          <h2>Total Winnings by Sport</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sport" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalWinnings" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <h2>Data Table</h2>
          <table border="1" style={{ width: "100%", textAlign: "left", marginTop: "20px" }}>
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;