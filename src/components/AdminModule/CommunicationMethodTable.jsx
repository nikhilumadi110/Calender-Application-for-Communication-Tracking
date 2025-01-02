// src/components/AdminModule/CommunicationMethodTable.jsx
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
    Alert,
    TablePagination,
    styled
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import useAdminModule from './useAdminModule';
import CommunicationMethodForm from './CommunicationMethodForm';
import { toast } from 'react-toastify';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    textAlign: 'left',
     [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
        padding: '8px',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
     [theme.breakpoints.down('sm')]: {
        '& > *': {
            padding: '8px',
        },
    },
}));



const CommunicationMethodTable = () => {
    const { communicationMethods, deleteCommunicationMethod } = useAdminModule();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    const handleOpenDialog = (method) => {
        setSelectedMethod(method || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedMethod(null);
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


    const handleDeleteMethod = async (id) => {
        setLoading(true);
        try {
            await deleteCommunicationMethod(id);
            setSnackbarMessage("Communication Method deleted successfully");
            setSnackbarSeverity('success');
        } catch (error) {
           setSnackbarMessage("Failed to delete the Communication Method. Try again later");
           setSnackbarSeverity('error');
        } finally {
            setLoading(false);
            setSnackbarOpen(true);
        }
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedMethods = React.useMemo(() => {
        const sortFunction = (a, b) => {
            if (b[orderBy] < a[orderBy]) {
                return order === 'asc' ? 1 : -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return order === 'asc' ? -1 : 1;
            }
            return 0;
        };
        return [...communicationMethods].sort(sortFunction);
    }, [communicationMethods, order, orderBy]);

      const paginatedMethods = React.useMemo(() => {
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        return sortedMethods.slice(start, end);
    }, [sortedMethods, page, rowsPerPage]);

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" color="text.primary">Communication Methods</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog(null)}
                >
                    Add Method
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="communication-methods-table">
                    <TableHead>
                        <TableRow>
                             <StyledTableCell>
                                  <span aria-label="serial-number-column">#</span>
                            </StyledTableCell>
                            <StyledTableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('name')}
                                >
                                    <span aria-label='name-column'> Name </span>
                                </TableSortLabel>
                            </StyledTableCell>
                            <StyledTableCell>
                                <TableSortLabel
                                    active={orderBy === 'description'}
                                    direction={orderBy === 'description' ? order : 'asc'}
                                    onClick={() => handleRequestSort('description')}
                                >
                                    <span aria-label="description-column">Description</span>
                                </TableSortLabel>
                            </StyledTableCell>
                            <StyledTableCell>
                                <TableSortLabel
                                    active={orderBy === 'sequence'}
                                    direction={orderBy === 'sequence' ? order : 'asc'}
                                    onClick={() => handleRequestSort('sequence')}
                                >
                                    <span aria-label="sequence-column"> Sequence </span>
                                </TableSortLabel>
                            </StyledTableCell>
                            <StyledTableCell>
                                <span aria-label="mandatory-column">Mandatory</span>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                <span aria-label="action-column"> Actions </span>
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedMethods.map((method, index) => (
                            <StyledTableRow key={method.id}>
                                 <TableCell>{(page * rowsPerPage) + index + 1}</TableCell>
                                <TableCell>{method.name}</TableCell>
                                <TableCell>
                                    <Tooltip title={method.description}>
                                        <span>{method.description}</span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>{method.sequence}</TableCell>
                                <TableCell>{method.mandatory ? 'Yes' : 'No'}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        aria-label="edit"
                                        onClick={() => handleOpenDialog(method)}
                                        color="primary"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => handleDeleteMethod(method.id)}
                                        color="error"
                                        disabled={loading}
                                    >
                                         {loading ? <CircularProgress size={20} /> : <DeleteIcon />}
                                    </IconButton>
                                </TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                 <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={sortedMethods.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                 />
            </TableContainer>
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth='sm'>
                <DialogTitle>{selectedMethod ? "Edit Method" : "Add Method"}</DialogTitle>
                <DialogContent>
                    <CommunicationMethodForm handleClose={handleCloseDialog} method={selectedMethod} />
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

export default CommunicationMethodTable;