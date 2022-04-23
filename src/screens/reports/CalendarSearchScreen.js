import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Header } from 'react-native-elements';
import { Calendar } from 'react-native-calendars'
import moment from 'moment';
import { withNavigation } from 'react-navigation';
import { navigate } from '../../navigationRef';

const CalendarSearchScreen = ({ navigation }) => {

    const [selected, setSelected] = useState('');

    const onDayPress = day => {
        setSelected(day.dateString);
    };

    return (
        <View style={{ flex: 1 }}>
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
                    text: "Choose Date",
                    style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
                }}
            />
            <Calendar
                // Initially visible month. Default = Date()
                current={moment().format('YYYY-MM-DD')}
                markingType={'period'}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => {
                    navigation.state.params._searchDate(day.dateString)
                    navigation.goBack()
                }}
                monthFormat={'yyyy MMM'}
                enableSwipeMonths={true}
            />
        </View>
    )
}

export default withNavigation(CalendarSearchScreen)