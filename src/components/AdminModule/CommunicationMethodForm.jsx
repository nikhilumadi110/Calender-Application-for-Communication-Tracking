// src/components/AdminModule/CommunicationMethodForm.jsx
import React, { useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    FormControlLabel,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    OutlinedInput,
} from '@mui/material';
import useAdminModule from './useAdminModule';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    sequence: Yup.number()
        .required('Sequence is required')
        .oneOf([1, 2, 3, 4, 5], 'Invalid sequence value'),
    mandatory: Yup.boolean(),
});

const CommunicationMethodForm = ({ handleClose, method }) => {
    const { addCommunicationMethod, updateCommunicationMethod } = useAdminModule();
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            sequence: 1,
            mandatory: false,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (method) {
                    await updateCommunicationMethod({ ...method, ...values });
                    toast.success('Communication Method Updated Successfully', {
                        theme: 'colored',
                    });
                } else {
                    await addCommunicationMethod(values);
                    toast.success('Communication Method Created Successfully', {
                        theme: 'colored',
                    });
                }

                handleClose();
            } catch (error) {
                toast.error('Error occurred. Please try again later.', {
                    theme: 'colored',
                });
            }
        },
    });

    useEffect(() => {
        if (method) {
            formik.setValues(method);
        }
    }, [method]);

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
                label="Description"
                margin="normal"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
            />
            <FormControl
                fullWidth
                margin="normal"
                error={formik.touched.sequence && Boolean(formik.errors.sequence)}
            >
                <InputLabel id="sequence-label">Sequence</InputLabel>
                <Select
                   labelId="sequence-label"
                    id="sequence"
                    name="sequence"
                    value={formik.values.sequence}
                   onChange={formik.handleChange}
                   input={<OutlinedInput label="Sequence" />}
                >
                    {[1, 2, 3, 4, 5].map((index) => (
                        <MenuItem key={index} value={index}>
                            {index}
                        </MenuItem>
                    ))}
                </Select>
                {formik.touched.sequence && formik.errors.sequence && (
                    <FormHelperText>{formik.errors.sequence}</FormHelperText>
                )}
            </FormControl>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formik.values.mandatory}
                        onChange={formik.handleChange}
                        name="mandatory"
                    />
                }
                label="Mandatory"
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button onClick={handleClose} sx={{ mr: 1 }}>
                    Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    {method ? 'Update' : 'Add'}
                </Button>
            </Box>
        </form>
    );
};

export default CommunicationMethodForm;