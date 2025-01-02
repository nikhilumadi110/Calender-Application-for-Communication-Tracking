// src/components/UserModule/CompanyGrid.jsx
import React, { useState, useEffect, useMemo } from 'react';
import useUserModule from './useUserModule.js';
import { format } from 'date-fns';
import {
    Email as EmailIcon,
    Message as MessageIcon,
    Phone as PhoneIcon,
    PostAdd as PostAddIcon,
    MoreHoriz as MoreHorizIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    InputBase,
    Box,
    styled,
    alpha,
    Typography,
    Switch,
    Tooltip,
     CircularProgress,
} from '@mui/material';

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    margin: theme.spacing(2, 0),
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    borderRadius: theme.shape.borderRadius,
    '& .MuiTableCell-root': {
        padding: theme.spacing(2),
    },
}));

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.03),
    },
    marginBottom: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: '300px',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1.5, 1.5, 1.5, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        width: '100%',
    },
}));

const CommunicationCard = styled(Box)(({ theme, isOverdue, isDueToday, highlightsEnabled }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: highlightsEnabled
        ? isOverdue
            ? alpha('#ef4444', 0.1)
            : isDueToday
                ? alpha('#eab308', 0.1)
                : theme.palette.background.paper
        : theme.palette.background.paper,
    border: `1px solid ${highlightsEnabled
        ? isOverdue
            ? '#ef4444'
            : isDueToday
                ? '#eab308'
                : theme.palette.divider
        : theme.palette.divider
    }`,
    '&:hover': {
        backgroundColor: highlightsEnabled
            ? isOverdue
                ? alpha('#ef4444', 0.15)
                : isDueToday
                    ? alpha('#eab308', 0.15)
                    : alpha(theme.palette.primary.main, 0.05)
            : alpha(theme.palette.primary.main, 0.05),
    },
}));

const getIconForCommunicationType = (type) => {
    switch (type?.toLowerCase()) {
        case 'email':
            return <EmailIcon fontSize="small" />;
        case 'linkedin message':
             return <MessageIcon fontSize="small" />;
        case 'phone call':
            return <PhoneIcon fontSize="small" />;
        case 'linkedin post':
            return <PostAddIcon fontSize="small" />;
        default:
            return <MoreHorizIcon fontSize="small" />;
    }
};

