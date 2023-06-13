import { ActivityIndicator, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { buttonStyles } from '../helpers/styles'

const UploadButton = ({ title, uploadImage, loading }) => {
  return (
    <TouchableOpacity onPress={uploadImage} style={[ buttonStyles.greenButton, { width: '80%' }]}>
        {loading ? (
          <ActivityIndicator color="white" />
          ) : (
          <Text style={buttonStyles.greenButtonText}>{title}</Text>
        )}
    </TouchableOpacity>
  )
}

export default UploadButton