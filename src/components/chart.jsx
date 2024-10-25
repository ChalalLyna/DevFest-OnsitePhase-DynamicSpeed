import {
    Card,
    CardBody,
    CardHeader,
    Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";

const chartConfig = {
    type: "line",
    height: 240,
    series: [
        {
            name: "Client 1",
            data: [3, 2, 5, 2, 8, 9, 8, 7, 4], // Sample data for Client 1
            color: "#C7F5C7", // Line color for Client 1
        },
        {
            name: "Client 2",
            data: [8, 6, 8, 9, 2, 10, 7, 6, 4], // Sample data for Client 2
            color: "#3EA0A3", // Line color for Client 2
        },
    ],
    options: {
        chart: {
            toolbar: {
                show: false,
            },
        },
        title: {
            show: "",
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            lineCap: "round",
            curve: "smooth",
        },
        markers: {
            size: 0,
        },
        xaxis: {
            categories: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM", "12 AM"], // Adjusted time intervals
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            labels: {
                style: {
                    colors: "#616161",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    fontWeight: 400,
                },
            },
        },
        yaxis: {
            min: 0,
            max: 10, // Set the bandwidth scale from 0 to 10 kbps
            labels: {
                formatter: (value) => `${value} kbps`, // Add 'kbps' to Y-axis labels
                style: {
                    colors: "#616161",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    fontWeight: 400,
                },
            },
        },
        grid: {
            show: true,
            borderColor: "#dddddd",
            strokeDashArray: 5,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            padding: {
                top: 5,
                right: 20,
            },
        },
        fill: {
            opacity: 0.8,
        },
        tooltip: {
            theme: "dark",
        },
    },
};

export default function ChartComponent() {
    return (
        <div className="bg-white w-96 rounded-md">
            <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
            >
                <div>
                    <h1 className="font-semibold ml-6">
                        Connection speed by client over time
                    </h1>
                </div>
            </CardHeader>
            <CardBody className="px-2 pb-0">
                <Chart {...chartConfig} />
                
            </CardBody>
        </div>
    );
}
