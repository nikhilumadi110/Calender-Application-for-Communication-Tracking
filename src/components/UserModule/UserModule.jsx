// src/components/UserModule/UserModule.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, Menu, MenuItem } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import CompanyGrid from './CompanyGrid';
import CommunicationActionModal from './CommunicationActionModal';
import NotificationCenter from './NotificationCenter';
import CalendarView from './CalendarView';
import useUserModule from './useUserModule.js';
import UserLayout from './UserLayout';
import ErrorBoundary from '../ErrorBoundary';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserModule = () => {
    const { isOverdue, isDueToday, companies } = useUserModule();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isCalenderOpen, setIsCalenderOpen] = useState(false);
    const totalOverDue = companies.filter(company => isOverdue(company)).length;
    const totalDueToday = companies.filter(company => isDueToday(company)).length;
    const [anchorEl, setAnchorEl] = useState(null); // For Profile Dropdown
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleOpenNotifications = () => {
        setIsNotificationOpen(true);
    };
    const handleOpenCalender = () => {
        setIsCalenderOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleCloseNotifications = () => {
        setIsNotificationOpen(false);
    };
    const handleCloseCalender = () => {
        setIsCalenderOpen(false);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <ErrorBoundary>
            <UserLayout
                handleOpenCalender={handleOpenCalender}
                 handleOpenNotifications={handleOpenNotifications}
                totalOverDue={totalOverDue}
                totalDueToday={totalDueToday}
                handleProfileMenuOpen={handleProfileMenuOpen}
            >
                <Box p={3} className="relative">

                    <Typography variant="h4" color="text.primary" mb={2}>Welcome User!</Typography>
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <Button variant="contained" color="primary" onClick={handleOpenModal}>
                            Log Communication
                        </Button>
                    </Box>
                    <CompanyGrid />
                    <CommunicationActionModal open={isModalOpen} handleClose={handleCloseModal} />
                    <NotificationCenter open={isNotificationOpen} handleClose={handleCloseNotifications} totalOverDue={totalOverDue} totalDueToday={totalDueToday} />
                    <CalendarView open={isCalenderOpen} handleClose={handleCloseCalender} />
                     <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleProfileMenuClose}
                        >
                            <MenuItem disabled>
                                <Typography variant="body1"> {user?.username} </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout} >
                                <LogoutIcon sx={{ marginRight: 1 }} /> Logout
                            </MenuItem>
                        </Menu>
                </Box>
            </UserLayout>
        </ErrorBoundary>
    );
};

export default UserModule;