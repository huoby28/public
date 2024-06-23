let total = 0;

function createActionButtons(card) {
    const actionDiv = card.querySelector('.info-action');
    actionDiv.innerHTML = `
        <button class="btn btn-danger btn-batalkan">x</button>
        <button class="btn btn-warning btn-kurangi">-</button>
        <button class="btn btn-success btn-tambahkan">+</button>
    `;

    actionDiv.querySelector('.btn-batalkan').addEventListener('click', () => batalkan(card));
    actionDiv.querySelector('.btn-kurangi').addEventListener('click', () => kurangi(card));
    actionDiv.querySelector('.btn-tambahkan').addEventListener('click', () => tambahkan(card));
}

function batalkan(card) {
    const title = card.querySelector('.info-title b').textContent;
    const priceText = card.querySelector('.info-price').textContent;
    const price = parseInt(priceText.replace('Rp', '').replace('.', '').trim());

    // Remove item from footer detail
    const footerMenu = document.getElementById('footer-menu');
    const items = footerMenu.querySelectorAll('.footer-item');
    items.forEach(item => {
        if (item.textContent.includes(title)) {
            const count = parseInt(item.dataset.count);
            total -= price * count;
            footerMenu.removeChild(item);
        }
    });

    // Update total price
    document.getElementById('total-price').textContent = `Rp ${total.toLocaleString('id-ID')}`;

    // Reset the card's action buttons
    card.querySelector('.info-action').innerHTML = `
        <button class="btn btn-success btn-action">Tambahkan</button>
    `;
    card.querySelector('.btn-action').addEventListener('click', ubahButton);
}

function kurangi(card) {
    const title = card.querySelector('.info-title b').textContent;
    const priceText = card.querySelector('.info-price').textContent;
    const price = parseInt(priceText.replace('Rp', '').replace('.', '').trim());

    // Find and update the item in footer detail
    const footerMenu = document.getElementById('footer-menu');
    const items = footerMenu.querySelectorAll('.footer-item');
    items.forEach(item => {
        if (item.textContent.includes(title)) {
            let count = parseInt(item.dataset.count);
            if (count > 1) {
                count--;
                item.dataset.count = count;
                item.textContent = `${title} x${count} - Rp ${price * count}`;
                total -= price;
                document.getElementById('total-price').textContent = `Rp ${total.toLocaleString('id-ID')}`;
            }
        }
    });
}

function tambahkan(card) {
    const title = card.querySelector('.info-title b').textContent;
    const priceText = card.querySelector('.info-price').textContent;
    const price = parseInt(priceText.replace('Rp', '').replace('.', '').trim());

    // Find and update the item in footer detail
    const footerMenu = document.getElementById('footer-menu');
    const items = footerMenu.querySelectorAll('.footer-item');
    let found = false;
    items.forEach(item => {
        if (item.textContent.includes(title)) {
            let count = parseInt(item.dataset.count);
            count++;
            item.dataset.count = count;
            item.textContent = `${title} x${count} - Rp ${price * count}`;
            found = true;
        }
    });

    if (!found) {
        const newItem = document.createElement('div');
        newItem.classList.add('footer-item');
        newItem.dataset.count = 1;
        newItem.textContent = `${title} x1 - ${priceText}`;
        footerMenu.appendChild(newItem);
    }

    // Update total price
    total += price;
    document.getElementById('total-price').textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function ubahButton(event) {
    const button = event.target;
    const card = button.closest('.r-card');
    const title = card.querySelector('.info-title b').textContent;
    const priceText = card.querySelector('.info-price').textContent;
    const price = parseInt(priceText.replace('Rp', '').replace('.', '').trim());

    button.classList.remove('btn-success');
    createActionButtons(card);

    // Update the footer detail
    const footerMenu = document.getElementById('footer-menu');
    const newItem = document.createElement('div');
    newItem.classList.add('footer-item');
    newItem.dataset.count = 1;
    newItem.textContent = `${title} x1 - ${priceText}`;
    footerMenu.appendChild(newItem);

    // Update total price
    total += price;
    document.getElementById('total-price').textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

const buttons = document.querySelectorAll('.btn-action');
buttons.forEach(button => {
    button.addEventListener('click', ubahButton);
});

document.getElementById('pesan-btn').addEventListener('click', function() {
    const alamat = document.getElementById('alamat').value.trim();
    if (alamat === '' || total === 0) {
        alert('Tolong Buat Pesanan dengan Sungguh-Sungguh');
        return;
    }

    const footerMenu = document.getElementById('footer-menu');
    const items = footerMenu.querySelectorAll('.footer-item');
    let menuText = '';
    items.forEach(item => {
        menuText += `- ${item.textContent}\n`;
    });

    const message = `Menu\n${menuText}Alamat = ${alamat}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=6281281865275&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});