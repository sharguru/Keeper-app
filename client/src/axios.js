import axios from 'axios';

const Axios = axios.create({
    baseURL:"http://localhost:4000",
})
Axios.defaults.headers.post['Content-Type'] = 'application/json';

export default Axios;