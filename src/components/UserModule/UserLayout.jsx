// src/components/UserModule/UserLayout.jsx
import React from 'react';
import { IconButton,  Tooltip } from '@mui/material';
import { CalendarMonth, AccountCircle as AccountCircleIcon, Notifications as NotificationsIcon } from '@mui/icons-material';

const UserLayout = ({ children, handleOpenCalender, handleOpenNotifications, totalOverDue, totalDueToday, handleProfileMenuOpen }) => {
    return (
        <div className="flex flex-col h-screen">
            <header className="bg-indigo-700 text-white py-4 px-6 flex items-center justify-between shadow-md">
                <h1 className="text-2xl font-bold">User Dashboard</h1>
                <div className="flex items-center gap-4">

                      <Tooltip title="Open Calendar">
                            <IconButton color="inherit" onClick={handleOpenCalender} sx={{ padding: '8px', '& svg': { fontSize: '24px' } }}>
                              <CalendarMonth/>
                           </IconButton>
                        </Tooltip>

                      <Tooltip title="Notifications">
                            <IconButton color="inherit" onClick={handleOpenNotifications} sx={{ padding: '8px', '& svg': { fontSize: '24px' } }} >
                                <NotificationsIcon />
                                {(totalOverDue + totalDueToday) > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        {totalOverDue + totalDueToday}
                                    </span>
                                )}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Profile">
                            <IconButton
                                color="inherit"
                                onClick={handleProfileMenuOpen}
                                sx={{ padding: '8px', '& svg': { fontSize: '24px' } , marginRight: '8px' }}
                            >
                                <AccountCircleIcon  />
                            </IconButton>
                         </Tooltip>



                </div>
            </header>
            <main className="flex-1 p-4 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default UserLayout;