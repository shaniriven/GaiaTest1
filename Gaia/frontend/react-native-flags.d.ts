declare module 'react-native-flags' {
    import { ComponentType } from 'react';
    import { ImageProps } from 'react-native';
  
    interface FlagProps extends ImageProps {
      code: string;
      size?: number;
      type?: 'flat' | 'shiny';
    }
  
    const Flag: ComponentType<FlagProps>;
  
    export default Flag;
  }