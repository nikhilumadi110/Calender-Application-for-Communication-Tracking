// src/components/UserModule/UserLayout.jsx
import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Avatar,
    Tooltip,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    styled
} from '@mui/material';
import {
    CalendarMonth,
    AccountCircle as AccountCircleIcon,
    Notifications as NotificationsIcon,
    Dashboard as DashboardIcon,
    Logout
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useUserModule from './useUserModule';

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
    color: theme.palette.text.primary,
}));
const StyledListItemText = styled(ListItemText)(({ theme }) => ({
    '& span': {
       display: 'flex',
       alignItems: 'center',
       gap: 4,
     },
}));

const UserLayout = ({ children, handleOpenCalender, setActiveTab }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

      const { isOverdue, isDueToday, companies } = useUserModule();
    const totalOverDue = companies.filter(company => isOverdue(company)).length;
    const totalDueToday = companies.filter(company => isDueToday(company)).length;
    const handleLogout = () => {
         logout();
        navigate('/login');
    };

    const drawerItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            onClick: () => { setActiveTab(0) },
            tabValue: 0,
        },
        {
            text: 'Calendar',
            icon: <CalendarMonth />,
            onClick: () => { handleOpenCalender(); setActiveTab(1); },
            tabValue: 1,
        },
        {
            text: 'Notifications',
            icon: <NotificationsIcon />,
            onClick: () => { setActiveTab(2) },
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
                        <DashboardIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        User Dashboard
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
                                onClick={() => {
                                    if (item.onClick) item.onClick();
                                    handleDrawerClose();
                                }}
                            >
                                <ListItemIcon >
                                    {item.icon}
                                </ListItemIcon>
                                <StyledListItemText primary={
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                       {item.text}
                                     {item.text === 'Notifications' && (totalOverDue + totalDueToday) > 0 && (
                                         <span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                            {totalOverDue + totalDueToday}
                                            </span>
                                        )}
                                     </Box>
                                    }
                                  />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List sx={{ marginTop: 'auto' }}>
                    <ListItem key="profile" disablePadding>
                        <ListItemButton disabled>
                            <StyledListItemIcon>
                                <Avatar sx={{ bgcolor: 'grey.500' }}>
                                    <AccountCircleIcon />
                                </Avatar>
                            </StyledListItemIcon>
                            <ListItemText primary={user?.username} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key="logout" disablePadding>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon sx={{ color: 'error.main' }}>
                                <Logout />
                            </ListItemIcon>
                            <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
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
                            <ListItemButton onClick={item.onClick} >
                                <ListItemIcon>
                                    {item.icon}
                                    </ListItemIcon>
                                  <StyledListItemText primary={
                                       <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                       {item.text}
                                     {item.text === 'Notifications' && (totalOverDue + totalDueToday) > 0 && (
                                         <span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                             {totalOverDue + totalDueToday}
                                           </span>
                                        )}
                                        </Box>
                                     }
                                 />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List sx={{ marginTop: 'auto' }}>
                    <ListItem key="profile" disablePadding>
                        <ListItemButton disabled>
                            <StyledListItemIcon>
                                <Avatar sx={{ bgcolor: 'grey.500' }}>
                                    <AccountCircleIcon />
                                </Avatar>
                            </StyledListItemIcon>
                            <ListItemText primary={user?.username} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key="logout" disablePadding>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon sx={{ color: 'error.main' }}>
                                <Logout />
                            </ListItemIcon>
                            <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default UserLayout;