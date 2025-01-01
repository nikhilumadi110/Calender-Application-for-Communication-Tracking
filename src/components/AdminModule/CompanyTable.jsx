// src/components/AdminModule/CompanyTable.jsx
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    TableSortLabel,
    Tooltip,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import useAdminModule from './useAdminModule';
import CompanyForm from './CompanyForm';
import { toast } from 'react-toastify';

const CompanyTable = () => {
    const { companies, deleteCompany } = useAdminModule();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
     const [loading, setLoading] = useState(false);
     const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
     const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleOpenDialog = (company) => {
        setSelectedCompany(company || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCompany(null)
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
     const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') {
       return;
     }
        setSnackbarOpen(false);
     };
    const handleDeleteCompany = async (id) => {
         setLoading(true);
        try {
            await deleteCompany(id);
           setSnackbarMessage("Company deleted successfully")
           setSnackbarSeverity('success');
        } catch (error) {
            setSnackbarMessage("Failed to delete the company. Try again later");
            setSnackbarSeverity('error');
        }finally {
            setLoading(false);
           setSnackbarOpen(true);
        }
    }
    const sortedCompanies = React.useMemo(() => {
        const sortFunction = (a, b) => {
            if (b[orderBy] < a[orderBy]) {
                return order === 'asc' ? 1 : -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return order === 'asc' ? -1 : 1;
            }
            return 0;
        };
        return [...companies].sort(sortFunction);
    }, [companies, order, orderBy]);
    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" color="text.primary">Companies</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog(null)}
                >
                    Add Company
                </Button>
            </Box>
             <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="companies-table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                 <TableSortLabel
                                     active={orderBy === 'name'}
                                     direction={orderBy === 'name' ? order : 'asc'}
                                     onClick={() => handleRequestSort('name')}
                                 >
                                     <span aria-label="name-column">Name</span>
                                 </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'location'}
                                    direction={orderBy === 'location' ? order : 'asc'}
                                    onClick={() => handleRequestSort('location')}
                                >
                                    <span aria-label='location-column'>Location</span>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <span aria-label="linkedIn-column">LinkedIn Profile</span>
                             </TableCell>
                            <TableCell>
                                 <span aria-label="emails-column">Emails</span>
                            </TableCell>
                            <TableCell>
                                 <span aria-label="phone-numbers-column">Phone Numbers</span>
                             </TableCell>
                            <TableCell>
                                <span aria-label="comments-column">Comments</span>
                            </TableCell>
                            <TableCell>
                                <span aria-label="periodicity-column">Periodicity (Days)</span>
                            </TableCell>
                            <TableCell align="center">
                                <span aria-label="action-column"> Actions </span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedCompanies.map((company) => (
                           <TableRow key={company.id} >
                                 <TableCell>{company.name}</TableCell>
                                <TableCell>{company.location}</TableCell>
                                <TableCell>
                                    <Tooltip title={company.linkedInProfile || "No LinkedIn Profile"}>
                                        <span>
                                            {company.linkedInProfile ? <a href={company.linkedInProfile} target="_blank" rel="noopener noreferrer">Link</a> : 'N/A'}
                                        </span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>{company.emails.join(', ')}</TableCell>
                                <TableCell>{company.phoneNumbers.join(', ')}</TableCell>
                                <TableCell>{company.comments}</TableCell>
                                 <TableCell>{company.communicationPeriodicity}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        aria-label="edit"
                                        onClick={() => handleOpenDialog(company)}
                                        color="primary"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                     <IconButton
                                        aria-label="delete"
                                        onClick={() => handleDeleteCompany(company.id)}
                                        color="error"
                                         disabled={loading}
                                    >
                                       {loading ? <CircularProgress size={20} /> : <DeleteIcon />}
                                    </IconButton>
                                </TableCell>
                           </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth='md'>
                <DialogTitle>{selectedCompany ? "Edit Company" : "Add Company"}</DialogTitle>
                <DialogContent>
                    <CompanyForm handleClose={handleCloseDialog} company={selectedCompany} />
                </DialogContent>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
             >
                  <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                  {snackbarMessage}
                  </Alert>
             </Snackbar>
        </Box>
    );
};

export default CompanyTable;