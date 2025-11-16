// DOM elementleri
const userList = document.getElementById('userList');
const modalBody = document.getElementById('modalBody');
const userModal = new bootstrap.Modal(document.getElementById('userModal'));
const searchInput = document.getElementById('searchInput');

let allUsers = []; // tüm kullanıcıları saklayacağız

// Spinner gösterme fonksiyonu (tekrar kullanılabilir)
const showLoader = (container) => {
    container.innerHTML = `
        <div class="d-flex justify-content-center align-items-center p-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Yükleniyor...</span>
            </div>
        </div>
    `;
};

// Kullanıcıları listele
const renderUsers = (users) => {
    if (users.length === 0) {
        userList.innerHTML = `<li class="list-group-item text-center">Kullanıcı bulunamadı.</li>`;
        return;
    }

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
    showLoader(modalBody); // Spinner göster
    userModal.show();       // Modal hemen açılır

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const user = await response.json();

        // Küçük gecikme (200ms)
        await new Promise(resolve => setTimeout(resolve, 200));

        modalBody.innerHTML = `
            <p><strong>Ad:</strong> ${user.name}</p>
            <p><strong>Kullanıcı Adı:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Telefon:</strong> ${user.phone}</p>
            <p><strong>Web:</strong> ${user.website}</p>
            <p><strong>Şirket:</strong> ${user.company.name}</p>
            <p><strong>Adres:</strong> ${user.address.street}, ${user.address.city}</p>
        `;
    } catch (error) {
        modalBody.innerHTML = `<p class="text-danger">Kullanıcı detayları yüklenemedi!</p>`;
        console.error('Kullanıcı detayları yüklenirken hata oluştu:', error);
    }
};


// Filtreleme işlemi
const filterUsers = async (query) => {
    showLoader(userList); // Filtreleme sırasında spinner göster
    await new Promise(resolve => setTimeout(resolve, 300)); // Küçük gecikme efekti
    const filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
    );
    renderUsers(filtered);
};

// Sayfa yüklendiğinde kullanıcıları getir
const loadUsers = async () => {
    showLoader(userList); // Başlangıç spinner
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        allUsers = await response.json();
        renderUsers(allUsers);
    } catch (error) {
        userList.innerHTML = `<li class="list-group-item text-center text-danger">Kullanıcılar yüklenemedi!</li>`;
        console.error('Kullanıcılar yüklenirken hata oluştu:', error);
    }
};

// Filtreleme inputunu dinle
searchInput.addEventListener('input', (e) => {
    filterUsers(e.target.value);
});

// Sayfa yüklendiğinde kullanıcıları yükle
window.addEventListener('DOMContentLoaded', loadUsers);
