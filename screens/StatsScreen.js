import React, { useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { themeContext } from '../themesContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoginScreen from './LoginScreen';
import { AuthContext } from './AuthContext'; // Contexto de autenticación

export default function StatsScreen({ navigation }) {
    const { theme } = useContext(themeContext);
    const { user } = useContext(AuthContext); // Obtener usuario del contexto

    // Si el usuario no está autenticado, mostrar la pantalla de inicio de sesión
    if (!user) {
        return <LoginScreen navigation={navigation} />;
    }

    // Función para obtener datos de sesiones
    const fetchSessions = async () => {
        const response = await axios.get('http://192.168.1.44:5100/sessions'); 
        return response.data;
    };

    // Hook de react-query para obtener las sesiones
    const { data: sessions, isLoading, isError, error } = useQuery({
        queryKey: ['sessions'],
        queryFn: fetchSessions,
        enabled: !!user, // Solo ejecuta la consulta si el usuario está autenticado
    });

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.secondary }]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (isError) {
        return (
            <View style={[styles.container, { backgroundColor: theme.secondary }]}>
                <Text style={{ color: theme.primary }}>Error: {error.message}</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.secondary }]}>
            <Text style={{ color: theme.primary, fontWeight: 'bold', marginBottom: 10 }}>
                Stats
            </Text>
            {sessions.map((session) => (
                <View key={session._id} style={styles.sessionCard}>
                    <Text style={{ color: theme.primary }}>Type: {session.type}</Text>
                    <Text style={{ color: theme.primary }}>Date: {new Date(session.date).toLocaleDateString()}</Text>
                    <Text style={{ color: theme.primary }}>Created: {new Date(session.createdAt).toLocaleString()}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    sessionCard: {
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
});
