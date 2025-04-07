import React from 'react'
import {
    StyleSheet,
    Image,
    ImageSourcePropType
} from 'react-native'
type Props = ImageSourcePropType & {
    icon: ImageSourcePropType
    size: number
    color?: string
}

const Icons = ({ icon, size, ...props }: Props) => {
    return (
        <Image  {...props} style={{ width: size, height: size }} source={icon} />
    )
}

const styles = StyleSheet.create({

})

export default Icons
