// src/components/AdminModule/AdminModule.jsx
import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Tabs,
    Tab,
    Tooltip
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CompanyTable from './CompanyTable';
import CommunicationMethodTable from './CommunicationMethodTable';
import ReportingModule from '../ReportingModule/ReportingModule';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const open = Boolean(anchorEl);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box>
            <AppBar position="static">
                 <Toolbar style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: "20px", paddingRight: "20px" }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Admin Dashboard
                    </Typography>
                     <IconButton color="inherit" onClick={handleMenuOpen} sx={{padding: 0}}>
                         <Tooltip title="Profile">
                              <Avatar sx={{ bgcolor: 'primary.main', width: '40px', height: "40px"}}>
                                 <AccountCircle />
                             </Avatar>
                         </Tooltip>
                    </IconButton>

                    <Menu
                        id="profile-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
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
                         <MenuItem onClick={handleLogout}>
                            Logout
                        </MenuItem>
                    </Menu>

                </Toolbar>
                 <Box display="flex" justifyContent="center" >
                      <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="admin-navigation-tabs"
                        TabIndicatorProps={{
                          style: {
                           backgroundColor: "primary.main",
                          },
                         }}
                       sx={{
                        backgroundColor: 'white',
                         boxShadow: "none",
                           "& .MuiTab-root.Mui-selected": {
                                color: "primary.main",
                         }
                          }}
                      >
                         <Tab label="Companies"  aria-label="companies-tab" />
                        <Tab label="Communication Methods"  aria-label="communication-methods-tab" />
                        <Tab label="Reports & Analytics"  aria-label='reports-tab' />
                      </Tabs>
                 </Box>
            </AppBar>
            <Box p={3}>
                {activeTab === 0 && <CompanyTable />}
                {activeTab === 1 && <CommunicationMethodTable />}
                {activeTab === 2 && <ReportingModule />}
            </Box>
        </Box>
    );
};

export default AdminDashboard;