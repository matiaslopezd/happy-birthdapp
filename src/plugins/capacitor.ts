import { Plugins, CameraResultType } from '@capacitor/core';
const { Storage, Toast, Camera } = Plugins;

export default {
    configure(app: any) {
        app.config.globalProperties.$storage = Storage;
        app.config.globalProperties.$toast = Toast;
        app.config.globalProperties.$camera = Camera;
        app.config.globalProperties.$cameraResultType = CameraResultType;
    }
}
