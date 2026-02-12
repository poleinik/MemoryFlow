import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import BrainIcon from 'assets/BrainIcon';

type HeaderProps = {
  navigation?: any;
  route?: any;
  options?: any;
  back?: any;
};

export function Header({ navigation, route, options, back }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safe, { backgroundColor: '#fff' }]}
    >
      <View style={[styles.container, { paddingTop: insets.top ? 0 : 12 }]}>
        {back ? (
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.back}
          >
            <Text style={styles.backText}>Назад</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.logoWrap}>
          <BrainIcon width={20} height={20} color="white" />
        </View>

        <Text style={styles.title}>
          {options?.title ?? route?.name ?? 'Memory Flow'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    width: '100%',
  },
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgb(59 130 246)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  back: {
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
  },
});
