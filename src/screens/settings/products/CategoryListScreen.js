import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Animated } from 'react-native'
import { Avatar, Icon, ListItem, Image, Header, SearchBar } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler'
import { NavigationEvents, withNavigation } from 'react-navigation'
import Swipeable from 'react-native-swipeable';
import { Context as CategoryContext } from './../../../context/CategoryContext'
import { navigate } from '../../../navigationRef'
import { Entypo, AntDesign, MaterialIcons } from '@expo/vector-icons';
import useDeleteCategoryHook from './../../../hooks/useDeleteCategoryHook'
import { Alert } from 'react-native'
import _ from 'lodash'

const CategoryListScreen = ({ navigation }) => {

    const [isSwiping, setIsSwiping] = useState(false)

    const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable] = useState(null)

    const { state: { categories, isLoading, isRejected }, fetchCategory } = useContext(CategoryContext)

    const [removeCategory] = useDeleteCategoryHook()

    const keyExtractor = (item, index) => index.toString()

    const [searchValue, setSearchValue] = useState("")

    const renderItem = ({ item }) => (
        <Swipeable
            rightButtons={[
                <TouchableOpacity
                    onPress={() => navigate('CategoryEdit', { _category: item, _categories: categories })}
                    style={[styles.rightSwipeItem, { backgroundColor: 'blue' }]}
                >
                    <Entypo name="edit" size={34} color="white" />
                </TouchableOpacity>,
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            "Delete Category",
                            "Are you sure you want to delete this category ?",
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => {},
                                    style: "cancel"
                                },
                                {
                                    text: "OK", onPress: () => {
                                        removeCategory(item.id)
                                    }
                                }
                            ],
                            { cancelable: false }
                        );

                    }}
                    style={[styles.rightSwipeItem, { backgroundColor: 'red' }]}>
                    <AntDesign name="delete" size={34} color="white" />
                </TouchableOpacity>
            ]}
            onRightButtonsOpenRelease={(event, gestureState, swipeable) => {
                if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
                    currentlyOpenSwipeable.recenter();
                }
                setCurrentlyOpenSwipeable(swipeable)
                setIsSwiping(true)
            }}
            onRightButtonsCloseRelease={() => {
                setCurrentlyOpenSwipeable(null)
                setIsSwiping(false)
            }}
        >
            <ListItem bottomDivider>
                <MaterialIcons name="category" size={50} color='#517fa4' />
                <ListItem.Content>
                    <ListItem.Title>Category Name : {item.name}</ListItem.Title>
                    <ListItem.Title>Data Level : #{item.dataLevel}</ListItem.Title>
                </ListItem.Content>
            </ListItem>
        </Swipeable>
    )

    return (
        <View style={styles.container}>
            <NavigationEvents onWillFocus={() => {
                fetchCategory(searchValue)
            }} />
            <NavigationEvents onWillFocus={currentlyOpenSwipeable && currentlyOpenSwipeable.recenter()} />
            <Header
                placement="center"
                containerStyle={{
                    backgroundColor: "#2E7C31",
                }}
                leftComponent={{
                    icon: "arrow-back",
                    color: "#fff",
                    onPress: () => {
                        navigation.goBack();
                    },
                }}
                centerComponent={{
                    text: "Category List",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
                rightComponent={{
                    icon: "add",
                    color: "#fff",
                    onPress: () => {
                        navigation.navigate("CategoryCreate")
                    },
                }}
            />
            <SearchBar
                placeholder="Find Name..."
                lightTheme
                round
                onChangeText={(search) => {
                    fetchCategory(search)
                    setSearchValue(search)
                }}
                value={searchValue}
            />
            {isLoading && (
                <ActivityIndicator style={{ margin: 10 }} animating />
            )}
            <FlatList
                keyExtractor={keyExtractor}
                data={_.orderBy(categories, "dataLevel")}
                renderItem={(item) => renderItem(item)}
            />
        </View>
    )
}

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
        marginTop: 10
    },
    rightSwipeItem: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20
    },
});

export default withNavigation(CategoryListScreen)