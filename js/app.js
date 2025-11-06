// DOM elementleri
const userList = document.getElementById('userList');
const modalBody = document.getElementById('modalBody');
const userModal = new bootstrap.Modal(document.getElementById('userModal'));
const searchInput = document.getElementById('searchInput'); // 👈 yeni eklenen input

let allUsers = []; // 👈 tüm kullanıcıları saklayacağız

// Kullanıcıları listele
const renderUsers = (users) => {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            ${user.name}
            <button class="btn btn-info btn-sm" onclick="showUserDetails(${user.id})">Detaylar</button>
        `;
        userList.appendChild(li);
    });
};

// Kullanıcı detaylarını modal ile göster
const showUserDetails = async (userId) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const user = await response.json();

        modalBody.innerHTML = `
            <p><strong>Ad:</strong> ${user.name}</p>
            <p><strong>Kullanıcı Adı:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Telefon:</strong> ${user.phone}</p>
            <p><strong>Web:</strong> ${user.website}</p>
            <p><strong>Şirket:</strong> ${user.company.name}</p>
            <p><strong>Adres:</strong> ${user.address.street}, ${user.address.city}</p>
        `;

        userModal.show();
    } catch (error) {
        console.error('Kullanıcı detayları yüklenirken hata oluştu:', error);
    }
};

// Filtreleme işlemi
const filterUsers = (query) => {
    const filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
    );
    renderUsers(filtered);
};

// Sayfa yüklendiğinde kullanıcıları getir
const loadUsers = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        allUsers = await response.json(); // 👈 orijinal diziyi saklıyoruz
        renderUsers(allUsers);
    } catch (error) {
        console.error('Kullanıcılar yüklenirken hata oluştu:', error);
    }
};

// Filtreleme inputunu dinle
searchInput.addEventListener('input', (e) => {
    filterUsers(e.target.value);
});

// Sayfa yüklendiğinde kullanıcıları yükle
window.addEventListener('DOMContentLoaded', loadUsers);
