/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';

import {SafeAreaView, Button, Image, ActivityIndicator} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import RNFS from 'react-native-fs';

const App: () => Node = () => {
  const [uri, setUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickFile = async () => {
    try {
      let url = null;
      setIsLoading(true);
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        readContent: true,
      });
      url = await RNFS.readFile(res.uri, 'base64');
      setUri(url);
      var data = new FormData();
      data.append('image', uri);
      var config = {
        method: 'post',
        url: 'https://api.imgur.com/3/image',
        headers: {
          Authorization: 'Client-ID 86bcada04a93379',
        },
        data: data,
      };
      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          setIsLoading(false);
        })
        .catch(function (error) {
          console.log(error.response.data);
          setIsLoading(false);
        });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        setIsLoading(false);
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView>
      <Button title="select image" onPress={pickFile} />
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Image
          style={{width: 340, height: 340}}
          source={{
            uri: uri,
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default App;
