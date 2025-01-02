// src/components/UserModule/CalendarView.jsx
import React, { useState, useCallback, useEffect } from 'react';
import {
    Box,
    IconButton,
    Typography,
     Tooltip,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import useUserModule from './useUserModule';
import { format } from 'date-fns';
import CommunicationDetailsModal from './CommunicationDetailsModal';
import { styled } from '@mui/material/styles';

const StyledFullCalendar = styled(FullCalendar)(({theme}) => ({
      '& .fc-toolbar-title': {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: theme.palette.text.primary
      },
    '& .fc-daygrid-day-number': {
        color: theme.palette.text.primary,
    },
     '& .fc-col-header-cell-text': {
        color: theme.palette.text.primary,
      },
      '& .fc-event-title': {
        color: theme.palette.common.white,
     }
}))

const CalendarView = ({ open, handleClose }) => {
    const { companies, communications, communicationMethods, getCompanyNextCommunications } = useUserModule();
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);

    useEffect(() => {
       try {
         const allEvents = [];

          // Add past communications
          communications.forEach(communication => {
             const communicationType = communicationMethods.find(method => method.id === communication.communicationType)?.name
             const companyName = companies.find(company => company.id === communication.companyId)?.name
             if(companyName) {
                 allEvents.push({
                    id: communication.id,
                    title: `${companyName} - ${communicationType || 'Communication'}`,
                    start: communication.date,
                   extendedProps: {
                       notes: communication.notes,
                    },
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                })
               }
          });
         // Add scheduled future communications
         companies.forEach(company => {
           const nextCommunications = getCompanyNextCommunications(company);
             nextCommunications.forEach((nextDate, index) => {
                 const communicationType = communicationMethods.find(method => method.id === company.nextCommunicationType)?.name
                   allEvents.push({
                   id: `${company.id}-${index}`,
                  title: `${company.name} - ${communicationType || 'Scheduled'}`,
                   start: nextDate,
                    color: 'green',
                    extendedProps: {
                      notes: 'Next scheduled communication'
                    },
                    backgroundColor: 'green',
                      borderColor: 'green'
                     });
              });
        });
        setEvents(allEvents);
      } catch (error) {
        console.error("Error fetching events", error);
      }

    }, [companies, communications, communicationMethods, getCompanyNextCommunications]);

    const handleDateClick = (info) => {
        setSelectedDate(info.date);
        setIsDetailsModalOpen(true);
    };

   const handleDetailsModalClose = useCallback(() => {
        setIsDetailsModalOpen(false);
        setSelectedDate(null);
    }, []);

    const handleEventClick = (info) => {
          setSelectedDate(info.event.start);
         setIsDetailsModalOpen(true);
    };
    const filteredEvents = selectedDate
        ? events.filter(event => format(new Date(event.start), 'yyyy-MM-dd') === format(new Date(selectedDate), 'yyyy-MM-dd'))
        : [];


    return (
        <Box>
          <Box  display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" color="text.primary">Calendar</Typography>
                    <IconButton onClick={handleClose}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
            <Box sx={{overflowX: 'auto'}}>
               <StyledFullCalendar
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
              </Box>
        </Box>
    );
};

export default CalendarView;