import { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import { Card, Typography } from "@material-tailwind/react";

const TABLE_HEAD = ["DID", "Date", "Time", "MIR", "BW Requested (kbps)", "BW Allocated", "Usage indicator"];

export default function Table() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ DID: '', date: '', time: '' });

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/bandwidth");
        const data = response.data;

        const formattedRows = data.map((record) => {
          const date = new Date(record.timestamp);
          const formattedDate = date.toISOString().split("T")[0];
          const formattedTime = date.toTimeString().split(" ")[0].substring(0, 5);

          return [
            record.clientId,
            formattedDate,
            formattedTime,
            record.bandwidthRequested.toFixed(1),
            record.mir.toFixed(1),
            record.allocatedBandwidth.toFixed(1)
          ];
        });

        setRows(formattedRows);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bandwidth data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Filter rows based on selected filters
  const filteredRows = rows.filter(row => {
    const [clientId, date, time] = row;
    const dateMatch = filters.date ? date === filters.date : true;
    const timeMatch = filters.time ? time === filters.time : true;
    const clientIdMatch = filters.DID ? clientId.toString() === filters.DID : true;

    return dateMatch && timeMatch && clientIdMatch;
  });

  // Handle CSV file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (result) => {
        const csvRows = result.data.map((row) => [
          row[0], // DID
          row[1], // Date
          row[2], // Time
          parseFloat(row[3]).toFixed(1), // BW Requested
          parseFloat(row[4]).toFixed(1), // MIR
          parseFloat(row[5]).toFixed(1), // BW Allocated
          row[6]  // Usage Indicator
        ]);

        setRows((prevRows) => [...prevRows, ...csvRows]);
      },
    });
  };

  return (
    <div className="bg-white w-2/3 p-6 rounded-md">
      <h1 className="font-semibold ml-6 mb-6">Bandwidth value by client over time</h1>

      {/* Filters and CSV Upload */}
      <div className="flex mb-4 space-x-4">
        <input
          type="number"
          name="DID"
          value={filters.DID}
          onChange={handleFilterChange}
          placeholder="DID"
          className="border p-2 w-20 rounded"
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="time"
          name="time"
          value={filters.time}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="border p-2 rounded"
        />
      </div>

      {/* Table */}
      <div className="overflow-y-auto h-64">
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <table className="text-center w-full">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      No data available
                    </Typography>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, index) => (
                  <tr key={index}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="p-4 border-b border-blue-gray-50">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {cell}
                        </Typography>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
