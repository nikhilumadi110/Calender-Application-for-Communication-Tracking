// src/components/ReportingModule/OverdueCommunicationTrend.jsx
import React, { useState, useMemo } from 'react';
import { Box, Typography, InputAdornment } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import useUserModule from '../UserModule/useUserModule';
import moment from "moment";
import { useTheme } from '@mui/material/styles';
import { DateRange } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { styled } from '@mui/material/styles';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
    '& .MuiInputBase-root': {
        backgroundColor: theme.palette.background.paper,
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.grey[400],
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.grey[600],
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
   },
}));


const OverdueCommunicationTrend = () => {
    const { companies, isOverdue, getCompanyNextCommunication } = useUserModule();
    const theme = useTheme();
    const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
    const [endDate, setEndDate] = useState(moment());

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const chartData = useMemo(() => {
        const dateRange = [];
        let currentDate = moment(startDate);

        while (currentDate <= moment(endDate)) {
            dateRange.push(currentDate.format('YYYY-MM-DD'));
            currentDate.add(1, 'day');
        }
        const overdueCounts = dateRange.map(date => {
            return companies.filter(company =>
                isOverdue(company) && moment(getCompanyNextCommunication(company)).format('YYYY-MM-DD') <= date
            ).length
        });

        return {
            labels: dateRange,
            datasets: [
                {
                    label: 'Overdue communications',
                    data: overdueCounts,
                    fill: false,
                    borderColor: theme.palette.error.main,
                    tension: 0.1,
                }
            ],
        };
    }, [companies, startDate, endDate, isOverdue, getCompanyNextCommunication, theme]);

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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
               <Typography variant="h6">Overdue Communication Trends</Typography>
                   <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Box display="flex" alignItems="center">
                           <StyledDatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={handleStartDateChange}
                                renderInput={(props) => (
                                      <StyledDatePicker {...props}
                                          size="small"
                                          InputProps={{
                                              endAdornment: (
                                                  <InputAdornment position="end">
                                                      <DateRange />
                                                  </InputAdornment>
                                              ),
                                            }}
                                          sx={{marginRight: 1}}
                                      />
                                    )}
                            />
                           <StyledDatePicker
                                label="End Date"
                                value={endDate}
                                onChange={handleEndDateChange}
                                renderInput={(props) => (
                                      <StyledDatePicker {...props}
                                        size="small"
                                          InputProps={{
                                               endAdornment: (
                                                  <InputAdornment position="end">
                                                      <DateRange />
                                                   </InputAdornment>
                                               ),
                                             }}
                                        />
                                )}
                            />
                      </Box>
                  </LocalizationProvider>
            </Box>
           <Box p={2} sx={{ height: "400px" }}>
                <Line data={chartData} options={chartOptions} />
            </Box>
        </Box>
    );
};

export default OverdueCommunicationTrend;