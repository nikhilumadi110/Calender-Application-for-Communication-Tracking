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
    Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import useUserModule from './useUserModule';
import { useLoading } from '../../context/LoadingContext';
import { toast } from 'react-toastify';


const CommunicationActionModal = ({ open, handleClose, communication }) => {
    const { communicationMethods, logCommunication, updateCommunication, companies } = useUserModule();
    const [communicationType, setCommunicationType] = useState('');
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const { setLoading } = useLoading();

    useEffect(() => {
        if (communication) {
           setIsEditMode(true);
            setCommunicationType(communication.communicationType || '');
           setDate(communication.date ? new Date(communication.date) : new Date());
            setNotes(communication.notes || '');
           setSelectedCompany(communication.companyId || '')
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
        try{
            if(!selectedCompany){
                toast.error("Please select the company.", { theme: 'colored' });
                return;
            }
             if(!communicationType){
               toast.error("Please select communication Type.", { theme: 'colored' });
               return;
            }
             if(!date){
                toast.error("Please select Date.", { theme: 'colored' });
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
                       <FormControl fullWidth>
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
                      </FormControl>
                  )}
                </Box>

                <Box mt={2} mb={2}>
                   <FormControl fullWidth>
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
                    </FormControl>
                 </Box>


                 <Box mt={2} mb={2}>
                   <LocalizationProvider dateAdapter={AdapterDateFns}>
                           <DatePicker
                               label="Date of Communication"
                               value={date}
                               onChange={handleDateChange}
                              renderInput={(props) => <TextField {...props} fullWidth />}
                           />
                  </LocalizationProvider>
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
                >
                    {isEditMode ? 'Update' : 'Log'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CommunicationActionModal;