import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  Avatar,
  Icon,
  ListItem,
  Image,
  Header,
  SearchBar,
} from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import { NavigationEvents, withNavigation } from 'react-navigation';
import Swipeable from 'react-native-swipeable';
import { Context as MenuContext } from './../../../context/MenuContext';
import { navigate } from '../../../navigationRef';
import { MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons';
import useDeleteMenuHook from './../../../hooks/useDeleteMenuHook';
import { Alert } from 'react-native';
import { BACKEND_URL, MENU_IMAGE } from '@env';
import { priceNumberFormat } from './../../../utils/NumberUtil';
import currency from 'currency.js';

const MenuListScreen = ({ navigation }) => {
  const [isSwiping, setIsSwiping] = useState(false);

  const [searchValue, setSearchValue] = useState('');

  const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable] = useState(null);

  const {
    state: { menus, isLoading, isRejected },
    fetchMenu,
  } = useContext(MenuContext);

  const [removeMenu] = useDeleteMenuHook();

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item, index }) => (
    <Swipeable
      key={index}
      rightButtons={[
        <TouchableOpacity
          onPress={() => navigate('MenuEdit', { _menu: item })}
          style={[styles.rightSwipeItem, { backgroundColor: 'blue' }]}
        >
          <Entypo name="edit" size={34} color="white" />
        </TouchableOpacity>,
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Delete Menu',
              'Are you sure you want to delete this Menu ?',
              [
                {
                  text: 'Cancel',
                  onPress: () => {},
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    removeMenu(item.id);
                  },
                },
              ],
              { cancelable: false }
            );
          }}
          style={[styles.rightSwipeItem, { backgroundColor: 'red' }]}
        >
          <AntDesign name="delete" size={34} color="white" />
        </TouchableOpacity>,
      ]}
      onRightButtonsOpenRelease={(event, gestureState, swipeable) => {
        if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
          currentlyOpenSwipeable.recenter();
        }
        setCurrentlyOpenSwipeable(swipeable);
        setIsSwiping(true);
      }}
      onRightButtonsCloseRelease={() => {
        setCurrentlyOpenSwipeable(null);
        setIsSwiping(false);
      }}
    >
      <ListItem bottomDivider>
        <Image
          source={{ uri: `${MENU_IMAGE}${item.photo}` }}
          style={{ width: 100, height: 100 }}
          PlaceholderContent={<ActivityIndicator />}
        />
        <ListItem.Content>
          <ListItem.Title>Name : {item.name}</ListItem.Title>
          <ListItem.Subtitle>
            Cost: {currency(item.cost, { separator: ',' }).format()}
          </ListItem.Subtitle>
          <ListItem.Subtitle>
            Base Price (1): {currency(item.price, { separator: ',' }).format()}
          </ListItem.Subtitle>
          <ListItem.Subtitle>
            Base Price (2):{' '}
            {currency(item.specialPrice, { separator: ',' }).format()}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content>
          <ListItem.Title>Category:</ListItem.Title>
          <ListItem.Subtitle>{item.category.name}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content>
          <ListItem.Title>Type:</ListItem.Title>
          <ListItem.Subtitle>{item.type}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </Swipeable>
  );
  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={() => {
          fetchMenu(searchValue);
        }}
      />
      <NavigationEvents
        onWillFocus={
          currentlyOpenSwipeable && currentlyOpenSwipeable.recenter()
        }
      />
      <Header
        placement="center"
        containerStyle={{
          backgroundColor: '#2E7C31',
        }}
        leftComponent={{
          icon: 'arrow-back',
          color: '#fff',
          onPress: () => {
            navigation.goBack();
          },
        }}
        centerComponent={{
          text: 'Menu List',
          style: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
        }}
        rightComponent={{
          icon: 'add',
          color: '#fff',
          onPress: () => {
            navigation.navigate('MenuCreate');
          },
        }}
      />
      <SearchBar
        placeholder="Find Name..."
        lightTheme
        round
        onChangeText={(search) => {
          fetchMenu(search);
          setSearchValue(search);
        }}
        value={searchValue}
      />
      {isLoading && <ActivityIndicator animating style={{ marginTop: 10 }} />}
      <FlatList
        keyExtractor={keyExtractor}
        data={menus}
        renderItem={(item) => renderItem(item)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  loading: {
    marginTop: 10,
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
  },
});

export default withNavigation(MenuListScreen);
