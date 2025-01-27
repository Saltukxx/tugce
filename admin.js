// Import Firebase functions at the top of the file
import { ref, onValue, get, remove, set } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDPY7SHT2iyLGGZihZOKUiXX2RxaZU4Yxo",
    authDomain: "tugce-gundoner-website.firebaseapp.com",
    projectId: "tugce-gundoner-website",
    storageBucket: "tugce-gundoner-website.appspot.com",
    messagingSenderId: "485673672547",
    appId: "1:485673672547:web:8b9f5f5f5f5f5f5f5f5f5f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Password for admin access
const ADMIN_PASSWORD = "tugce2024"; // You should change this to a secure password

function login() {
    const password = document.getElementById('password').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('messagesContainer').style.display = 'block';
        loadMessages();
    } else {
        alert('Yanlış şifre!');
    }
}

function loadMessages() {
    const messagesRef = ref(window.database, 'messages');
    onValue(messagesRef, (snapshot) => {
        const messages = snapshot.val();
        displayMessages(messages);
    });
}

function displayMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';

    if (!messages) {
        messagesList.innerHTML = '<p>Henüz mesaj bulunmamaktadır.</p>';
        return;
    }

    Object.keys(messages).reverse().forEach(key => {
        const message = messages[key];
        const date = new Date(message.timestamp).toLocaleString('tr-TR');
        
        const messageCard = document.createElement('div');
        messageCard.className = 'message-card';
        messageCard.innerHTML = `
            <div class="message-header">
                <div>
                    <span class="message-type ${message.type === 'appointment' ? 'appointment' : 'general'}">
                        ${message.type === 'appointment' ? 'Randevu Talebi' : 'Genel Mesaj'}
                    </span>
                </div>
                <span class="message-date">${date}</span>
            </div>
            <div class="message-content">
                <p><strong>Ad Soyad:</strong> ${message.name}</p>
                <p><strong>E-posta:</strong> ${message.email}</p>
                <p><strong>Telefon:</strong> ${message.phone}</p>
                ${message.service ? `<p><strong>Hizmet:</strong> ${message.service}</p>` : ''}
                <p><strong>Mesaj:</strong> ${message.message}</p>
            </div>
            <div class="message-actions">
                <button class="action-btn delete-btn" onclick="deleteMessage('${key}')">
                    <i class="fas fa-trash"></i> Sil
                </button>
                <button class="action-btn archive-btn" onclick="archiveMessage('${key}')">
                    <i class="fas fa-archive"></i> Arşivle
                </button>
            </div>
        `;
        messagesList.appendChild(messageCard);
    });
}

function filterMessages(type) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const messagesRef = ref(window.database, 'messages');
    get(messagesRef).then((snapshot) => {
        const messages = snapshot.val();
        const filteredMessages = {};
        
        if (messages) {
            Object.keys(messages).forEach(key => {
                if (type === 'all' || messages[key].type === type) {
                    filteredMessages[key] = messages[key];
                }
            });
        }
        
        displayMessages(filteredMessages);
    });
}

function deleteMessage(messageId) {
    if (confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
        const messageRef = ref(window.database, 'messages/' + messageId);
        remove(messageRef);
    }
}

function archiveMessage(messageId) {
    const messageRef = ref(window.database, 'messages/' + messageId);
    get(messageRef).then((snapshot) => {
        const message = snapshot.val();
        if (message) {
            const archivedRef = ref(window.database, 'archived/' + messageId);
            set(archivedRef, message)
                .then(() => {
                    remove(messageRef);
                    alert('Mesaj arşivlendi!');
                });
        }
    });
}

// Make functions available globally
window.login = login;
window.filterMessages = filterMessages;
window.deleteMessage = deleteMessage;
window.archiveMessage = archiveMessage; 