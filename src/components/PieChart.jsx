import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import BandwidthModal from './BandwidthModal'; // Import the modal component
import axios from 'axios'; // Import axios for API calls

export default function PieChartComponent() {
    const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility
    const [clientData, setClientData] = useState([]); // State to hold client data

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/bandwidth");
                console.log("API response received:", response.data); // Log the response data
                setClientData(response.data);
            } catch (error) {
                console.error("Error fetching bandwidth data:", error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run only once when component mounts

    // Handle case when there is no data
    if (clientData.length === 0) {
        return <div>Loading...</div>; 
    }

    const totalBandwidthLimit = 10;

    // Calculate series based on clientData
    const series = clientData.map(client => {
        const bandwidthLimit = client.bandwidthLimit || 0; // Default to 0 if undefined
        console.log(`Client ID: ${client.clientId}, Bandwidth Limit: ${bandwidthLimit}`); // Log client info
        
        if (totalBandwidthLimit > 0) {
            const percentage = (bandwidthLimit * 100) / totalBandwidthLimit;
            console.log(`Calculated Percentage for Client ${client.clientId}: ${percentage.toFixed(2)}%`); // Log percentage calculation
            return parseFloat(percentage.toFixed(2)); // Convert to number and keep two decimal points
        }
        
        return 0; // Default to 0% if totalBandwidthLimit is 0
    });

    // Log the series before adding Not Allocated percentage
    console.log("Allocated Series before Not Allocated:", series); 

    // Calculate Not Allocated percentage
    const totalAllocated = series.reduce((acc, cur) => acc + cur, 0);
    console.log("Total Allocated Percentage:", totalAllocated.toFixed(2)); // Log total allocated percentage

    const notAllocatedPercentage = Math.max(0, (100 - totalAllocated)).toFixed(2); // Ensure it doesn't go below 0
    console.log("Not Allocated Percentage:", notAllocatedPercentage); // Log not allocated percentage

    series.push(parseFloat(notAllocatedPercentage)); // Ensure this is a number

    // Log the final series values
    console.log("Final Series Values:", series); // Log the final series including Not Allocated

    // Set up chart configuration
    const chartConfig = {
        type: "pie",
        height: 240,
        series: series, // Pass calculated series
        options: {
            labels: [...clientData.map(client => `Client ${client.clientId}`), "Not Allocated"],
            colors: ["#C7F5C7", "#3EA0A3", "#EEEEEE"], // Colors for Client 1, Client 2, and Not allocated
            legend: {
                position: 'bottom', // Adjust legend position
                labels: {
                    colors: "#616161",
                    useSeriesColors: false,
                },
            },
            dataLabels: {
                enabled: true,
                formatter: (val) => `${val.toFixed(2)}%`, // Show percentage values
                style: {
                    fontSize: "14px",
                    fontFamily: "inherit",
                    fontWeight: 500,
                    colors: ["#616161"],
                },
                dropShadow: {
                    enabled: false, // Disable shadow so the text is clear
                },
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        offset: -10, // Keep the percentage labels inside the pie chart
                    },
                    expandOnClick: false, // Disable slice expansion on click
                    donut: {
                        labels: {
                            show: false,
                        },
                    },
                    // Disable hover state
                    hover: {
                        enabled: false, // Disable hover state entirely
                    },
                },
            },
            chart: {
                toolbar: {
                    show: false,
                },
            },
            stroke: {
                show: false, // Disable hover stroke effect
            },
            tooltip: {
                enabled: false, // Disable tooltips on hover
            },
            fill: {
                opacity: 1, // Ensure colors are fully visible
            },
            states: {
                hover: {
                    filter: {
                        type: 'none', // Disable hover color change
                    },
                },
            },
        },
    };

    // Log chartConfig to ensure it contains correct values
    console.log("Chart Configuration:", chartConfig);

    const handleOpenModal = () => {
        setModalOpen(true); // Function to open the modal
    };

    const handleCloseModal = () => {
        setModalOpen(false); // Function to close the modal
    };

    return (
        <div className="bg-white w-96 rounded-md">
            <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
            >
                <div>
                    <h1 className="font-semibold ml-6 ">
                        Bandwidth Distribution by Client
                    </h1>
                </div>
            </CardHeader>
            <CardBody className="px-2 pb-0 mb-4">
                <Chart {...chartConfig} />
                <div className="flex justify-center mt-4 ">
                    <button
                        onClick={handleOpenModal} // Open modal on button click
                        className="bg-[#E0E0E2] text-gray-700 p-2 rounded-md text-s"
                    >
                        Change bandwidth maximum value
                    </button>
                </div>
            </CardBody>

            <BandwidthModal 
    isOpen={isModalOpen} 
    onClose={handleCloseModal} 
    onSubmit={(clientId, bandwidth) => {
        // Handle the submission logic here if necessary
        console.log(`Submitted Client ID: ${clientId}, Bandwidth: ${bandwidth}`);
        // Update your state if needed
        // For example, if you're tracking the clientData, you might want to refresh it here
    }}
/>

        </div>
    );
}
