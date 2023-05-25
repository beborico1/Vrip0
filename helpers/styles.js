import { Dimensions, StyleSheet } from 'react-native';
import colors from './colors';

const windowWidth = Dimensions.get('window').width;

export const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  imagePlaceholder: {
    width: 150,
    height: 225,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: windowWidth,
    paddingHorizontal: 20, // Añadir un poco de espacio a los lados del modal
  },
  modalOutfitImage: {
    resizeMode: 'cover',
    backgroundColor: '#f5f5f5',
    borderRadius: 10, // Añadir bordes redondeados a la imagen
    marginBottom: 20, // Añadir espacio debajo de la imagen
  },
  errorContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8d7da', // Color de fondo rojo claro
    borderColor: '#f5c6cb', // Borde rojo más oscuro
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10, // Espaciado alrededor del mensaje de error
    marginTop: 10,
  },
});

export const textStyles = StyleSheet.create({
  label: { 
    fontSize: 18, 
  },
  boldLabel: { 
    fontSize: 18, 
    fontWeight: "600"
  },
  greenLabel: {
    color: colors.vrip, 
    fontSize: 18, 
    fontWeight: "600"
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  infoLabel: {
    color: 'lightgrey',
    fontSize: 18,
    textAlign: 'center',
  },
  modalDescription: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 10, // Para agregar un poco de espacio a los lados del texto
    fontWeight: '600',
  },
  termsText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    color: 'white',
  },
  errorText: {
    fontSize: 16,
    color: '#721c24', // Texto rojo oscuro
    textAlign: 'center', // Asegúrate de que el mensaje de error esté centrado
  },
});

export const buttonStyles = StyleSheet.create({
  greenButton: {
    backgroundColor: colors.vrip,
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
    shadowColor: "#333",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  greenButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  modalCloseButton: {
    backgroundColor: 'transparent', // Hacer el fondo del botón transparente
    position: 'absolute', // Posicionar el botón absolutamente
    top: 10, // Añadir un margen en la parte superior del botón
    right: 10, // Añadir un margen en el lado derecho del botón
  },
});

export const inputStyles = StyleSheet.create({
  input: {
    width: '80%',
    height: 48,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  detailInput: {
    width: '80%',
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});