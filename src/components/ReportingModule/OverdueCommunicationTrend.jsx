// src/components/ReportingModule/OverdueCommunicationTrend.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import useUserModule from '../UserModule/useUserModule';
import moment from "moment";
import { useTheme } from '@mui/material/styles';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
const OverdueCommunicationTrend = () => {
    const { companies, isOverdue, getCompanyNextCommunication} = useUserModule();
     const theme = useTheme();
    const lastSevenDays = Array.from({ length: 7 }, (_, i) => moment().subtract(i, 'days').format('YYYY-MM-DD'));
    const overdueCount = lastSevenDays.map(date => {
         return companies.filter(company =>
              isOverdue(company) && moment(getCompanyNextCommunication(company)).format('YYYY-MM-DD') <= date
            ).length
    })

    const chartData = {
        labels: lastSevenDays.reverse(),
        datasets: [
            {
                label: 'Overdue communications',
                data: overdueCount.reverse(),
                fill: false,
                borderColor: theme.palette.error.main,
                tension: 0.1,
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Overdue Communication Trends',
                color: theme.palette.text.primary,
             },
            legend: {
              position: "top",
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
    return (
        <Box>
           <Typography variant="h6">Overdue Communication Trends</Typography>
            <Box p={2} sx={{ height: "400px" }}>
                <Line data={chartData} options={chartOptions}/>
           </Box>
        </Box>
    );
};

export default OverdueCommunicationTrend;