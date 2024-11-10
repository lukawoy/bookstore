import { jwtDecode } from "jwt-decode";
import { fetchlogin, fetchRegister, fetchProfile } from "../Api";

export default {
  login(email, password, history) {
    return fetchlogin({
      email,
      password,
    })
      .then((response) => {
        if (response.data.access) {
          const { access, refresh } = response.data;
          localStorage.setItem("accessToken", `Bearer ${access}`);
          localStorage.setItem("refreshToken", refresh);
        }

        history("/");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  },
  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.reload();
  },
  getCurrentUser() {
    const token = this.getAccessToken();
    if (token) {
      const decoded = jwtDecode(token.replace("Bearer ", ""));
      return decoded;
    }
    return null;
  },
  getAccessToken() {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken() {
    return localStorage.getItem("refreshToken");
  },
  isAuthenticated() {
    const token = this.getAccessToken();
    if (token) {
      const decoded = jwtDecode(token.replace("Bearer ", ""));
      return decoded;
      // const currentTime = Date.now() / 1000;
      // return decoded.exp > currentTime;
    }
    return false;
  },

  register(username, email, password, first_name, last_name, history) {
    return fetchRegister({
      username,
      email,
      password,
      first_name,
      last_name,
    })
      .then((response) => {
        if (response.data.access) {
          const { access, refresh } = response.data;
          localStorage.setItem("accessToken", `Bearer ${access}`);
          localStorage.setItem("refreshToken", refresh);
        }

        history("/auth/jwt/create");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getUserProfile() {
    const token = this.getAccessToken();
    if (token) {
      return fetchProfile({
        headers: {
          Authorization: token,
        },
      })
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          console.log(err);
          return null;
        });
    }
    return null;
  },
};
