// src/components/ReportingModule/CommunicationFrequencyReport.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import useUserModule from '../UserModule/useUserModule';
import { createObjectCsvStringifier } from 'csv-writer';
import { useTheme } from '@mui/material/styles';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const CommunicationFrequencyReport = () => {
    const { communications, communicationMethods} = useUserModule();
    const theme = useTheme();
    const communicationCount = {};
    communicationMethods.forEach(method => {
        communicationCount[method.name] = 0
    })
    communications.forEach(comm => {
        const communicationType = communicationMethods.find(method => method.id === comm.communicationType);
        if(communicationType) {
            communicationCount[communicationType.name] = communicationCount[communicationType.name] + 1;
        }
    })
    const chartData = {
        labels: Object.keys(communicationCount),
        datasets: [
            {
                label: 'Frequency',
                data: Object.values(communicationCount),
                backgroundColor: theme.palette.primary.main,
             },
        ],
    };
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Communication Frequency Report',
                color: theme.palette.text.primary, // Set title color based on theme
            },
             legend: {
               position: 'top',
                labels: {
                   color: theme.palette.text.primary, // Set legend label color based on theme
                  },
             },
            tooltip: {
                titleColor: theme.palette.text.primary,
               bodyColor: theme.palette.text.primary,
               backgroundColor: theme.palette.background.paper
           }
        },
       scales: {
        x: {
         ticks: {
            color: theme.palette.text.primary, // Set x-axis label color based on theme
          }
         },
        y: {
            ticks: {
               color: theme.palette.text.primary, // Set y-axis label color based on theme
             }
          }
       }
    };

    const downloadCSV = async () => {
        const csvData = Object.keys(communicationCount).map(key => {
            return {
                'Communication Method': key,
                'Frequency': communicationCount[key]
            }
        });
        const header = Object.keys(csvData[0]);
        const csvStringifier = createObjectCsvStringifier({
            header
        });

        const csvString = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'communication_frequency_report.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Communication Frequency Report</Typography>
                <Button variant="contained" color="primary" onClick={downloadCSV}>Export CSV</Button>
            </Box>
            <Box p={2} sx={{ height: "400px" }}>
                <Bar data={chartData} options={chartOptions}/>
            </Box>
        </Box>
    );
};

export default CommunicationFrequencyReport;