// src/components/ReportingModule/ReportingModule.jsx
import React from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import CommunicationFrequencyReport from './CommunicationFrequencyReport';
import OverdueCommunicationTrend from './OverdueCommunicationTrend';
import ActivityLog from './ActivityLog';

const ReportingModule = () => {
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ overflowY: 'auto' }}>
            <Typography variant="h4" color="text.primary" mb={2}>Reporting & Analytics</Typography>
              <Paper elevation={3} sx={{ mb: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    centered
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        "& .MuiTabs-indicator": {
                            backgroundColor: "primary.main"
                        },
                        "& .MuiTab-root.Mui-selected": {
                            color: "primary.main",
                        }
                    }}
                >
                    <Tab label="Communication Frequency" aria-label='communication-frequency-tab' />
                    <Tab label="Overdue Communication Trend" aria-label='overdue-communication-tab' />
                    <Tab label="Activity Log" aria-label='activity-log-tab' />
                </Tabs>
            </Paper>
            <Box sx={{ marginTop: 2, padding: 2 }} >
                {tabValue === 0 && <CommunicationFrequencyReport />}
                {tabValue === 1 && <OverdueCommunicationTrend />}
                {tabValue === 2 && <ActivityLog />}
            </Box>
        </Box>
    );
};

export default ReportingModule;