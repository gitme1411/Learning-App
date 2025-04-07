import {View, Image, SafeAreaView, ScrollView} from 'react-native';
import React, {useState} from 'react';
import InputNormal from '../../components/TextInput/Input';
import ButtonIcon from '../../components/Button/ButtonIcon';
import {Colors} from '../../theme';
import BtnLinear from '../../components/Button/ButtonLinear';
import {ScaledSheet} from 'react-native-size-matters';
import TextNormal from '../../components/Text';

const Login = ({navigation}: {navigation: any}) => {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.wrapIconApp}>
            <Image
              style={styles.iconApp}
              source={require('../../assets/images/icon_app.png')}
            />
          </View>
          <View style={styles.wrapTxtLogin}>
            <TextNormal fontSize={20} style={styles.title}>
              Login To Your Account
            </TextNormal>
          </View>
          <View style={[styles.wrapInput, {marginTop: 30}]}>
            <InputNormal
              text={username}
              placeholder="Email"
              setText={txt => setUsername(txt)}
            />
          </View>
          <View style={styles.wrapInput}>
            <InputNormal
              text={pass}
              placeholder="Password"
              setText={txt => setPass(txt)}
            />
          </View>
          <View style={styles.wrapTxtSign}>
            <TextNormal fontSize={12} style={styles.txtSign}>
              Or Continue With
            </TextNormal>
          </View>
          <View style={styles.wrapBtn}>
            <ButtonIcon
              icon={require('../../assets/images/icon_fb.png')}
              title="Facebook"
              onPress={() => console.log('gg')}
              style={styles.btn}
            />
            <View style={styles.space} />
            <ButtonIcon
              icon={require('../../assets/images/icon_google.png')}
              title="Google"
              onPress={() => console.log('gg')}
              style={styles.btn}
            />
          </View>
          <View>
            <TextNormal fontSize={16} style={styles.txtPass}>
              Forgot Your Password?
            </TextNormal>
          </View>
          <View style={styles.wrapBtnLogin}>
            <BtnLinear
              label="LOGIN"
              onPress={() => navigation.navigate('MainStack')}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  wrapIconApp: {
    marginTop: '20@s',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconApp: {
    width: '160@s',
    height: '180@s',
    resizeMode: 'contain',
  },
  wrapTxtLogin: {
    marginTop: '30@s',
  },
  title: {
    fontSize: '20@ms',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wrapInput: {
    paddingHorizontal: '30@s',
    marginTop: '15@s',
  },
  wrapTxtSign: {
    marginTop: '20@s',
  },
  txtSign: {
    fontSize: '12@ms',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wrapBtn: {
    flexDirection: 'row',
    marginTop: '24@s',
    justifyContent: 'center',
  },
  txtPass: {
    textAlign: 'center',
    marginTop: '12@s',
    color: Colors.baseBold,
    textDecorationLine: 'underline',
  },
  space: {
    width: '24@s',
  },
  btn: {
    height: '60@s',
    width: '157@s',
    borderRadius: '15@s',
    borderWidth: '0.2@ms',
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapBtnLogin: {
    marginTop: '36@s',
  },
});

export default Login;
