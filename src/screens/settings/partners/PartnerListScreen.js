import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Animated } from 'react-native'
import { Avatar, Icon, ListItem, Image, Header, SearchBar } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler'
import { NavigationEvents, withNavigation } from 'react-navigation'
import Swipeable from 'react-native-swipeable';
import { Context as PartnerContext } from './../../../context/PartnerContext'
import { navigate } from '../../../navigationRef'
import { MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons';
import useDeletePartnerHook from './../../../hooks/useDeletePartnerHook'
import { Alert } from 'react-native'
import { BACKEND_URL } from './../../../constants'
import currency from 'currency.js'

const PartnerListScreen = ({ navigation }) => {

    const [isSwiping, setIsSwiping] = useState(false)

    const [searchValue, setSearchValue] = useState("")

    const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable] = useState(null)

    const { state: { partners, isLoading, isRejected }, fetchPartner } = useContext(PartnerContext)

    const [deletePartner] = useDeletePartnerHook()

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <Swipeable
            rightButtons={[
                <TouchableOpacity
                    onPress={() => navigate('PartnerEdit', { _partner: item })}
                    style={[styles.rightSwipeItem, { backgroundColor: 'blue' }]}
                >
                    <Entypo name="edit" size={34} color="white" />
                </TouchableOpacity>,
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            "Delete Partner",
                            "Are you sure you want to delete this partner ?",
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => {},
                                    style: "cancel"
                                },
                                {
                                    text: "OK", onPress: () => {
                                        deletePartner(item.id)
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
                <Image
                    source={{ uri: `${BACKEND_URL}/api/ver1/image/partners/${item.logo}` }}
                    style={{ width: 100, height: 100 }}
                    PlaceholderContent={<ActivityIndicator />}
                />
                <ListItem.Content>
                    <ListItem.Title>Name : {item.name}</ListItem.Title>
                    <ListItem.Subtitle>Charge Price: {currency(item.chargePrice, {
                        separator: ','
                    }).format()}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        </Swipeable>
    )

    return (
        <View style={styles.container}>
            <NavigationEvents onWillFocus={() => {
                fetchPartner(searchValue)
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
                    text: "Partner Management",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
                rightComponent={{
                    icon: "add",
                    color: "#fff",
                    onPress: () => {
                        navigation.navigate("PartnerCreate")
                    },
                }}
            />
            <SearchBar
                placeholder="Find Name..."
                lightTheme
                round
                onChangeText={(search) => {
                    fetchPartner(search)
                    setSearchValue(search)
                }}
                value={searchValue}
            />
            {isLoading && (
                <ActivityIndicator animating />
            )}
            <FlatList
                keyExtractor={keyExtractor}
                data={partners}
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

export default withNavigation(PartnerListScreen)