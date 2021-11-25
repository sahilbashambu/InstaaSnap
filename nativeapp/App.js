import React, {useState} from 'react';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  LogBox,
} from 'react-native';
console.disableYellowBox = true;

export default function InstaaSnsp() {
  const [textValue, setTextValue] = useState('');

  const fetchMedia = async event => {
    event.preventDefault();
    let postURL = textValue;
    await axios
      .get('http://192.168.1.4:3001/?postURL=' + postURL)
      .then(async response => {
        if (response.data.mediaList.length === 1) {
          if (response.data.mediaList[0].search('.mp4') === -1) {
            RNFetchBlob.config({fileCache: true, appendExt: 'jpg'})
              .fetch('GET', response.data.mediaList[0])
              .then(res => {
                CameraRoll.save(res.data, 'photo')
                  .then(() => {
                    Alert.alert(
                      'Instagram Post Image',
                      'Image Saved Successfully',
                      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                      {cancelable: false},
                    );
                  })
                  .catch(err => {
                    Alert.alert(
                      'Instagram Post Image',
                      'Failed to Save Image',
                      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                      {cancelable: false},
                    );
                  });
              });
          } else {
            RNFetchBlob.config({fileCache: true, appendExt: 'mp4'})
              .fetch('GET', response.data.mediaList[0])
              .then(res => {
                CameraRoll.save(res.data, 'video')
                  .then(() => {
                    Alert.alert(
                      'Instagram Post Video',
                      'Media Saved Successfully',
                      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                      {cancelable: false},
                    );
                  })
                  .catch(err => {
                    Alert.alert(
                      'Instagram Post Video',
                      'Failed to save Video',
                      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                      {cancelable: false},
                    );
                  });
              });
          }
        } else if (response.data.mediaList.length > 1) {
          let maxCount = response.data.mediaList.length;
          let count = 0;
          for (let mediaFile of response.data.mediaList) {
            if (mediaFile.search('.mp4') === -1) {
              RNFetchBlob.config({fileCache: true, appendExt: 'jpg'})
                .fetch('GET', mediaFile)
                .then(res => {
                  CameraRoll.save(res.data, 'photo')
                    .then(() => {
                      count++;
                      if (count === maxCount) {
                        Alert.alert(
                          'Instagram Post Carousel',
                          'Media Saved Successfully',
                          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                          {cancelable: false},
                        );
                      }
                    })
                    .catch(err => {
                      if (count === maxCount) {
                        Alert.alert(
                          'Instagram Post Carousel',
                          'Failed to Save Media',
                          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                          {cancelable: false},
                        );
                      }
                    });
                });
            } else {
              RNFetchBlob.config({fileCache: true, appendExt: 'mp4'})
                .fetch('GET', mediaFile)
                .then(res => {
                  CameraRoll.save(res.data, 'video')
                    .then(() => {
                      count++;
                      if (count === maxCount) {
                        Alert.alert(
                          'Instagram Post Carousel',
                          'Media Saved Successfully',
                          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                          {cancelable: false},
                        );
                      }
                    })
                    .catch(err => {
                      console.log(count);
                      if (count === maxCount) {
                        Alert.alert(
                          'Instagram Post Carousel',
                          'Failed to Save Media',
                          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                          {cancelable: false},
                        );
                      }
                    });
                });
            }
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.viewOne}>
        <TextInput
          placeholder="https://www.instagram.com/p/mrwuv6sso2r/"
          style={styles.viewOneInput}
          value={textValue}
          onChangeText={setTextValue}
        />
      </View>
      <View style={styles.viewTwo}>
        <TouchableOpacity onPress={fetchMedia} style={styles.viewTwoBtn}>
          <Text style={styles.viewTwoBtnText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  viewOne: {
    backgroundColor: '#ffffff',
    marginTop: 250,
    marginHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(34, 34, 34, 0.05)',
  },
  viewOneInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  viewTwo: {
    backgroundColor: '#fddd02',
    borderColor: '#000',
    marginTop: 15,
    marginHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 50,
  },
  viewTwoBtn: {
    paddingHorizontal: 20,
  },
  viewTwoBtnText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});
