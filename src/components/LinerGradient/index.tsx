import React, { Children } from 'react'
import { Text, View, StyleSheet, ViewProps } from 'react-native'
import LinearGradient, { LinearGradientProps } from 'react-native-linear-gradient'
type Props = {
    children: React.ReactNode
    props?: LinearGradientProps
}

const LinearGradientView = ({ children, props }: Props) => {
    return (
        <LinearGradient style={styles.container} {...props} colors={['#00C2FF', '#0F90EB']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}  >
            {children}
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default LinearGradientView
