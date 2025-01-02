// src/components/AdminModule/CommunicationMethodForm.jsx
import React, { useEffect, useState } from 'react';
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
     Grid,
      CircularProgress
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
    const [loading, setLoading] = useState(false);
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            sequence: 1,
            mandatory: false,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
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
            } finally {
                setLoading(false);
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
             <Grid container spacing={2}>
                <Grid item xs={12}>
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
                </Grid>
               <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
                 <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12} sx={{mt: 2}} display="flex" justifyContent="flex-end">
                     <Button onClick={handleClose} sx={{ mr: 1 }} disabled={loading}>
                        Cancel
                     </Button>
                   <Button type="submit" variant="contained" color="primary" disabled={loading}>
                       {loading ? <CircularProgress size={20} /> : (method ? 'Update' : 'Add')}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default CommunicationMethodForm;