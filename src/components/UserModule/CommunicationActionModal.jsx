// src/components/UserModule/CommunicationActionModal.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    FormHelperText,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import useUserModule from './useUserModule';
import { useLoading } from '../../context/LoadingContext';
import { toast } from 'react-toastify';
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

const CommunicationActionModal = ({ open, handleClose, communication }) => {
    const { communicationMethods, logCommunication, updateCommunication, companies } = useUserModule();
    const [communicationType, setCommunicationType] = useState('');
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState('');
     const [selectedCompany, setSelectedCompany] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const { loading, setLoading } = useLoading();
      const [dateError, setDateError] = useState(false);
     const [typeError, setTypeError] = useState(false);
      const [companyError, setCompanyError] = useState(false);


     useEffect(() => {
        if (communication) {
            setIsEditMode(true);
            setCommunicationType(communication.communicationType || '');
            setDate(communication.date ? new Date(communication.date) : new Date());
            setNotes(communication.notes || '');
            setSelectedCompany(communication.companyId || '');
         } else {
            setIsEditMode(false);
             setCommunicationType('');
              setDate(new Date());
            setNotes('');
             setSelectedCompany('');
          }
     }, [communication]);

     const handleSubmit = async () => {
            setLoading(true);
           setDateError(false);
           setTypeError(false);
           setCompanyError(false);
        try{
            if(!selectedCompany){
                setCompanyError(true);
                return;
            }
             if(!communicationType){
               setTypeError(true);
               return;
            }
             if(!date){
                 setDateError(true);
                return;
            }
            const communicationData = {
                communicationType: communicationType,
                date: date.toISOString(),
                notes: notes
            }

             if (isEditMode) {
               await updateCommunication(communication.id, communicationData);
               toast.success("Communication updated successfully", { theme: "colored" })
            } else {
               await logCommunication(selectedCompany, communicationData)
                toast.success("Communication logged successfully", { theme: "colored" })
             }
           handleClose();
        }catch(error){
            toast.error(error?.message, { theme: 'colored' })
            console.log("error in updating communication", error);
        }finally{
            setLoading(false)
       }
     };

    const handleCompanyChange = (event) => {
        setSelectedCompany(event.target.value);
    }
     const handleTypeChange = (event) => {
        setCommunicationType(event.target.value);
    };

     const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const handleNotesChange = (event) => {
        setNotes(event.target.value);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditMode ? 'Edit Communication' : 'Log Communication'}</DialogTitle>
            <DialogContent>
                <Box mt={2} mb={2}>
                     {!isEditMode && (
                         <FormControl fullWidth error={companyError}>
                             <InputLabel id="company-select-label">Select Company</InputLabel>
                             <Select
                                 labelId="company-select-label"
                                id="company-select"
                                value={selectedCompany}
                                 label="Select Company"
                                onChange={handleCompanyChange}
                             >
                                 {companies.map(company => (
                                      <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
                                  ))}
                            </Select>
                            {companyError &&  <FormHelperText>Please select a company</FormHelperText>}
                         </FormControl>
                     )}
                </Box>

                <Box mt={2} mb={2}>
                   <FormControl fullWidth error={typeError}>
                         <InputLabel id="communication-type-label">Communication Type</InputLabel>
                        <Select
                           labelId="communication-type-label"
                            id="communication-type"
                           value={communicationType}
                            label="Communication Type"
                           onChange={handleTypeChange}
                         >
                            {communicationMethods.map(method => (
                                <MenuItem key={method.id} value={method.id}>{method.name}</MenuItem>
                            ))}
                        </Select>
                      {typeError &&  <FormHelperText>Please select a communication type</FormHelperText>}
                    </FormControl>
                 </Box>
                 <Box mt={2} mb={2}>
                   <LocalizationProvider dateAdapter={AdapterDateFns}>
                       <StyledDatePicker
                            label="Date of Communication"
                             value={date}
                              onChange={handleDateChange}
                              renderInput={(props) => (
                                  <TextField {...props}
                                      fullWidth
                                       error={dateError}
                                      InputProps={{
                                        endAdornment: (
                                         <InputAdornment position="end">
                                              </InputAdornment>
                                          ),
                                      }}
                                   />
                                   )}
                            />
                     </LocalizationProvider>
                       {dateError && <FormHelperText error>Please select a valid date</FormHelperText>}
                  </Box>
                <Box mt={2} mb={2}>
                   <TextField
                        label="Notes"
                       multiline
                        rows={4}
                       fullWidth
                       value={notes}
                       onChange={handleNotesChange}
                     />
                </Box>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                   {loading ? <CircularProgress size={20} /> : (isEditMode ? 'Update' : 'Log')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CommunicationActionModal;