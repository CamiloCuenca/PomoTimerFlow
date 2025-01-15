import React, { useState } from 'react'; // Quitar 'use'
import { StyleSheet, Text, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Crear una instancia de QueryClient
const queryClient = new QueryClient();

// Navigation
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({});
