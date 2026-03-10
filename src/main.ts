import './styles.css';
import { initializeLogin } from './features/auth/login';
import { initializeFriends, cleanupFriends } from './features/friends/friends';

function showView(viewId: string) {
  const loginView = document.getElementById("login-view");
  const friendsView = document.getElementById("friends-view");

  if (loginView && friendsView) {
    if (viewId === 'login') {
      loginView.style.display = 'grid';
      friendsView.style.display = 'none';
    } else {
      loginView.style.display = 'none';
      friendsView.style.display = 'block';
    }
  }
}

function handleReAuth() {
  localStorage.removeItem("mini_social_username");
  cleanupFriends();
  showView('login');
}

function logout() {
  localStorage.removeItem("mini_social_username");
  cleanupFriends();
  showView('login');
}

function init() {
  const existingUsername = localStorage.getItem("mini_social_username");
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  if (existingUsername) {
    showView('friends');
    initializeFriends(existingUsername, handleReAuth);
  } else {
    showView('login');
  }

  initializeLogin((newUsername: string) => {
    showView('friends');
    initializeFriends(newUsername, handleReAuth);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
