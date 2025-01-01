// src/components/ReportingModule/ActivityLog.jsx
import React, { useState, useMemo } from 'react';
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
    TableSortLabel
} from '@mui/material';
import useUserModule from '../UserModule/useUserModule';
import moment from 'moment';


const ActivityLog = () => {
    const { communications, communicationMethods, companies } = useUserModule();
     const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('date');
     const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const sortedCommunications = useMemo(() => {
    const sortFunction = (a, b) => {
           if (b[orderBy] < a[orderBy]) {
                return order === 'asc' ? 1 : -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return order === 'asc' ? -1 : 1;
            }
            return 0;
        };
        return [...communications].sort(sortFunction);
    }, [communications, order, orderBy]);
    return (
        <Box>
            <Typography variant="h6" mb={2}>Activity Log</Typography>
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
                                 <span aria-label='company-column'>Company</span>
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
                        {sortedCommunications.map((comm) => {
                             const company = companies.find(c => c.id === comm.companyId);
                             const communicationType = communicationMethods.find(method => method.id === comm.communicationType)
                            return(
                                <TableRow key={comm.id}>
                                   <TableCell>{moment(comm.date).format("MMMM D, YYYY h:mm A")}</TableCell>
                                    <TableCell>{company?.name || 'Unknown'}</TableCell>
                                     <TableCell>{communicationType?.name || 'Unknown'}</TableCell>
                                    <TableCell>{comm.notes}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ActivityLog;