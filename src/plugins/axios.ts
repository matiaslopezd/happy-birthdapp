import axios from 'axios'
import VueAxios from 'vue-axios'

export default {
    configure: function configure(app: any) {
        app.use(VueAxios, axios);
        axios.defaults.baseURL = app.config.globalProperties.$baseURL;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
    }
}
