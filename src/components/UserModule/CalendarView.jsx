// src/components/UserModule/CalendarView.jsx
import React, { useState, useCallback, useEffect } from 'react';
import {
Dialog,
DialogTitle,
DialogContent,
IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import useUserModule from './useUserModule';
import { format } from 'date-fns';
import CommunicationDetailsModal from './CommunicationDetailsModal';

const CalendarView = ({ open, handleClose }) => {
const { companies, communications, communicationMethods, getCompanyNextCommunications, getCompanyNextCommunication } = useUserModule();
const [selectedDate, setSelectedDate] = useState(null);
const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
const [events, setEvents] = useState([]);

useEffect(() => {
    const allEvents = [];

    // Add past communications
    communications.forEach(communication => {
         const communicationType = communicationMethods.find(method => method.id === communication.communicationType)?.name
         const companyName = companies.find(company => company.id === communication.companyId)?.name
         if(companyName) {
             allEvents.push({
                id: communication.id,
                 title: `${companyName} - ${communicationType || 'Communication'}`,
                date: communication.date,
                extendedProps: {
                    notes: communication.notes,
                }
              })
            }
       });
    // Add scheduled future communications
      companies.forEach(company => {
        const nextCommunications = getCompanyNextCommunications(company);
        nextCommunications.forEach((nextDate, index) => {
            const communicationType = communicationMethods.find(method => method.id === company.nextCommunication)?.name
              allEvents.push({
                id: `${company.id}-${index}`,
                title: `${company.name} - ${communicationType || 'Scheduled'}`,
                date: nextDate,
                 color: 'green',
                  extendedProps: {
                   notes: 'Next scheduled communication'
                   }
                });
          });
    });
      setEvents(allEvents);
}, [companies, communications, communicationMethods, getCompanyNextCommunications]);




const handleDateClick = (info) => {
    setSelectedDate(info.date);
    setIsDetailsModalOpen(true);
};

const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedDate(null);
};

 const handleEventClick = (info) => {
      setSelectedDate(info.event.start);
      setIsDetailsModalOpen(true);
};
const filteredEvents = selectedDate
    ? events.filter(event => format(new Date(event.date), 'yyyy-MM-dd') === format(new Date(selectedDate), 'yyyy-MM-dd'))
     : [];


return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className="flex justify-between items-center">
            <span className="text-xl font-semibold">Calendar</span>
            <IconButton onClick={handleClose}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                height={600}
            />
             {selectedDate && (
                <CommunicationDetailsModal
                  open={isDetailsModalOpen}
                  handleClose={handleDetailsModalClose}
                   selectedDate={selectedDate}
                   events={filteredEvents}
               />
              )}
        </DialogContent>
    </Dialog>
);
};

export default CalendarView;