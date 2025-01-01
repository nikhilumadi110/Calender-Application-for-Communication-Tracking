// src/components/UserModule/DeleteConfirmationModal.jsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';

const DeleteConfirmationModal = ({ open, handleClose, communication, handleDelete }) => {
    const handleConfirmDelete = () => {
        handleDelete(communication.id);
    }
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    Are you sure you want to delete this communication?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleConfirmDelete}
                    variant="contained"
                    color="error"
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationModal;