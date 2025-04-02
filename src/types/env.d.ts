declare module "@env" {
  export const AIR_KOREA_API_KEY: string;
}

declare module "react-native-config" {
  interface Config {
    AIR_KOREA_API_KEY: string;
  }
  const config: Config;
  export default config;
}
