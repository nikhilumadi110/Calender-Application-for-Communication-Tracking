// src/components/UserModule/CommunicationDetailsModal.jsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, IconButton, Button } from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import moment from 'moment';
import useUserModule from './useUserModule';
import CommunicationActionModal from './CommunicationActionModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const CommunicationDetailsModal = ({ open, handleClose, events, selectedDate }) => {
    const { companies, getCompanyNextCommunications, communicationMethods, deleteCommunication } = useUserModule();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCommunication, setSelectedCommunication] = useState(null);
    const formatDate = (date) => {
        return moment(date).format('MMM Do, YYYY');
    };
    const selectedDateString = moment(selectedDate).format('YYYY-MM-DD');
    const filteredCompanies = companies.filter(company => {
          const nextCommunications = getCompanyNextCommunications(company);
           return nextCommunications.some(date => moment(date).format('YYYY-MM-DD') === selectedDateString);
    });
      const handleOpenEditModal = (event) => {
          setSelectedCommunication(event);
         setIsEditModalOpen(true);
    }
     const handleCloseEditModal = () => {
         setIsEditModalOpen(false);
         setSelectedCommunication(null);
    }
    const handleOpenDeleteModal = (event) => {
        setSelectedCommunication(event);
        setIsDeleteModalOpen(true);
    }
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedCommunication(null);
    }
    const handleDeleteCommunication = async (communicationId) => {
       await deleteCommunication(communicationId);
        handleCloseDeleteModal();
       handleClose();
    }

    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle className="flex justify-between items-center">
                <span className="text-xl font-semibold">
                    Communications on {formatDate(selectedDate)}
                </span>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
              {events && events.length > 0 ? (
                   <Box mt={2}>
                       {events.map((event) => (
                           <Box key={event.id} className="bg-gray-100 p-3 rounded mb-2">
                                <Typography variant="subtitle1" className="text-gray-800 font-medium flex justify-between items-center">
                                   <span> {event.title} </span>
                                   <span>
                                     <IconButton onClick={() => handleOpenEditModal(event)} >
                                       <EditIcon  />
                                     </IconButton>
                                     <IconButton onClick={() => handleOpenDeleteModal(event)}>
                                           <DeleteIcon  />
                                     </IconButton>
                                   </span>
                                </Typography>
                                <Typography variant="body2" className="text-gray-600 mt-1">
                                   {event.extendedProps.notes}
                                 </Typography>
                             </Box>
                        ))}
                  </Box>
               ) : (
                 <Box>
                      {filteredCompanies.length === 0 ? (
                        <Typography className="text-gray-600">No communications scheduled for this date</Typography>
                     ): (
                            <Box>
                                {filteredCompanies.map((company) => {
                                    const nextCommunications = getCompanyNextCommunications(company);
                                    const communicationType = communicationMethods.find(method => method.id === company.nextCommunicationType)?.name;
                                   return nextCommunications.map((nextDate, index) => (
                                       <Box key={`${company.id}-${index}`} className="bg-gray-100 p-3 rounded mb-2">
                                          <Typography variant="subtitle1" className="text-gray-800 font-medium flex justify-between items-center">
                                               <span>{company.name} - {communicationType || "Scheduled"}</span>
                                          </Typography>
                                               <Typography variant="body2" className="text-gray-600 mt-1">
                                                  Next scheduled communication {formatDate(nextDate)}
                                                 </Typography>
                                             </Box>
                                     ))
                                 })
                                 }
                            </Box>
                        )}
                  </Box>
              )}
                {selectedCommunication && (
                    <CommunicationActionModal
                        open={isEditModalOpen}
                         handleClose={handleCloseEditModal}
                         communication={selectedCommunication}
                         />
                  )}
                <DeleteConfirmationModal
                    open={isDeleteModalOpen}
                    handleClose={handleCloseDeleteModal}
                   communication={selectedCommunication}
                    handleDelete={handleDeleteCommunication}
                />
           </DialogContent>
        </Dialog>
   );
};

export default CommunicationDetailsModal;