const CompanyGrid = () => {
    const {
        companies,
        communicationMethods,
        getCompanyCommunication,
        getCompanyNextCommunications,
        getCompanyNextCommunication,
        isOverdue,
        isDueToday
    } = useUserModule();

    const [searchQuery, setSearchQuery] = useState('');
      const [highlightSettings, setHighlightSettings] = useState({});
    const [loading, setLoading] = useState(true);


      useEffect(() => {
           setLoading(true);
         // Initialize highlight settings for all companies
         const initialSettings = companies.reduce((acc, company) => ({
           ...acc,
             [company.id]: true // Default to enabled
        }), {});
        setHighlightSettings(initialSettings);
           setLoading(false);
      }, [companies]);

      const formatDate = (date) => {
          if (!date) return 'N/A';
           return format(new Date(date), 'MMM do, yyyy');
     };


    const toggleHighlight = (companyId) => {
        setHighlightSettings(prev => ({
            ...prev,
            [companyId]: !prev[companyId]
        }));
    };

    const filteredCompanies = useMemo(() => {
       return companies.filter(company =>
           company.name.toLowerCase().includes(searchQuery.toLowerCase())
         )
     }, [companies, searchQuery]);

    return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1" fontWeight="bold">
                    Company Communications Dashboard
                </Typography>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Search>
            </Box>
              <StyledTableContainer component={Paper}>
                <Table>
                   <TableHead>
                        <TableRow>
                            <TableCell width="5%">
                                <Typography variant="subtitle2" fontWeight="bold">#</Typography>
                           </TableCell>
                            <TableCell width="20%">
                                 <Typography variant="subtitle2" fontWeight="bold">Company Name</Typography>
                            </TableCell>
                            <TableCell width="45%">
                                <Typography variant="subtitle2" fontWeight="bold">Last Five Communications</Typography>
                            </TableCell>
                            <TableCell width="25%">
                                <Typography variant="subtitle2" fontWeight="bold">Next Scheduled</Typography>
                            </TableCell>
                            <TableCell width="5%" align="center">
                                <Typography variant="subtitle2" fontWeight="bold">Highlights</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                     <TableBody>
                         {loading ? (
                              <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{p: 2}}> <CircularProgress /> </TableCell>
                                </TableRow>
                            ) : filteredCompanies.length > 0 ? (
                                filteredCompanies.map((company, index) => {
                                   const lastFiveCommunications = getCompanyCommunication(company.id).slice(0, 5);
                                    const nextCommunication = getCompanyNextCommunication(company)
                                    const nextCommType = company.nextCommunicationType
                                        ? communicationMethods.find(method => method.id === company.nextCommunicationType)?.name
                                          : null;
                                    const companyIsOverdue = isOverdue(company);
                                    const companyIsDueToday = isDueToday(company);
                                    const highlightsEnabled = highlightSettings[company.id];
                                  return (
                                        <TableRow key={company.id}>
                                           <TableCell>
                                                 <Typography>{index + 1}</Typography>
                                            </TableCell>
                                             <TableCell>
                                               <Typography variant="body1" fontWeight="medium">
                                                    {company.name}
                                                 </Typography>
                                            </TableCell>
                                             <TableCell>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                    {lastFiveCommunications.map(comm => {
                                                         const commType = communicationMethods.find(
                                                             method => method.id === comm.communicationType
                                                         )?.name;
                                                          return (
                                                             <Tooltip
                                                                 key={comm.id}
                                                                title={comm.notes || 'No notes available'}
                                                                 arrow
                                                                 placement="top"
                                                            >
                                                                <CommunicationCard>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                                                                        {getIconForCommunicationType(commType)}
                                                                         <Typography variant="body2">
                                                                             {commType || 'N/A'}
                                                                          </Typography>
                                                                    </Box>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {formatDate(comm.date)}
                                                                    </Typography>
                                                                </CommunicationCard>
                                                           </Tooltip>
                                                          );
                                                     })}
                                              </Box>
                                           </TableCell>
                                              <TableCell>
                                                    <Tooltip
                                                         title= {`${nextCommunication ?  'No notes available' : ': None scheduled'}`}
                                                           arrow
                                                           placement="top"
                                                        >
                                                        <CommunicationCard
                                                            isOverdue={companyIsOverdue}
                                                            isDueToday={companyIsDueToday}
                                                            highlightsEnabled={highlightsEnabled}
                                                          >
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                                                                       {nextCommType &&  getIconForCommunicationType(nextCommType)}
                                                                        <Typography variant="body2">
                                                                            {nextCommType || 'N/A'}
                                                                        </Typography>
                                                                  </Box>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {formatDate(nextCommunication)}
                                                                     </Typography>
                                                            </CommunicationCard>
                                                        </Tooltip>
                                              </TableCell>
                                            <TableCell align="center">
                                                 <Switch
                                                     checked={highlightsEnabled}
                                                     onChange={() => toggleHighlight(company.id)}
                                                    color="primary"
                                                    size="small"
                                                 />
                                           </TableCell>
                                       </TableRow>
                                    );
                                })
                            ) : (
                                 <TableRow>
                                       <TableCell colSpan={5} align="center" sx={{p: 2}}>
                                           <Typography variant="body1" color="text.secondary">
                                             No company data available for selected criteria.
                                            </Typography>
                                        </TableCell>
                                  </TableRow>
                                )}
                    </TableBody>
                </Table>
            </StyledTableContainer>
        </Box>
    );
};

export default CompanyGrid;