import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { Button } from '../components/Button';
import { useSkipService } from '../hooks/useSkipService';

type RootStackParamList = {
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isServiceEnabled, openSettings, checkStatus } = useSkipService();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (isServiceEnabled) {
      navigation.replace('Home');
    }
  }, [isServiceEnabled, navigation]);

  const steps = [
    { icon: 'hand-pointing-up', text: "Toque em 'Habilitar agora' abaixo" },
    { icon: 'cellphone-cog', text: "Você será levado às Configurações de Acessibilidade" },
    { icon: 'magnify', text: "Localize 'PulaAnúncio - Skip de Anúncios' na lista (pode estar em 'Aplicativos Baixados')" },
    { icon: 'toggle-switch-outline', text: "Ative o interruptor e permita o acesso" },
    { icon: 'arrow-left-circle', text: "Volte para este app e ele estará pronto!" },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Icon name="shield-check" size={60} color={colors.primary} />
          <Text style={styles.title}>Quase lá!</Text>
          <Text style={styles.subtitle}>
            Para o PulaAnúncio funcionar, precisamos que você conceda a permissão de Acessibilidade.
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.iconContainer}>
                <Icon name={step.icon} size={28} color={colors.primary} />
              </View>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Icon name="information-outline" size={24} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            A permissão serve APENAS para identificar o botão "Pular anúncio" na tela.
          </Text>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Habilitar agora" 
          onPress={openSettings} 
          icon={<Icon name="open-in-new" size={20} color={colors.text} />}
        />
        <Button 
          title="Já habilitei" 
          onPress={checkStatus} 
          variant="outline"
          style={styles.secondaryButton}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xxl,
    color: colors.text,
    marginTop: spacing.m,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.m,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.s,
    lineHeight: 24,
  },
  stepsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.l,
    marginBottom: spacing.xl,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  stepText: {
    flex: 1,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.m,
    color: colors.text,
    lineHeight: 22,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: spacing.m,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.s,
    color: colors.textSecondary,
    marginLeft: spacing.s,
    lineHeight: 20,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  secondaryButton: {
    marginTop: spacing.m,
  },
});
