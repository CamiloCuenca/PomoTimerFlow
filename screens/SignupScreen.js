import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { themeContext } from '../themesContext';
import React, { useState, useContext } from 'react';

export default function SignupScreen({ navigation, onSignup }) {
    const { theme } = useContext(themeContext); 

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        onSignup(); 
        navigation.replace("Stats"); //Redirige a la pestaña Stats después de registrarse
    };
    

    return (
        <View style={[styles.container, { backgroundColor: theme.secondary }]}>
            <TextInput 
                style={[styles.input, { backgroundColor: theme.tertiary, color: theme.foreground }]} 
                placeholder="Nombre"
                placeholderTextColor={theme.foreground}
                value={name}
                onChangeText={setName}
            />
            
            <TextInput 
                style={[styles.input, { backgroundColor: theme.tertiary, color: theme.foreground }]} 
                placeholder="Correo"
                placeholderTextColor={theme.foreground}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            
            <TextInput 
                style={[styles.input, { backgroundColor: theme.tertiary, color: theme.foreground }]} 
                placeholder="Contraseña"
                placeholderTextColor={theme.foreground}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Pressable 
                style={[styles.button, { backgroundColor: theme.primary }]} 
                accessibilityLabel="Crear"
                onPress={handleSignup}  
            >
                <Text style={[styles.buttonText, { color: theme.foreground }]}>Crear</Text>
            </Pressable>

           
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    input: {
        fontWeight: 'bold',
        borderRadius: 12,
        height: 50,
        width: '80%',
        borderWidth: 1,
       borderColor: 'white',
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 50,
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'white',
    },
    buttonText: {
        fontWeight: 'bold',
        textAlign: 'center',
    }
});
