import { Dimensions } from 'react-native'

export const fullWidth = Dimensions.get('window').width
export const fullHeight = Dimensions.get('window').height

export const shadow = {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
}