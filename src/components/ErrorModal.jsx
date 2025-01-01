// src/components/ErrorModal.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

const ErrorModal = ({ open, handleClose, error, errorInfo }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Oops! Something went wrong.</DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="error">
            An error has occurred.
          </Typography>
            {error && (
               <Box mt={2}>
                    <Typography variant="subtitle1">Error Details:</Typography>
                     <Typography variant="body2" color="text.secondary"> {error?.message} </Typography>
                    {errorInfo?.componentStack && (
                        <Typography variant="body2" color="text.secondary">
                            {errorInfo?.componentStack}
                        </Typography>
                   )}
               </Box>

            )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
            Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorModal;