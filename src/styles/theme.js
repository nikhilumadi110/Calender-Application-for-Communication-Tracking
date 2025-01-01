// src/styles/theme.js
import { createTheme } from '@mui/material/styles';
import { red, yellow, blue, green, grey, teal, indigo } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: indigo[700], // Royal blue as the primary color
            light: indigo[300],
            dark: indigo[900],
            contrastText: '#fff',
        },
        secondary: {
            main: teal[500],
            light: teal[300],
            dark: teal[700],
            contrastText: '#fff'
        },
        error: {
            main: red[500],
            light: red[300],
            dark: red[700],
            contrastText: '#fff',
        },
        warning: {
            main: yellow[700],
            light: yellow[400],
            dark: yellow[900],
            contrastText: '#fff',
        },
        background: {
            default: grey[100],
            paper: '#fff'
        },
        text: {
            primary: grey[800],
            secondary: grey[600],
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    elevation: 3,
                    transition: 'all 0.3s ease',
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        elevation: 6,
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: '#e0e0e0',
                        color: 'black',
                    }
                }
            }
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: '#f0f0f0',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: grey[400]
                        },
                        '&:hover fieldset': {
                            borderColor: grey[600],
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: indigo[700],
                        },
                    }
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: grey[400]
                        },
                        '&:hover fieldset': {
                            borderColor: grey[600],
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: indigo[700],
                        },
                    }
                }
            }
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                   backgroundColor: grey[200]
                }
            }
        }
    },
});

export default theme;