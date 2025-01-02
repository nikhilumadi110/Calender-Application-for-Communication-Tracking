// src/components/AdminModule/initialData.js
import { v4 as uuidv4 } from 'uuid';

export const initialCompanies = [
    {
      id: uuidv4(),
      name: 'Tech Solutions Inc.',
      location: 'New York',
      linkedInProfile: 'https://www.linkedin.com/company/techsolutionsinc',
      emails: ['info@techsolutions.com'],
      phoneNumbers: ['+1 212-555-1212'],
      comments: 'A leading tech company',
      communicationPeriodicity: 14,
    },
    {
      id: uuidv4(),
      name: 'Global Marketing Agency',
      location: 'London',
      linkedInProfile: 'https://www.linkedin.com/company/globalmarketing',
      emails: ['contact@globalmarketing.com'],
      phoneNumbers: ['+44 20 7946 0000'],
      comments: 'Global marketing agency',
      communicationPeriodicity: 7,
    },
     {
        id: uuidv4(),
        name: 'Creative Designs Ltd.',
        location: 'San Francisco',
        linkedInProfile: 'https://www.linkedin.com/company/creativedesignsltd',
        emails: ['hello@creativedesigns.com'],
        phoneNumbers: ['+1 415-888-7777'],
        comments: 'Creative design agency.',
        communicationPeriodicity: 10,
    },
    {
        id: uuidv4(),
        name: 'Data Analytics Corp',
        location: 'Singapore',
        linkedInProfile: 'https://www.linkedin.com/company/dataanalytics',
        emails: ['info@dataanalytics.sg'],
        phoneNumbers: ['+65 6222 3333'],
        comments: 'Data analysis solutions.',
        communicationPeriodicity: 21,
    },
    {
        id: uuidv4(),
        name: 'Health Innovators Group',
        location: 'Sydney',
        linkedInProfile: 'https://www.linkedin.com/company/healthinnovators',
        emails: ['contact@healthinnovators.au'],
         phoneNumbers: ['+61 2 9876 5432'],
        comments: 'Innovations in health technology.',
        communicationPeriodicity: 30,
    }
  ];

export const initialMethods = [
    {
        id: uuidv4(),
        name: 'LinkedIn Post',
        description: 'Post a new update on LinkedIn.',
        sequence: 1,
        mandatory: false,
    },
    {
        id: uuidv4(),
        name: 'LinkedIn Message',
        description: 'Send a private message on LinkedIn.',
        sequence: 2,
        mandatory: false,
    },
    {
        id: uuidv4(),
        name: 'Email',
        description: 'Send an email.',
        sequence: 3,
        mandatory: true,
    },
    {
        id: uuidv4(),
        name: 'Phone Call',
        description: 'Call the company',
        sequence: 4,
        mandatory: true,
    },
    {
        id: uuidv4(),
        name: 'Other',
        description: 'Other communication method.',
        sequence: 5,
        mandatory: false,
    },
];