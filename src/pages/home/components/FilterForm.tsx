import {
  BAutoComplete,
  BDateRangePicker,
  BSlider,
  BSubmitButton,
  BTextField,
} from '@brent/form-ui';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

const allColors = [
  { title: 'Red', value: 'red' },
  { title: 'Green', value: 'green' },
  { title: 'Blue', value: 'blue' },
  { title: 'Yellow', value: 'yellow' },
];

const useStyles = makeStyles((theme) => ({
  filterTitle: {},
  filterButton: {
    marginTop: 20,
  },
}));

const INITIAL_FORM_STATE = {
  color: [],
  model: '',
  minWeight: '',
  maxWeight: '',
  startDate: '',
  endDate: '',
  score: [0, 5],
};
const FORM_VALIDATION = Yup.object().shape({});

interface IFilterFormProps {
  onFilterChange: (query: any) => void;
}

export const FilterForm = (props: IFilterFormProps) => {
  const classes = useStyles();

  return (
    <Formik
      initialValues={INITIAL_FORM_STATE}
      validationSchema={FORM_VALIDATION}
      onSubmit={(values) => {
        let filterData: any = {
          color: values.color,
          weight: { min: values.minWeight, max: values.maxWeight },
          model: values.model,
          score: { min: values.score[0], max: values.score[1] },
          date: {
            startDate: values.startDate
              ? new Date(new Date(values.startDate).toUTCString()).getTime()
              : null,

            endDate: values.endDate
              ? new Date(new Date(values.endDate).toUTCString()).getTime()
              : null,
          },
        };

        // if (values.startDate) {
        // 	filterData.date.startDate = new Date(
        // 		new Date(values.startDate).toUTCString()
        // 	).getTime();
        // }
        // if (values.endDate) {
        // 	filterData.date.endDate = new Date(
        // 		new Date(values.endDate).toUTCString()
        // 	).getTime();
        // }

        props.onFilterChange(filterData);
      }}
    >
      <Form>
        <Card>
          <CardContent>
            <Typography
              className={classes.filterTitle}
              color='textSecondary'
              gutterBottom
            >
              Filter
            </Typography>
            <Divider variant='fullWidth' />
            <BTextField
              name='model'
              margin='normal'
              label='Model'
              size='small'
            />

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <BTextField
                  name='minWeight'
                  margin='normal'
                  label='Min Weight'
                  size='small'
                  type='number'
                />
              </Grid>
              <Grid item xs={6}>
                <BTextField
                  name='maxWeight'
                  margin='normal'
                  label='Max Weight'
                  size='small'
                  type='number'
                />
              </Grid>
            </Grid>
            <BAutoComplete name='color' options={allColors}></BAutoComplete>

            <BDateRangePicker startDateName='startDate' endDateName='endDate'>
              {({ StartDateComp, EndDateComp }: any) => {
                return (
                  <>
                    <StartDateComp></StartDateComp>
                    <EndDateComp></EndDateComp>
                  </>
                );
              }}
            </BDateRangePicker>

            {/* <BTextField
							name='startDate'
							margin='normal'
							type='date'
							label='Start Date'
							InputLabelProps={{ shrink: true }}
							size='small'
						/>
						<BTextField
							name='endDate'
							margin='normal'
							type='date'
							label='End Date'
							InputLabelProps={{ shrink: true }}
							size='small'
						/> */}

            <BSlider label='Score' name='score' step={0.5} min={0} max={5} />

            <BSubmitButton
              fullWidth
              variant='outlined'
              className={classes.filterButton}
            >
              Apply Filters
            </BSubmitButton>
          </CardContent>
        </Card>
      </Form>
    </Formik>
  );
};
