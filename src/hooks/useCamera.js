import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

export function useCamera() {
  const requestPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  }, []);

  const takePhoto = useCallback(async () => {
    const granted = await requestPermission();
    if (!granted) {
      const err = new Error('CAMERA_DENIED');
      err.code = 'CAMERA_DENIED';
      throw err;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      allowsEditing: false,
    });

    if (result.canceled || !result.assets?.length) return null;

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      name: asset.fileName || `photo-${Date.now()}.jpg`,
      type: asset.mimeType || 'image/jpeg',
    };
  }, [requestPermission]);

  const pickPhotos = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      const err = new Error('GALLERY_DENIED');
      err.code = 'GALLERY_DENIED';
      throw err;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      allowsMultipleSelection: true,
      selectionLimit: 10,
    });

    if (result.canceled || !result.assets?.length) return [];

    return result.assets.map((asset, i) => ({
      uri: asset.uri,
      name: asset.fileName || `photo-${Date.now()}-${i}.jpg`,
      type: asset.mimeType || 'image/jpeg',
    }));
  }, []);

  return { requestPermission, takePhoto, pickPhotos };
}
