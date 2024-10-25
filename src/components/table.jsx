import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Typography } from "@material-tailwind/react";

// Adjusted table headers as specified
const TABLE_HEAD = ["DID", "Date", "Time", "MIR", "BW Requested (kbps)", "BW Allocated", "Usage indicator"];

export default function Table() {
  const [rows, setRows] = useState([]); // State to store rows from API
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ DID: '', date: '', time: '' }); // Filters state

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      console.log("Attempting to fetch data from the API...");

      try {
        const response = await axios.get("http://localhost:5000/bandwidth");
        console.log("API response received:", response);

        const data = response.data;
        console.log("Data from API:", data);

        // Transform data into the format needed for the table
        const formattedRows = data.map((record) => {
          const date = new Date(record.timestamp);
          const formattedDate = date.toISOString().split("T")[0];
          const formattedTime = date.toTimeString().split(" ")[0].substring(0, 5);

          return [
            record.clientId, // DID
            formattedDate, // Date
            formattedTime, // Time
            record.bandwidthRequested.toFixed(1), // BW Requested, formatted to 1 decimal place
            record.mir.toFixed(1), // MIR, formatted to 1 decimal place
            record.allocatedBandwidth.toFixed(1) // BW Allocated, formatted to 1 decimal place
          ];
        });

        console.log("Formatted rows for table:", formattedRows);

        setRows(formattedRows);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bandwidth data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Function to filter rows based on the selected filters
  const filteredRows = rows.filter(row => {
    const [clientId, date, time] = row;
    const dateMatch = filters.date ? date === filters.date : true;
    const timeMatch = filters.time ? time === filters.time : true;
    const clientIdMatch = filters.DID ? clientId.toString() === filters.DID : true;

    return dateMatch && timeMatch && clientIdMatch;
  });

  return (
    <div className="bg-white w-2/3 p-6 rounded-md">
      <div>
        <h1 className="font-semibold ml-6 mb-6">Connection speed by client over time</h1>
      </div>

      {/* Filters */}
      <div className="flex mb-4 space-x-4">
        <input
          type="number"
          name="DID"
          value={filters.DID}
          onChange={handleFilterChange}
          placeholder="DID"
          className="border p-2 rounded"
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
