// src/components/AdminModule/initialData.js
import { v4 as uuidv4 } from 'uuid';
export const initialCompanies = [
    {
      id: uuidv4(),
      name: 'Tech Solutions Inc.',
      location: 'New York',
      linkedInProfile: 'https://www.linkedin.com/company/techsolutionsinc',
      emails: ['info@techsolutions.com'],
      phoneNumbers: ['212-555-1212'],
      comments: 'A leading tech company',
      communicationPeriodicity: 14,
    },
    {
      id: uuidv4(),
      name: 'Global Marketing Agency',
      location: 'London',
      linkedInProfile: 'https://www.linkedin.com/company/globalmarketing',
      emails: ['contact@globalmarketing.com'],
      phoneNumbers: ['+44-20-7946-0000'],
      comments: 'Global marketing agency',
      communicationPeriodicity: 7,
    },
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