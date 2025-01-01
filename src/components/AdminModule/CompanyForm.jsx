// src/components/AdminModule/CompanyForm.jsx
import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    IconButton,
    FormControl,
    FormHelperText,
    InputAdornment
} from '@mui/material';
import useAdminModule from './useAdminModule';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    location: Yup.string().required('Location is required'),
    linkedInProfile: Yup.string().url('Invalid URL').nullable(),
    emails: Yup.array()
        .of(Yup.string().email('Invalid email').required('Email is required'))
        .min(1, 'At least one email is required')
        .max(5, 'You cannot add more than 5 emails'),
    phoneNumbers: Yup.array()
        .of(Yup.string().matches(/^(\+\d{1,3}\s?)?((\(\d{1,3}\))|\d{1,3})[\s-]?\d{1,3}[\s-]?\d{4}$/, 'Invalid phone number format (e.g. +1 123-456-7890)').required('Phone number is required'))
        .min(1, 'At least one phone number required')
        .max(5, "You cannot add more than 5 phone numbers"),
    comments: Yup.string(),
    communicationPeriodicity: Yup.number().required('Communication periodicity is required')
        .positive('Must be a positive number').integer('Must be an integer'),
});

const CompanyForm = ({ handleClose, company }) => {
    const { addCompany, updateCompany } = useAdminModule();
    const [emailFields, setEmailFields] = useState(['']);
    const [phoneFields, setPhoneFields] = useState(['']);

    const formik = useFormik({
        initialValues: {
            name: '',
            location: '',
            linkedInProfile: '',
            emails: [''],
            phoneNumbers: [''],
            comments: '',
            communicationPeriodicity: 14,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (company) {
                    await updateCompany({ ...company, ...values });
                    toast.success('Company Updated Successfully', {
                        theme: "colored",
                    });
                } else {
                    await addCompany(values);
                    toast.success('Company Created Successfully', {
                        theme: "colored",
                    });
                }
                handleClose();
            } catch (error) {
                toast.error('Error occurred. Please try again later.', {
                    theme: "colored",
                });
            }
        },
    });

    useEffect(() => {
        if (company) {
            formik.setValues({
                ...company,
            });
            setEmailFields(company.emails);
            setPhoneFields(company.phoneNumbers);
        }
    }, [company]);

    useEffect(() => {
        formik.setFieldValue('emails', emailFields);
    }, [emailFields]);

    useEffect(() => {
        formik.setFieldValue('phoneNumbers', phoneFields);
    }, [phoneFields]);

    const handleAddEmail = () => {
        if (emailFields.length < 5) {
            setEmailFields([...emailFields, '']);
        } else {
            toast.warn("You can not add more than 5 emails", { theme: "colored" });
        }
    };

    const handleRemoveEmail = (index) => {
        const newEmailFields = [...emailFields];
        newEmailFields.splice(index, 1);
        setEmailFields(newEmailFields);
    };

    const handleAddPhone = () => {
        if (phoneFields.length < 5) {
            setPhoneFields([...phoneFields, '']);
        } else {
            toast.warn("You can not add more than 5 phone numbers", { theme: "colored" });
        }
    };

    const handleRemovePhone = (index) => {
        const newPhoneFields = [...phoneFields];
        newPhoneFields.splice(index, 1);
        setPhoneFields(newPhoneFields);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <TextField
                fullWidth
                label="Name"
                margin="normal"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
                fullWidth
                label="Location"
                margin="normal"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
            />
            <TextField
                fullWidth
                label="LinkedIn Profile"
                margin="normal"
                name="linkedInProfile"
                value={formik.values.linkedInProfile}
                onChange={formik.handleChange}
                error={formik.touched.linkedInProfile && Boolean(formik.errors.linkedInProfile)}
                helperText={formik.touched.linkedInProfile && formik.errors.linkedInProfile}
                InputProps={{
                  startAdornment: (
                      <InputAdornment position="start">
                          https://
                      </InputAdornment>
                    ),
               }}
            />
            <Typography variant="subtitle1" color="text.secondary" mt={2}>
                Emails:
            </Typography>
            {emailFields.map((email, index) => (
                <Box display="flex" alignItems="center" key={index} mb={1}>
                    <TextField
                        fullWidth
                        label={`Email ${index + 1}`}
                        margin="normal"
                        value={email}
                        onChange={(e) => {
                            const newEmails = [...emailFields];
                            newEmails[index] = e.target.value;
                            setEmailFields(newEmails);
                            formik.setFieldValue(`emails[${index}]`, e.target.value);
                        }}
                        error={formik.touched.emails && Boolean(formik.errors.emails?.[index])}
                       helperText={formik.touched.emails && formik.errors.emails?.[index]}
                    />
                    {emailFields.length > 1 && (
                        <IconButton
                            onClick={() => handleRemoveEmail(index)}
                            aria-label="remove-email"
                            color="error"
                        >
                            <RemoveIcon />
                        </IconButton>
                    )}
                </Box>
            ))}
             {formik.touched.emails && formik.errors.emails && typeof formik.errors.emails === 'string' && (
            <FormControl fullWidth error margin='normal'>
            <FormHelperText>{formik.errors.emails}</FormHelperText>
            </FormControl>
             )}

            <Button startIcon={<AddIcon />} sx={{ mt: 1 }} onClick={handleAddEmail}>
                Add Email
            </Button>
            <Typography variant="subtitle1" color="text.secondary" mt={2}>
                Phone Numbers:
            </Typography>
            {phoneFields.map((phone, index) => (
                <Box display="flex" alignItems="center" key={index} mb={1}>
                    <TextField
                        fullWidth
                        label={`Phone Number ${index + 1}`}
                        margin="normal"
                        value={phone}
                        onChange={(e) => {
                            const newPhones = [...phoneFields];
                            newPhones[index] = e.target.value;
                            setPhoneFields(newPhones);
                            formik.setFieldValue(`phoneNumbers[${index}]`, e.target.value);
                        }}
                         error={formik.touched.phoneNumbers && Boolean(formik.errors.phoneNumbers?.[index])}
                        helperText={formik.touched.phoneNumbers && formik.errors.phoneNumbers?.[index]}
                    />
                    {phoneFields.length > 1 && (
                        <IconButton
                            onClick={() => handleRemovePhone(index)}
                            aria-label="remove-phone"
                            color="error"
                        >
                            <RemoveIcon />
                        </IconButton>
                    )}
                </Box>
            ))}
           {formik.touched.phoneNumbers && formik.errors.phoneNumbers && typeof formik.errors.phoneNumbers === 'string' && (
            <FormControl fullWidth error margin='normal'>
             <FormHelperText>{formik.errors.phoneNumbers}</FormHelperText>
          </FormControl>
           )}
            <Button startIcon={<AddIcon />} sx={{ mt: 1 }} onClick={handleAddPhone}>
                Add Phone Number
            </Button>
            <TextField
                fullWidth
                label="Comments"
                margin="normal"
                name="comments"
                value={formik.values.comments}
                onChange={formik.handleChange}
                error={formik.touched.comments && Boolean(formik.errors.comments)}
                helperText={formik.touched.comments && formik.errors.comments}
               multiline
                rows={3}
            />
            <TextField
                fullWidth
                label="Communication Periodicity (Days)"
                margin="normal"
                type="number"
                name="communicationPeriodicity"
                value={formik.values.communicationPeriodicity}
                onChange={formik.handleChange}
                error={formik.touched.communicationPeriodicity && Boolean(formik.errors.communicationPeriodicity)}
                helperText={formik.touched.communicationPeriodicity && formik.errors.communicationPeriodicity}
                 InputProps={{
                  endAdornment: <InputAdornment position="end">days</InputAdornment>,
                }}
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button onClick={handleClose} sx={{ mr: 1 }}>
                    Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    {company ? 'Update' : 'Add'}
                </Button>
            </Box>
        </form>
    );
};

export default CompanyForm;