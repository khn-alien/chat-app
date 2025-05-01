// Firebase config (replace with your own Firebase config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

// DOM elements
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const chatWindow = document.getElementById("chat-window");
const authContainer = document.getElementById("auth-container");
const chatContainer = document.getElementById("chat-container");

// Listen for authentication state
auth.onAuthStateChanged(user => {
  if (user) {
    authContainer.style.display = "none";
    chatContainer.style.display = "block";
    getMessages();
  } else {
    authContainer.style.display = "flex";
    chatContainer.style.display = "none";
  }
});

// Login with Google
loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
});

// Logout
logoutBtn.addEventListener("click", () => {
  auth.signOut();
});

// Get messages from Firestore
const getMessages = () => {
  firestore.collection("messages").orderBy("timestamp").onSnapshot(snapshot => {
    chatWindow.innerHTML = "";
    snapshot.forEach(doc => {
      const message = doc.data();
      chatWindow.innerHTML += `<div>${message.username}: ${message.text}</div>`;
    });
  });
};

// Send a message
sendBtn.addEventListener("click", () => {
  if (messageInput.value.trim() !== "") {
    const user = auth.currentUser;
    firestore.collection("messages").add({
      username: user.displayName,
      text: messageInput.value,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    messageInput.value = "";
  }
});
