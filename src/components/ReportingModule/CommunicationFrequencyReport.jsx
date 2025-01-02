// src/components/ReportingModule/CommunicationFrequencyReport.jsx
import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import useUserModule from '../UserModule/useUserModule';
import { createObjectCsvStringifier } from 'csv-writer';
import { useTheme } from '@mui/material/styles';
import { DateRange } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import { styled } from '@mui/material/styles';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
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

const CommunicationFrequencyReport = () => {
    const { communications, communicationMethods, companies } = useUserModule();
    const theme = useTheme();
    const [selectedCompany, setSelectedCompany] = useState('all');
    const [selectedMethod, setSelectedMethod] = useState('all');
    const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
    const [endDate, setEndDate] = useState(moment());
    const [loading, setLoading] = useState(false);

     const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
         setEndDate(date);
    };

    const handleCompanyChange = (event) => {
        setSelectedCompany(event.target.value);
    };

    const handleMethodChange = (event) => {
        setSelectedMethod(event.target.value);
    };


     const filteredCommunications = useMemo(() => {
        setLoading(true);
         const filteredData = communications.filter(comm => {
             const companyMatch = selectedCompany === 'all' || comm.companyId === selectedCompany;
             const methodMatch = selectedMethod === 'all' || comm.communicationType === selectedMethod;
             const dateMatch =
                moment(comm.date) >= moment(startDate) && moment(comm.date) <= moment(endDate);
            return companyMatch && methodMatch && dateMatch;
         });
          setLoading(false);
        return filteredData;
    }, [communications, selectedCompany, selectedMethod, startDate, endDate]);

    const chartData = useMemo(() => {
        const communicationCount = {};
        communicationMethods.forEach(method => {
            communicationCount[method.name] = 0
        })
        filteredCommunications.forEach(comm => {
             const communicationType = communicationMethods.find(method => method.id === comm.communicationType);
            if(communicationType) {
                communicationCount[communicationType.name] = communicationCount[communicationType.name] + 1;
            }
        })
         return  {
            labels: Object.keys(communicationCount),
             datasets: [
                {
                    label: 'Frequency',
                    data: Object.values(communicationCount),
                    backgroundColor: theme.palette.primary.main,
                 },
            ],
          };
    }, [filteredCommunications, communicationMethods, theme]);

     const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Communication Frequency Report',
                color: theme.palette.text.primary,
            },
            legend: {
                position: 'top',
                labels: {
                    color: theme.palette.text.primary,
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
                 color: theme.palette.text.primary,
            }
           },
           y: {
                ticks: {
                   color: theme.palette.text.primary,
                }
             }
           }
        };

    const downloadCSV = async () => {
           const csvData = Object.keys(chartData.labels).map((key, index) => {
            return {
                'Communication Method': chartData.labels[key],
                'Frequency': chartData.datasets[0].data[index]
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
                <Typography variant="h6" sx={{ mb: { xs: 1, md: 0 } }}>Communication Frequency Report</Typography>
                <Box display="flex" alignItems="center" flexWrap="wrap" sx={{ gap: 1 }}>
                     <FormControl size="small" sx={{minWidth: 150}}>
                        <InputLabel id="company-filter-label">Company</InputLabel>
                        <Select
                            labelId="company-filter-label"
                            id="company-filter"
                            value={selectedCompany}
                            label="Company"
                            onChange={handleCompanyChange}
                        >
                            <MenuItem value="all">All</MenuItem>
                            {companies.map((company) => (
                                <MenuItem key={company.id} value={company.id}>
                                    {company.name}
                                </MenuItem>
                            ))}
                         </Select>
                     </FormControl>
                    <FormControl  size="small" sx={{minWidth: 150}}>
                         <InputLabel id="method-filter-label">Method</InputLabel>
                        <Select
                            labelId="method-filter-label"
                            id="method-filter"
                            value={selectedMethod}
                            label="Method"
                            onChange={handleMethodChange}
                        >
                             <MenuItem value="all">All</MenuItem>
                            {communicationMethods.map((method) => (
                                <MenuItem key={method.id} value={method.id}>
                                    {method.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                    <Button variant="contained" color="primary" onClick={downloadCSV} sx={{whiteSpace: 'nowrap'}}>Export CSV</Button>
                </Box>
            </Box>
             <Box p={2} sx={{ height: "400px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {loading ? (
                  <CircularProgress />
                  ) : filteredCommunications.length > 0 ? (
                    <Bar data={chartData} options={chartOptions} />
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No communication data available for selected criteria.
                    </Typography>
                  )}
            </Box>
        </Box>
    );
};

export default CommunicationFrequencyReport;