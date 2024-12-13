import http from "../../http-common";
import { store } from "./index"

export default class AuthService {

        static async isLoggedIn() {
            let accessToken = localStorage.getItem('sessionToken');
            if (accessToken){
                let response = await http.post("/auth/status", JSON.stringify({}), { headers: {"Authorization" : `Bearer ${accessToken}`}}).catch((err) => {
                    return false
                }).catch((err) => {
                    AuthService.logoutUser()
                })

                if (response.status == 200) {
                    return true;
                } else {
                    AuthService.logoutUser()
                    return false;
                }
            } else {
                return false;
            }
        }

        /**
         * Get info from user
         */
         static async getUser() {
            let accessToken = JSON.parse(localStorage.getItem('sessionToken'));
            let userId = JSON.parse(localStorage.getItem('userId'));
            if (accessToken && userId){
                let response = await http.get(`/user/${userId}`, { headers: {"Authorization" : `Bearer ${accessToken}`} })
                if (response.status == 200) {
                    return response.data
                } else {
                    return null;
                }
            }
        }

        static async authenticate(to, from, next) {
            const publicPages = ["/", "/product"]
                
            const noAuthenticationPages = ["/login", "/create-account"]
        
            const isLoggedIn = await AuthService.isLoggedIn()

            if (isLoggedIn) {
                store.dispatch('setState', true);
              } else {
              // Caso seja inexistente ou inválido
                store.dispatch('setState', false);
              }
              
              const requiresAuth = !publicPages.some((allowedPage) => {
                return to.path.startsWith(allowedPage) || to.path == "/"
            })
        
            const canHaveAuth = !noAuthenticationPages.includes(to.path)
            
            if (!isLoggedIn) {
                if (requiresAuth && canHaveAuth) {
                    return next('/login')
                } else {
                    // Caso não precise
                    return next();
                }
            } else {
                if (!canHaveAuth) {
                    return next('/')
                } else {
                    // Caso possam
                    return next();
                }
            }
        }

        static logoutUser() {
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('userId');
            store.dispatch('setUser', null)
            store.dispatch('setState', false);
        }
}