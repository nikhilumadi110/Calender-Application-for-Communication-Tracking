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
    Tooltip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import useAdminModule from './useAdminModule';
import CommunicationMethodForm from './CommunicationMethodForm';
import { toast } from 'react-toastify';


const CommunicationMethodTable = () => {
    const { communicationMethods, deleteCommunicationMethod } = useAdminModule();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');

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

    const handleDeleteMethod = async (id) => {
        try {
            await deleteCommunicationMethod(id);
           toast.success("Communication Method deleted successfully", {
             theme: "colored",
           })
        } catch (error) {
            toast.error("Failed to delete the Communication Method. Try again later", {
              theme: "colored",
            })
        }
    }

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
                            <TableCell>
                                 <TableSortLabel
                                     active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                     onClick={() => handleRequestSort('name')}
                                 >
                                    <span aria-label='name-column'> Name </span>
                                 </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                 <TableSortLabel
                                    active={orderBy === 'description'}
                                     direction={orderBy === 'description' ? order : 'asc'}
                                    onClick={() => handleRequestSort('description')}
                                >
                                    <span aria-label="description-column">Description</span>
                                 </TableSortLabel>
                            </TableCell>
                             <TableCell>
                                 <TableSortLabel
                                    active={orderBy === 'sequence'}
                                     direction={orderBy === 'sequence' ? order : 'asc'}
                                    onClick={() => handleRequestSort('sequence')}
                                >
                                     <span aria-label="sequence-column"> Sequence </span>
                                  </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <span aria-label="mandatory-column">Mandatory</span>
                             </TableCell>
                            <TableCell align="center">
                                 <span aria-label="action-column"> Actions </span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedMethods.map((method) => (
                            <TableRow key={method.id}>
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
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth='sm'>
                <DialogTitle>{selectedMethod ? "Edit Method" : "Add Method"}</DialogTitle>
                <DialogContent>
                    <CommunicationMethodForm handleClose={handleCloseDialog} method={selectedMethod} />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default CommunicationMethodTable;