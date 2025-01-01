// src/components/LoadingSpinner.jsx
import React from 'react';
import { CircularProgress, Box } from '@mui/material';
import { useLoading } from '../context/LoadingContext';

const LoadingSpinner = () => {
    const { isLoading } = useLoading();
     if(!isLoading) return null;
  return (
      <Box
         display="flex"
           justifyContent="center"
          alignItems="center"
           height="100vh"
      >
          <CircularProgress />
      </Box>
  );
};

export default LoadingSpinner;