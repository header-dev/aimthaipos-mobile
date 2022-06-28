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
  CheckBox,
  Button,
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
import { primaryColor } from '../../../constants';
const initailThumb = require('./../../../../assets/thumbnail-empty.png');
const MenuListScreen = ({ navigation }) => {
  const [isSwiping, setIsSwiping] = useState(false);

  const [searchValue, setSearchValue] = useState('');

  const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable] = useState(null);

  useEffect(() => {
    fetchMenu(searchValue);

    return () => {};
  }, []);

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
          source={{
            uri: item.photo
              ? `${MENU_IMAGE}${item.photo}`
              : Image.resolveAssetSource(initailThumb).uri,
          }}
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
        <ListItem.Content>
          <ListItem.Subtitle>
            <CheckBox
              containerStyle={{
                backgroundColor: 'white',
                borderWidth: 0,
                justifyContent: 'center',
              }}
              disabled
              checked={item.subSetMenu}
              title="Sub Set Menu"
              size={35}
            />
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </Swipeable>
  );
  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={() => {}} />
      <NavigationEvents
        onWillFocus={
          currentlyOpenSwipeable && currentlyOpenSwipeable.recenter()
        }
      />
      <Header
        placement="center"
        containerStyle={{
          backgroundColor: primaryColor,
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
      <View style={styles.panelSearch}>
        <View
          style={{
            flexGrow: 1,
          }}
        >
          <SearchBar
            placeholder="Find Name..."
            lightTheme
            round
            onChangeText={(search) => {
              fetchMenu(search, '', '', '');
              setSearchValue(search);
            }}
            value={searchValue}
          />
        </View>
        <View style={{ width: 65 }}>
          <Button
            buttonStyle={styles.filterButton}
            icon={<Icon name="filter" type="font-awesome" color={'white'} />}
            onPress={() => {
              navigate('MenuSearch', {
                onFilter: (values) => {
                  fetchMenu(
                    values?.name,
                    values?.type,
                    values?.categoryId,
                    values?.subsetmenu
                  );
                },
              });
            }}
          />
        </View>
      </View>
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
  filterButton: {
    backgroundColor: 'grey',
    flexGrow: 1,
    height: 65,
  },
  panelSearch: {
    flexDirection: 'row',
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
