import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Alert, Dimensions, StyleSheet } from 'react-native';
import { Input, Item, Text, View, Button, Form } from 'native-base';
import { CheckBox } from 'react-native-elements';
import { ActivityIndicator } from 'react-native';

var width = Dimensions.get('window').width;

export default function SaleRequestForm({ values, onSubmit, isSubmit }) {
  return (
    <KeyboardAwareScrollView>
      <View
        style={{
          flex: 0.8,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          marginTop: 10,
        }}
      >
        <Formik
          key={1}
          initialValues={values}
          enableReinitialize
          onSubmit={(values) => {
            onSubmit(values);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <>
              <Form>
                <CheckBox
                  title="No Garlic"
                  checked={values.no_garlic}
                  onPress={() => setFieldValue('no_garlic', !values.no_garlic)}
                />
                <CheckBox
                  title="No Peanut"
                  checked={values.no_peanut}
                  onPress={() => setFieldValue('no_peanut', !values.no_peanut)}
                />
                <CheckBox
                  title="No Onion"
                  checked={values.no_onion}
                  onPress={() => setFieldValue('no_onion', !values.no_onion)}
                />
                <CheckBox
                  title="No Beanshot"
                  checked={values.no_beanshot}
                  onPress={() =>
                    setFieldValue('no_beanshot', !values.no_beanshot)
                  }
                />
                <CheckBox
                  title="No Chilli"
                  checked={values.no_chilli}
                  onPress={() => setFieldValue('no_chilli', !values.no_chilli)}
                />
                <CheckBox
                  title="Mild"
                  checked={values.no_mind}
                  onPress={() => setFieldValue('no_mind', !values.no_mind)}
                />
                <CheckBox
                  title="Spicy"
                  checked={values.no_spicy}
                  onPress={() => setFieldValue('no_spicy', !values.no_spicy)}
                />
                <Item
                  rounded
                  style={styles.inputTextArea}
                  error={Boolean(errors.remark && touched.remark)}
                >
                  <FontAwesome name="sticky-note" style={styles.iconInput} />
                  <Input
                    onChangeText={handleChange('remark')}
                    onBlur={handleBlur('remark')}
                    placeholder="Remark"
                    placeholderTextColor="#a4a4a4"
                    style={{ fontSize: 16 }}
                    value={values.remark}
                    multiline
                    numberOfLines={5}
                  />
                </Item>
              </Form>
              <Button
                rounded
                block
                onPress={handleSubmit}
                style={styles.button_auth}
                disabled={isSubmit}
              >
                <Text>Save</Text>
              </Button>
            </>
          )}
        </Formik>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  inputLogin: {
    backgroundColor: '#FFFFFF',
    width: '80%',
    shadowRadius: 5,
    marginBottom: 10,
    color: '#a4a4a4',
  },
  inputTextArea: {
    backgroundColor: '#FFFFFF',
    width: '80%',
    shadowRadius: 5,
    marginBottom: 10,
    color: '#a4a4a4',
    height: 150,
  },
  button_auth: {
    width: '80%',
    alignSelf: 'center',
    backgroundColor: 'green',
    marginBottom: 8,
    height: 53,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  text_auth: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    width: '80%',
    marginTop: 5,
    color: '#808080',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  iconInput: {
    fontSize: 18,
    marginLeft: 18,
    marginRight: 5,
    color: '#a4a4a4',
  },
});
