// src/components/UserModule/UserModule.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, Menu, MenuItem } from '@mui/material';
import { Logout as LogoutIcon, AccountCircle } from '@mui/icons-material';
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
    const [isCalenderOpen, setIsCalenderOpen] = useState(false);
     const [activeTab, setActiveTab] = useState(0);
    const totalOverDue = companies.filter(company => isOverdue(company)).length;
    const totalDueToday = companies.filter(company => isDueToday(company)).length;
     const [anchorEl, setAnchorEl] = useState(null); // For Profile Dropdown
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleOpenCalender = () => {
        setIsCalenderOpen(true);
      setActiveTab(1);
    };
     const handleOpenNotifications = () => {
          setActiveTab(2);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
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
                 setActiveTab={setActiveTab}
            >
                <Box p={3} className="relative">
                     {activeTab === 0 && (
                         <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h4" color="text.primary" >Welcome, {user?.username}!</Typography>
                                <Button variant="contained" color="primary" onClick={handleOpenModal}>
                                Log Communication
                             </Button>
                            </Box>
                            <CompanyGrid />
                         </Box>
                    )}
                     {activeTab === 1 && (
                        <CalendarView open={isCalenderOpen} handleClose={handleCloseCalender} />
                    )}
                    {activeTab === 2 && (
                        <NotificationCenter totalOverDue={totalOverDue} totalDueToday={totalDueToday}  />
                    )}
                    <CommunicationActionModal open={isModalOpen} handleClose={handleCloseModal} />
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleProfileMenuClose}
                         MenuListProps={{
                            sx: {
                                padding: 1,
                            }
                         }}
                        sx={{
                            "& .MuiPaper-root": {
                                marginTop: "10px",
                            }
                        }}
                    >
                        <MenuItem disabled>
                             <Typography sx={{fontWeight: "bold", }}> {user?.username} </Typography>
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