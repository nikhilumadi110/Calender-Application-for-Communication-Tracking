// src/components/AdminModule/AdminModule.jsx
import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Avatar,
    Tabs,
    Tab,
    Container,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    styled
} from '@mui/material';
import { AccountCircle, Dashboard, Business, Settings, BarChart, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CompanyTable from './CompanyTable';
import CommunicationMethodTable from './CommunicationMethodTable';
import ReportingModule from '../ReportingModule/ReportingModule';

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiTypography-root': {
        color: theme.palette.text.primary,
    },
}));
const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
    color: theme.palette.text.primary,
}));

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const drawerItems = [
        {
            text: 'Companies',
            icon: <Business />,
            tabValue: 0,
        },
        {
            text: 'Communication Methods',
            icon: <Settings />,
            tabValue: 1,
        },
        {
            text: 'Reports & Analytics',
            icon: <BarChart />,
            tabValue: 2,
        },
    ];


    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: "20px", paddingRight: "20px" }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <Dashboard />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Admin Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                 sx={{
                     width: 240,
                     flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                    display: { xs: 'block', md: 'none' },
                 }}
                variant="temporary"
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerClose}
                ModalProps={{
                  keepMounted: true,
                }}
            >
                <Toolbar />
                <List>
                    {drawerItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                selected={activeTab === item.tabValue}
                                onClick={() => {
                                     handleTabChange(null, item.tabValue);
                                    handleDrawerClose();
                                }}
                            >
                                <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                                <StyledListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
              <Divider />
                <List sx={{marginTop: 'auto'}}>
                     <ListItem key="profile" disablePadding>
                        <ListItemButton disabled>
                            <StyledListItemIcon>
                                <Avatar sx={{ bgcolor: 'grey.500'}}> <AccountCircle /> </Avatar>
                            </StyledListItemIcon>
                             <StyledListItemText primary={user?.username} />
                         </ListItemButton>
                    </ListItem>
                     <ListItem key="logout" disablePadding>
                        <ListItemButton onClick={handleLogout} >
                            <ListItemIcon sx={{color: 'error.main'}}>
                                <Logout />
                            </ListItemIcon>
                           <ListItemText primary="Logout" sx={{color: 'error.main'}}/>
                       </ListItemButton>
                    </ListItem>
                 </List>
           </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                    display: { xs: 'none', md: 'block' },
                }}
                open
            >
                <Toolbar />
                <List>
                    {drawerItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                selected={activeTab === item.tabValue}
                                onClick={() => handleTabChange(null, item.tabValue)}
                            >
                                 <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                                <StyledListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                 <List sx={{marginTop: 'auto'}}>
                     <ListItem key="profile" disablePadding>
                        <ListItemButton disabled>
                             <StyledListItemIcon>
                                 <Avatar sx={{ bgcolor: 'grey.500'}}> <AccountCircle /> </Avatar>
                            </StyledListItemIcon>
                           <StyledListItemText primary={user?.username} />
                         </ListItemButton>
                    </ListItem>
                     <ListItem key="logout" disablePadding>
                       <ListItemButton onClick={handleLogout} >
                           <ListItemIcon sx={{color: 'error.main'}}>
                                <Logout />
                            </ListItemIcon>
                            <ListItemText primary="Logout"  sx={{color: 'error.main'}}/>
                       </ListItemButton>
                    </ListItem>
                 </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
               <Toolbar />
                <Container maxWidth="xl" >
                    {activeTab === 0 && <CompanyTable />}
                    {activeTab === 1 && <CommunicationMethodTable />}
                    {activeTab === 2 && <ReportingModule />}
               </Container>
           </Box>
        </Box>
    );
};

export default AdminDashboard;