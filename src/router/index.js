/* eslint-disable */ 
import Vue from "vue";
import VueRouter from "vue-router";
import store from '@/store'

import Replay from "@/views/Replay.vue";
import Sessions from '@/views/Sessions.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import NotFound from '@/views/NotFound.vue'
import Onboarding from '@/views/Onboarding.vue'

Vue.use(VueRouter);

import { signout } from '@/services/FirebaseAuth.js'

// {
//   path: "/about",
//   name: "About",
//   // route level code-splitting
//   // this generates a separate chunk (about.[hash].js) for this route
//   // which is lazy-loaded when the route is visited.
//   component: () =>
//     import(/* webpackChunkName: "about" */ "../views/About.vue")
// }

const routes = [
    {
        path: "/replay/:symbol/:resolution/:from/:to",
        name: "Home",
        component: Replay,
        meta: {
            private: true
        }
    },
    {
        path: "/dashboard/sessions",
        name: "Sessions",
        component: Sessions,
        meta: {
            private: true
        }
    },
    {
        path: "/sessions/:session",
        name: "SessionChart",
        component: Replay,
        meta: {
            private: true
        }
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: {
          guest: true
        }
    },
    {
        path: "/signup",
        name: "Signup",
        component: Signup,
        meta: {
            guest: true
        }
    },
    {
        path: '/signout',
        name: 'SignOut',
        beforeEnter: (to, from, next) => {

            signout()

        }
    },
    {
        path: '*',
        name: 'NotFound',
        component: NotFound
    },
    {
        path: '/onboarding',
        name: 'Onboarding',
        component: Onboarding,
        meta: {
            private: true,
            newUserOnly: true
        }
    }

];

const router = new VueRouter({
    routes
});

router.beforeEach( ( to, from, next ) => {

    if( to.matched.some( record => record.meta.guest ) ) {

        store.getters.isAuthenticated ? next('/') : next()

    } else if( to.matched.some( record => record.meta.private ) ) {

        store.getters.isAuthenticated ? next() : next('/login')

    } else {

        next()

    }

} )

export default router;