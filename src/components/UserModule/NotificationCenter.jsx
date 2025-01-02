// src/components/UserModule/NotificationCenter.jsx
import React from 'react';
import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Grid,
    Paper,
    styled
} from '@mui/material';
import useUserModule from './useUserModule.js';
import { format } from 'date-fns';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
    transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    backgroundColor: theme.palette.action.hover,
  }
}));

const NotificationCenter = ({  totalOverDue, totalDueToday }) => {
    const { companies, isOverdue, isDueToday, getCompanyNextCommunication } = useUserModule();
    const overdueCompanies = companies.filter(company => isOverdue(company));
    const dueTodayCompanies = companies.filter(company => isDueToday(company));

    const formatDate = (date) => {
        return date ? format(new Date(date), 'MMM do, yyyy') : 'N/A';
    };

    return (
       <Box>
            <Typography variant="h4" color="text.primary" mb={2}>Notifications</Typography>
                 <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <StyledPaper elevation={2}>
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
                        </StyledPaper>
                    </Grid>
                   <Grid item xs={12} md={6}>
                        <StyledPaper elevation={2}>
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
                       </StyledPaper>
                  </Grid>
              </Grid>
              <Box mt={3} textAlign="right">
                <Typography variant="body2" color="textSecondary">
                  Total overdue: {totalOverDue} , Total Due Today: {totalDueToday}
                </Typography>
               </Box>
        </Box>
    );
};

export default NotificationCenter;