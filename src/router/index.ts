import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Login from '../views/Login.vue';
import Base from '../views/Base.vue';
import Birthdays from '@/views/Birthdays.vue';
import Contacts from '@/views/Contacts.vue';
import Gifts from '@/views/Gifts.vue';
import Account from '@/views/Account.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/authenticate',
  },
  {
    path: '/user',
    component: Base,
    children: [
      {
        path: '',
        redirect: '/user/contacts',
      },
      {
        path: 'birthdays',
        component: Birthdays,
      },
      {
        path: 'contacts',
        component: Contacts,
      },
      {
        path: 'gifts',
        component: Gifts,
      },
      {
        path: 'account',
        component: Account,
      },
    ]
  },
  {
    path: '/authenticate',
    component: Login,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router
