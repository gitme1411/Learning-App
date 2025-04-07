import React from 'react'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'
type Props = TextInputProps & {
  text: string
  placeholder: string
  setText: (_text: string) => void
}

const InputNormal = ({ text, setText, placeholder, ...props }: Props) => {
  return (
    <TextInput
      {...props}
      value={text}
      placeholder={placeholder}
      onChangeText={setText}
      style={styles.input}
    />
  )
}

const styles = StyleSheet.create({
    input:{
        height: 60,
        borderRadius: 15,
        borderWidth: 0.2,
        borderColor: "gray",
        paddingHorizontal: 24
    }
})

export default InputNormal
