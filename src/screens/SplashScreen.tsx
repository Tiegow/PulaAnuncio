import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useSkipService } from '../hooks/useSkipService';

type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isServiceEnabled, checkStatus } = useSkipService();
  const scaleValue = useRef(new Animated.Value(0.5)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial check to ensure status is up to date
    checkStatus();

    // Start logo animation
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Wait 2 seconds before navigating
    const timer = setTimeout(() => {
      if (isServiceEnabled) {
        navigation.replace('Home');
      } else {
        navigation.replace('Onboarding');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isServiceEnabled, navigation, checkStatus]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
        ]}
      >
        <Icon name="fast-forward-outline" size={100} color={colors.primary} />
        <Text style={styles.title}>PulaAnúncio</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    marginTop: 16,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xxl,
    color: colors.text,
    letterSpacing: 1,
  },
});
