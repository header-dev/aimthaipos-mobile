import React, { useEffect, useState } from 'react';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Formik } from 'formik';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyleSheet } from 'react-native';
import {
  Container,
  Body,
  Footer,
  Header,
  Input,
  Item,
  Left,
  Text,
  Title,
  Right,
  View,
  Button,
  Toast,
  Label,
  Form,
  Picker,
  Icon,
  Thumbnail,
  CheckBox,
} from 'native-base';
import { ActivityIndicator } from 'react-native';

export default function MenuSearchForm({
  values,
  categories,
  validateSchema,
  onSubmit,
  isLoading,
}) {
  return (
    <KeyboardAwareScrollView>
      <View
        style={{
          flex: 0.8,
          flexDirection: 'column',
          alignItems: 'center',
          padding: 20,
          marginTop: 30,
        }}
      >
        <Formik
          initialValues={values}
          enableReinitialize
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={validateSchema}
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
                <Item
                  rounded
                  style={styles.inputLogin}
                  error={Boolean(errors.name && touched.name)}
                >
                  <MaterialIcons
                    name="format-list-numbered"
                    style={styles.iconInput}
                  />
                  <Input
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    placeholder="Name"
                    placeholderTextColor="#a4a4a4"
                    style={{ fontSize: 16 }}
                    value={values.name}
                  />
                </Item>
                <Item
                  rounded
                  style={{ ...styles.inputLogin, width: 'auto' }}
                  error={Boolean(errors.categoryId && touched.categoryId)}
                >
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    placeholder="Category"
                    placeholderStyle={{ color: '#bfc6ea' }}
                    placeholderIconColor="#007aff"
                    selectedValue={values.categoryId}
                    onValueChange={handleChange('categoryId')}
                  >
                    {categories &&
                      categories.map((i) => (
                        <Picker.Item label={i.name} value={`${i.id}`} />
                      ))}
                  </Picker>
                </Item>
                <Item
                  rounded
                  style={{ ...styles.inputLogin, width: 'auto' }}
                  error={Boolean(errors.type && touched.type)}
                >
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    placeholder="Type"
                    placeholderStyle={{ color: '#bfc6ea' }}
                    placeholderIconColor="#007aff"
                    selectedValue={values.type}
                    onValueChange={(value) => {
                      setFieldValue('type', value);
                    }}
                  >
                    <Picker.Item label="All Type" value="" />
                    <Picker.Item label="General Type" value="general" />
                    <Picker.Item label="Protein Type" value="protein" />
                    <Picker.Item label="Set Type" value="set" />
                    <Picker.Item label="Vegetarian Type" value="vegetarian" />
                    <Picker.Item label="Drink Type" value="drink" />
                  </Picker>
                </Item>
                <Item
                  rounded
                  style={[
                    styles.inputLogin,
                    { padding: 10, justifyContent: 'space-evenly' },
                  ]}
                >
                  <CheckBox
                    checked={values.subsetmenu}
                    onPress={() => {
                      setFieldValue('subsetmenu', !values.subsetmenu);
                    }}
                  />
                  <Body
                    style={{
                      marginLeft: 20,
                      alignItems: 'flex-start',
                    }}
                  >
                    <Text>Menu Sub Set</Text>
                  </Body>
                </Item>
              </Form>
              <Button
                rounded
                block
                onPress={handleSubmit}
                style={styles.button_auth}
              >
                {isLoading && <ActivityIndicator animating />}
                <Text>Filter</Text>
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
    // borderColor: '#a4a4a4',
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
