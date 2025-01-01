// src/components/UserModule/NotificationCenter.jsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Grid,
    Paper,
    IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import useUserModule from './useUserModule.js';
import { format } from 'date-fns';

const NotificationCenter = ({ open, handleClose, totalOverDue, totalDueToday }) => {
    const { companies, isOverdue, isDueToday, getCompanyNextCommunication } = useUserModule();
    const overdueCompanies = companies.filter(company => isOverdue(company));
    const dueTodayCompanies = companies.filter(company => isDueToday(company));

    const formatDate = (date) => {
        return date ? format(new Date(date), 'MMM do, yyyy') : 'N/A';
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md"  PaperProps={{
            style: {
                maxHeight: '70vh', // Increased the height a bit
            },
        }}>
            <DialogTitle style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Typography variant="h6" >Notifications</Typography>
                   <IconButton onClick={handleClose} size="small" >
                        <CloseIcon />
                    </IconButton>
            </DialogTitle>
            <DialogContent >
                 <Box mb={2}>
                     </Box>
                 <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={2} style={{ padding: '16px' }}>
                            <Typography variant="h6" className="text-gray-800 font-semibold mb-2">Overdue Communications</Typography>
                            {overdueCompanies.length === 0 ?
                                <Typography className="text-gray-600">No overdue communications</Typography>
                                : (
                                    <List>
                                        {overdueCompanies.map((company) => (
                                            <ListItem key={company.id}  style={{padding: '8px 0', color: 'red' }}>
                                                 <ListItemText
                                                     primary={<span className="font-medium">{company.name}</span>}
                                                     secondary={<span className="text-gray-600">Next communication due on: {formatDate(getCompanyNextCommunication(company))}</span>}
                                                />
                                            </ListItem>
                                        ))}
                                     </List>
                                )
                            }
                        </Paper>
                    </Grid>
                   <Grid item xs={12} md={6}>
                        <Paper elevation={2} style={{ padding: '16px' }}>
                            <Typography variant="h6" className="text-gray-800 font-semibold mb-2">Due Today</Typography>
                            {dueTodayCompanies.length === 0 ?
                                <Typography className="text-gray-600">No communications due today</Typography>
                                : (
                                    <List>
                                       {dueTodayCompanies.map((company) => (
                                           <ListItem key={company.id} style={{padding: '8px 0', color: 'green' }}>
                                                <ListItemText
                                                     primary={<span className="font-medium">{company.name}</span>}
                                                     secondary={<span className="text-gray-600">Next communication due on: {formatDate(getCompanyNextCommunication(company))}</span>}
                                                />
                                           </ListItem>
                                        ))}
                                    </List>
                                )
                            }
                       </Paper>
                  </Grid>
              </Grid>
              <Box mt={3} textAlign="right">
                <Typography variant="body2" color="textSecondary">
                  Total overdue: {totalOverDue} , Total Due Today: {totalDueToday}
                </Typography>
               </Box>
            </DialogContent>
        </Dialog>
    );
};

export default NotificationCenter;