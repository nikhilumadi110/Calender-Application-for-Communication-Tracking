// src/components/ReportingModule/ActivityLog.jsx
import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    TextField,
    InputAdornment
} from '@mui/material';
import useUserModule from '../UserModule/useUserModule';
import moment from 'moment';
import { DateRange } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { styled } from '@mui/material/styles';

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


const ActivityLog = () => {
    const { communications, communicationMethods, companies } = useUserModule();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('date');
    const [selectedCompany, setSelectedCompany] = useState('all');
    const [selectedUser, setSelectedUser] = useState('all');
     const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
    const [endDate, setEndDate] = useState(moment());

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleCompanyChange = (event) => {
        setSelectedCompany(event.target.value);
    };

    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    const sortedCommunications = useMemo(() => {
        setLoading(true);
        const sortFunction = (a, b) => {
            if (orderBy === 'company') {
                const companyA = companies.find(c => c.id === a.companyId)?.name || '';
                const companyB = companies.find(c => c.id === b.companyId)?.name || '';
                if (companyB < companyA) {
                    return order === 'asc' ? 1 : -1;
                }
                if (companyB > companyA) {
                    return order === 'asc' ? -1 : 1;
                }
                return 0;
           }   else if (orderBy === 'user') {
                // Mock user sorting logic
                 const userA =  'user' // Replace with user name if you have user object
                const userB =  'user' // Replace with user name if you have user object
                if (userB < userA) {
                     return order === 'asc' ? 1 : -1;
                }
                if (userB > userA) {
                    return order === 'asc' ? -1 : 1;
                }
                return 0;
            } else {
                if (b[orderBy] < a[orderBy]) {
                    return order === 'asc' ? 1 : -1;
               }
               if (b[orderBy] > a[orderBy]) {
                   return order === 'asc' ? -1 : 1;
              }
              return 0;
            }
        };
        const filteredData = communications.filter(comm => {
               const companyMatch = selectedCompany === 'all' || comm.companyId === selectedCompany;
              const userMatch = selectedUser === 'all' ;//|| comm.userId === selectedUser; // Add user filter when you have user data.
                const dateMatch =
                  moment(comm.date) >= moment(startDate) && moment(comm.date) <= moment(endDate);
              return companyMatch && userMatch && dateMatch;
          });
          setLoading(false);
         return [...filteredData].sort(sortFunction);
    }, [communications, order, orderBy, selectedCompany, selectedUser, companies, startDate, endDate]);

    // Simulate a Live Feed Effect
    const [liveData, setLiveData] = useState(sortedCommunications);
    useEffect(() => {
        setLiveData(sortedCommunications);
    }, [sortedCommunications]);

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
                <Typography variant="h6" sx={{ mb: { xs: 1, md: 0 } }}>Activity Log</Typography>
                <Box display="flex" alignItems="center" flexWrap="wrap" sx={{ gap: 1 }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
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
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                         <InputLabel id="user-filter-label">User</InputLabel>
                        <Select
                            labelId="user-filter-label"
                            id="user-filter"
                            value={selectedUser}
                            label="User"
                            onChange={handleUserChange}
                         >
                            <MenuItem value="all">All</MenuItem>
                            {/* Mock users as we don't have real users*/}
                             <MenuItem value="user">User</MenuItem>
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
                </Box>
            </Box>
            <Box sx={{ overflowX: 'auto' }}>
                 <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="activity-log-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'date'}
                                        direction={orderBy === 'date' ? order : 'asc'}
                                        onClick={() => handleRequestSort('date')}
                                    >
                                        <span aria-label='date-column'>Date</span>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'company'}
                                        direction={orderBy === 'company' ? order : 'asc'}
                                        onClick={() => handleRequestSort('company')}
                                    >
                                        <span aria-label='company-column'>Company</span>
                                    </TableSortLabel>
                                </TableCell>
                                 <TableCell>
                                     <TableSortLabel
                                        active={orderBy === 'user'}
                                        direction={orderBy === 'user' ? order : 'asc'}
                                        onClick={() => handleRequestSort('user')}
                                    >
                                       <span aria-label='user-column'>User</span>
                                     </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <span aria-label='communication-type-column'> Communication Type </span>
                                </TableCell>
                                <TableCell>
                                    <span aria-label='notes-column'>Notes</span>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                           {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{p: 2}}> <CircularProgress /> </TableCell>
                                </TableRow>
                           ) : liveData.length > 0 ? (
                                liveData.map((comm) => {
                                   const company = companies.find(c => c.id === comm.companyId);
                                   const communicationType = communicationMethods.find(method => method.id === comm.communicationType)
                                 return (
                                    <TableRow key={comm.id}>
                                      <TableCell>{moment(comm.date).format("MMMM D, YYYY h:mm A")}</TableCell>
                                        <TableCell>{company?.name || 'Unknown'}</TableCell>
                                         <TableCell>User</TableCell>
                                          <TableCell>{communicationType?.name || 'Unknown'}</TableCell>
                                        <TableCell>{comm.notes}</TableCell>
                                    </TableRow>
                                    );
                                })
                            ) : (
                             <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{p: 2}}>
                                      <Typography variant="body1" color="text.secondary">
                                        No communication data available for selected criteria.
                                     </Typography>
                                  </TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                    </Table>
                 </TableContainer>
            </Box>
        </Box>
    );
};

export default ActivityLog;