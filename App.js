import React from 'react';
import { View, Text, SafeAreaView, TextInput, Button, ActivityIndicator, Switch } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';

const FieldWrapper = ({ children, label, formikProps, formikKey }) => {
  return (
    <View style={{ marginHorizontal: 20, marginVertical: 5 }}>
      <Text style={{ marginBottom: 3 }}>{label}</Text>
      {children}
      <Text style={{ color: 'red' }}>
        {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
      </Text>
    </View>
  );
};

const StyledInput = ({ label, formikProps, formikKey, ...rest }) => {
  const inputStyles = {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 3
  }

  if(formikProps.touched[formikKey] && formikProps.errors[formikKey]) {
    inputStyles.borderColor = 'red';
  }

  return (
    <FieldWrapper
      label={label}
      formikProps={formikProps}
      formikKey={formikKey}
    >
      <TextInput
        style={inputStyles}
        onChangeText={formikProps.handleChange(formikKey)}
        onBlur={formikProps.handleBlur(formikKey)}
        {...rest}
      />
    </FieldWrapper>
  );
};

const StyledSwitch = ({ label, formikProps, formikKey, ...rest }) => {
  return (
    <FieldWrapper
      label={label}
      formikKey={formikKey}
      formikProps={formikProps}
    >
      <Switch
        value={formikProps.values[formikKey]}
        onValueChange={value => {
          formikProps.setFieldValue(formikKey, value);
        }}
        {...rest}
      />
    </FieldWrapper>
  );
};

const signUp = ({ email }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(email === 'a@a.com') {
        reject(new Error('Fake email'));
      }
      resolve(true);
    }, 1000);
  })
};

const validationSchema = yup.object().shape({
  email: yup.string().label('Email').email().required(),
  password: yup.string().label('Password').required().min(2, 'Too short').max(10, 'Too long'),
  confirmPassword: yup.string().label('Confirm Password').required().test('passwords-match', 'Passwords must match', function (value) {
    return this.parent.password === value;
  }),
  agreeToTerms: yup.boolean().label('Terms').test('is-true', 'Must agree to terms to continue', (value) => value === true)
});

const App = () => {
  return (
    <SafeAreaView style={{ marginTop: 90 }}>
      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '', agreeToTerms: false }}
        onSubmit={(values, actions) => {
          signUp({ email: values.email })
            .then(() => {
              alert(JSON.stringify(values));
            })
            .catch((error) => {
              actions.setFieldError('general', error.message);
            })
            .finally(() => {
              actions.setSubmitting(false);
            })
        }}
        validationSchema={validationSchema}
      >
        {formikProps => (
          <>
            <StyledInput
              label='Email'
              formikProps={formikProps}
              formikKey='email'
              placeholder='abc@example.com'
              autoFocus
            />

            <StyledInput
              label='Password'
              formikProps={formikProps}
              formikKey='password'
              placeholder='********'
              secureTextEntry
            />

            <StyledInput
              label='Confirm Password'
              formikProps={formikProps}
              formikKey='confirmPassword'
              placeholder='********'
              secureTextEntry
            />

            <StyledSwitch
              label='Agree to Terms'
              formikKey='agreeToTerms'
              formikProps={formikProps}
            />
            
            {formikProps.isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <>
                <Button
                  title='Submit'
                  onPress={formikProps.handleSubmit}
                />
                  <Text style={{ color: 'red' }}>{formikProps.errors.general}</Text>
              </>
            )}
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default App;