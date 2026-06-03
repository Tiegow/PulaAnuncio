import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Switch, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useSkipService } from '../hooks/useSkipService';
import { Button } from '../components/Button';

export const HomeScreen: React.FC = () => {
  const { 
    isServiceEnabled, 
    isSkipEnabled, 
    isMuteEnabled, 
    skipCount, 
    toggleSkip, 
    toggleMute,
    openSettings,
    checkStatus
  } = useSkipService();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevSkipCount = useRef(skipCount);

  useEffect(() => {
    // Pulse animation when count changes
    if (skipCount > prevSkipCount.current) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        })
      ]).start();
      prevSkipCount.current = skipCount;
    }
  }, [skipCount, scaleAnim]);

  if (!isServiceEnabled) {
    return (
      <View style={styles.container}>
        <View style={styles.warningContainer}>
          <Icon name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={styles.warningTitle}>Serviço Desativado</Text>
          <Text style={styles.warningText}>
            Parece que a permissão de Acessibilidade foi revogada nas configurações do Android.
          </Text>
          <Button 
            title="Reativar Permissão" 
            onPress={openSettings} 
            style={{ marginTop: spacing.xl }}
            icon={<Icon name="cog" size={20} color={colors.text} />}
          />
          <Button 
            title="Atualizar Status" 
            onPress={checkStatus} 
            variant="outline"
            style={{ marginTop: spacing.m }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Icon name="fast-forward-outline" size={28} color={colors.primary} />
          <Text style={styles.headerTitle}>PulaAnúncio</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: isSkipEnabled ? colors.success + '20' : colors.surfaceHighlight }]}>
          <View style={[styles.statusDot, { backgroundColor: isSkipEnabled ? colors.success : colors.textSecondary }]} />
          <Text style={[styles.statusText, { color: isSkipEnabled ? colors.success : colors.textSecondary }]}>
            {isSkipEnabled ? 'ATIVO' : 'INATIVO'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.counterCard, { transform: [{ scale: scaleAnim }] }]}>
          <Icon name="target" size={48} color={colors.primary} />
          <Text style={styles.counterNumber}>{skipCount}</Text>
          <Text style={styles.counterLabel}>Anúncios pulados{"\n"}nesta sessão</Text>
        </Animated.View>

        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Pular anúncios automaticamente</Text>
              <Text style={styles.settingDescription}>Clica no botão "Pular anúncio" do YouTube para você</Text>
            </View>
            <Switch
              value={isSkipEnabled}
              onValueChange={toggleSkip}
              trackColor={{ false: colors.surfaceHighlight, true: colors.primary + '80' }}
              thumbColor={isSkipEnabled ? colors.primary : colors.textSecondary}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Silenciar anúncios</Text>
              <Text style={styles.settingDescription}>Tira o volume do celular durante a propaganda e restaura depois</Text>
            </View>
            <Switch
              value={isMuteEnabled}
              onValueChange={toggleMute}
              trackColor={{ false: colors.surfaceHighlight, true: colors.primary + '80' }}
              thumbColor={isMuteEnabled ? colors.primary : colors.textSecondary}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.m,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.l,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.s,
  },
  statusText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
  },
  content: {
    flex: 1,
    padding: spacing.l,
  },
  counterCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  counterNumber: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xxxl,
    color: colors.text,
    marginTop: spacing.m,
  },
  counterLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.m,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  settingsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.l,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.l,
    color: colors.text,
    marginBottom: spacing.l,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.s,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: spacing.m,
  },
  settingTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.m,
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.s,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.m,
  },
  warningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  warningTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
    color: colors.text,
    marginTop: spacing.l,
    marginBottom: spacing.m,
  },
  warningText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.m,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
