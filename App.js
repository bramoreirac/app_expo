import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import { StyleSheet, Text, View, Image, Pressable, Alert } from 'react-native';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  const mostrarMensaje = () => {
    Alert.alert('¡Excelente!', 'Tu primera aplicación está funcionando.');
  };

  const diaActual = () => {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const fecha = new Date();
    const dia = dias[fecha.getDay()];
    Alert.alert('Día Actual', `Hoy es ${dia} ${fecha.toLocaleDateString()}`);
  };

  if (fontError) {
    throw fontError;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('./assets/expo_logo.png')}
        style={styles.logo}
      />

      <Text style={styles.titulo}>Mi primera aplicación</Text>
      <Text style={styles.texto}>Nombres:</Text>
      <Text style={styles.texto}>Braulio Moreira / 23-06794-1</Text>
      <Text style={styles.texto}>Maynor Lopez / 23-05945-1</Text>
      <Text style={styles.texto}>Carrera: Ingeniería en TI</Text>

      <Pressable style={styles.boton} onPress={mostrarMensaje}>
        <Text style={styles.textoBoton}>Probar aplicación</Text>
      </Pressable>

      <Pressable style={styles.boton} onPress={diaActual}>
        <Text style={styles.textoBoton}>Que dia es hoy?</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1512',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  logo: {
    width: 110,
    height: 110,
    marginBottom: 20,
    borderRadius: 20,
  },

  titulo: {
    fontFamily: 'JetBrainsMono_700Bold',
    color: '#A5FFBA',
    fontSize: 25,
    marginBottom: 18,
    textAlign: 'center',
  },

  texto: {
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#8FE3A5',
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },

  boton: {
    backgroundColor: '#183D2B',
    borderColor: '#4DAF71',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },

  textoBoton: {
    fontFamily: 'JetBrainsMono_700Bold',
    color: '#B8FFCA',
    fontSize: 16,
  },
});
