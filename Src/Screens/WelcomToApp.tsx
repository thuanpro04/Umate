import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ContainerComponent } from './Components'
import Swiper from 'react-native-swiper'
import { appInfo } from '../Theme/appInfo'

const WelcomToApp = () => {
    const [index, setIndex] = useState(0);
  return (
    <ContainerComponent>
        <Swiper loop={false} index={0}>
        <Image
          source={require('../assets/images/onboarding-1.png')}
          style={{

            width: 50,
            height: 50,
            resizeMode: 'cover',
          }}
        />
        </Swiper>
    </ContainerComponent>
  )
}

export default WelcomToApp

const styles = StyleSheet.create({})