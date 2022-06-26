import React, { useEffect, useState } from 'react';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Formik } from 'formik';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Alert,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Image as ImageElement } from 'react-native-elements';
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
// import { CheckBox } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator } from 'react-native';
import { BACKEND_URL, MENU_IMAGE } from '@env';
import Expo, { Constants, Permissions, Camera, MediaLibrary } from 'expo';
import { Platform } from 'react-native';

var width = Dimensions.get('window').width;

const initailThumb = require('./../../assets/thumbnail-empty.png');

export default function MenuForm({
  values,
  categories,
  validateSchema,
  onSubmit,
  isLoading,
}) {
  const [imageChanged, setImageChanged] = useState(false);
  const [image, setImage] = useState({
    uri: values.photo
      ? `${MENU_IMAGE}${values.photo}`
      : Image.resolveAssetSource(initailThumb).uri,
  });
  useEffect(() => {}, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageChanged(true);
      setImage({
        uri: result.uri,
      });
    }
  };

  const ctrlSubSet = (value) => {
    switch (value) {
      case 'general':
        return false;
        break;
      case 'protein':
        return false;
        break;
      case 'set':
        return true;
        break;
      case 'vegetarian':
        return false;
        break;
      case 'drink':
        return false;
        break;
      default:
        return true;
        break;
    }
  };

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
            onSubmit(image, values, imageChanged);
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
                <View
                  style={{
                    alignItems: 'center',
                    margin: 10,
                  }}
                >
                  <TouchableOpacity activeOpacity={0.7} onPress={pickImage}>
                    <ImageElement
                      style={{
                        width: 200,
                        height: 200,
                      }}
                      source={{ uri: image.uri }}
                      PlaceholderContent={<ActivityIndicator />}
                    />
                  </TouchableOpacity>
                </View>
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
                  style={styles.inputLogin}
                  error={Boolean(errors.cost && touched.cost)}
                >
                  <MaterialCommunityIcons
                    name="currency-usd"
                    style={styles.iconInput}
                  />
                  <Input
                    onChangeText={handleChange('cost')}
                    onBlur={handleBlur('cost')}
                    placeholder="Cost"
                    placeholderTextColor="#a4a4a4"
                    style={{ fontSize: 16 }}
                    value={values.cost}
                    keyboardType="numeric"
                  />
                </Item>
                <Item
                  rounded
                  style={styles.inputLogin}
                  error={Boolean(errors.price && touched.price)}
                >
                  <MaterialCommunityIcons
                    name="currency-usd"
                    style={styles.iconInput}
                  />
                  <Input
                    onChangeText={handleChange('price')}
                    onBlur={handleBlur('price')}
                    placeholder="Base Price 1"
                    placeholderTextColor="#a4a4a4"
                    style={{ fontSize: 16 }}
                    value={values.price}
                    keyboardType="numeric"
                  />
                </Item>
                <Item
                  rounded
                  style={styles.inputLogin}
                  error={Boolean(errors.specialPrice && touched.specialPrice)}
                >
                  <MaterialCommunityIcons
                    name="currency-usd"
                    style={styles.iconInput}
                  />
                  <Input
                    onChangeText={handleChange('specialPrice')}
                    onBlur={handleBlur('specialPrice')}
                    placeholder="Base Price 2"
                    placeholderTextColor="#a4a4a4"
                    style={{ fontSize: 16 }}
                    value={values.specialPrice}
                    keyboardType="numeric"
                  />
                </Item>
                <Item
                  rounded
                  style={styles.inputLogin}
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
                  style={styles.inputLogin}
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
                      if (ctrlSubSet(value)) {
                        setFieldValue('subSetMenu', false);
                      }
                    }}
                  >
                    <Picker.Item label="General Type" value="general" />
                    <Picker.Item
                      label="Protein Type (Choose Before Cart)"
                      value="protein"
                    />
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
                    checked={values.subSetMenu}
                    onPress={() => {
                      setFieldValue('subSetMenu', !values.subSetMenu);
                    }}
                    disabled={ctrlSubSet(values.type)}
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
