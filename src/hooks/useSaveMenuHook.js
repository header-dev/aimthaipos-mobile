import { Toast } from 'native-base';
import { useContext } from 'react';
import { Context as MenuContext } from '../context/MenuContext';
import { navigate } from '../navigationRef';

export default () => {
  const { createMenu, uploadPhoto } = useContext(MenuContext);

  const saveMenu = (image, imageChanged, value) => {
    createMenu(image, imageChanged, value);
  };

  return [saveMenu];
};
