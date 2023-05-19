import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  label: { 
    fontSize: 18, 
  },
  boldLabel: { 
    fontSize: 18, 
    fontWeight:"600"
  },
  greenLabel: {
    color: colors.vrip, 
    fontSize: 18, 
    fontWeight:"600"
  },
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
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  input: {
    width: '80%',
    height: 48,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: 'white',
  }
});

export default styles;