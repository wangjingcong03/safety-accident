import Vue from 'vue';
import Router from 'vue-router';
import AccidentList from '../views/AccidentList.vue';
import AccidentDetail from '../views/AccidentDetail.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [
    { path: '/', redirect: '/accidents' },
    { path: '/accidents', name: 'AccidentList', component: AccidentList },
    { path: '/accidents/:id', name: 'AccidentDetail', component: AccidentDetail, props: true }
  ]
});
