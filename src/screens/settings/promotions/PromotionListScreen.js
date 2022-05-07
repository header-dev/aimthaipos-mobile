import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Animated } from 'react-native'
import { Avatar, Icon, ListItem, Image, Header, SearchBar } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler'
import { NavigationEvents, withNavigation } from 'react-navigation'
import Swipeable from 'react-native-swipeable';
import { Context as PromotionContext } from './../../../context/PromotionContext'
import { navigate } from '../../../navigationRef'
import { Entypo, AntDesign, Foundation } from '@expo/vector-icons';
import useDeletePromitionHook from './../../../hooks/useDeletePromitionHook'
import { Alert } from 'react-native'

const PromotionListScreen = ({ navigation }) => {

    const [isSwiping, setIsSwiping] = useState(false)

    const [searchValue, setSearchValue] = useState("")

    const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable] = useState(null)

    const { state: { promotions, isLoading, isRejected }, fetchPromotion } = useContext(PromotionContext)

    const [removePromotion] = useDeletePromitionHook()

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <Swipeable
            rightButtons={[
                <TouchableOpacity
                    onPress={() => navigate('PromotionEdit', { _promotion: item })}
                    style={[styles.rightSwipeItem, { backgroundColor: 'blue' }]}
                >
                    <Entypo name="edit" size={34} color="white" />
                </TouchableOpacity>,
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            "Delete Promotion",
                            "Are you sure you want to delete this promotion ?",
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => { },
                                    style: "cancel"
                                },
                                {
                                    text: "OK", onPress: () => {
                                        removePromotion(item.id)
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
                <Foundation name="burst-sale" size={50} color='#517fa4' />
                <ListItem.Content>
                    <ListItem.Title>Promotion Name : {item.name}</ListItem.Title>
                    <ListItem.Subtitle>Discount (%): {item.discount_percentage} %</ListItem.Subtitle>
                    <ListItem.Subtitle>Discount ($): {item.discount_price}</ListItem.Subtitle>
                    <ListItem.Subtitle>Type : {item.promotionType}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        </Swipeable>
    )

    return (
        <View style={styles.container}>
            <NavigationEvents onWillFocus={() => {
                fetchPromotion(searchValue)
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
                    text: "Promotion Management",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
                rightComponent={{
                    icon: "add",
                    color: "#fff",
                    onPress: () => {
                        navigation.navigate("PromotionCreate")
                    },
                }}
            />
            <SearchBar
                placeholder="Find Name..."
                lightTheme
                round
                onChangeText={(search) => {
                    fetchPromotion(search)
                    setSearchValue(search)
                }}
                value={searchValue}
            />
            {isLoading && (
                <ActivityIndicator style={{ margin: 10 }} animating />
            )}
            <FlatList
                scrollEnabled={!isSwiping}
                keyExtractor={keyExtractor}
                data={promotions}
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

export default withNavigation(PromotionListScreen)