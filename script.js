document.querySelectorAll('.buy-btn').forEach(button => {
    button.addEventListener('click', function () {
        let menuAction = this.nextElementSibling;
        menuAction.style.display = 'flex';
        this.style.display = 'none';

        let jumlahElement = menuAction.querySelector('.jumlah b');
        let jumlah = parseInt(jumlahElement.innerText);
        jumlahElement.innerText = jumlah + 1;

        updateFooter(this.closest('.r-card'), jumlahElement.innerText);
    });
});

document.querySelectorAll('.increase-btn').forEach(button => {
    button.addEventListener('click', function () {
        let jumlahElement = this.previousElementSibling.querySelector('b');
        let jumlah = parseInt(jumlahElement.innerText);
        jumlahElement.innerText = jumlah + 1;

        updateFooter(this.closest('.r-card'), jumlahElement.innerText);
        toggleMenuAction(this.closest('.menu-action'), jumlahElement);
    });
});

document.querySelectorAll('.decrease-btn').forEach(button => {
    button.addEventListener('click', function () {
        let jumlahElement = this.nextElementSibling.querySelector('b');
        let jumlah = parseInt(jumlahElement.innerText);
        if (jumlah > 0) {
            jumlahElement.innerText = jumlah - 1;

            updateFooter(this.closest('.r-card'), jumlahElement.innerText);
            toggleMenuAction(this.closest('.menu-action'), jumlahElement);
        }
    });
});

function toggleMenuAction(menuAction, jumlahElement) {
    let buyButton = menuAction.previousElementSibling;
    if (parseInt(jumlahElement.innerText) === 0) {
        menuAction.style.display = 'none';
        buyButton.style.display = 'inline-block';
    } else {
        menuAction.style.display = 'flex';
        buyButton.style.display = 'none';
    }
}

function updateFooter(card, jumlah) {
    let title = card.querySelector('.menu-title b').innerText;
    let price = card.querySelector('.price-menu').firstChild.textContent.trim();
    let footerMenu = document.getElementById('footer-menu');

    let existingItem = footerMenu.querySelector(`[data-title="${title}"]`);

    if (existingItem) {
        if (jumlah == 0) {
            existingItem.remove();
        } else {
            existingItem.innerText = `${title} x${jumlah} = ${jumlah * parseInt(price.replace('.', ''))}`;
        }
    } else {
        if (jumlah > 0) {
            let newItem = document.createElement('div');
            newItem.setAttribute('data-title', title);
            newItem.innerText = `${title} x${jumlah} = ${jumlah * parseInt(price.replace('.', ''))}`;
            footerMenu.appendChild(newItem);
        }
    }

    updateTotalPrice();
}

function updateTotalPrice() {
    let total = 0;
    document.querySelectorAll('#footer-menu div').forEach(item => {
        let parts = item.innerText.split(' = ');
        total += parseInt(parts[1].replace('.', ''));
    });
    document.getElementById('total-price').innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

document.getElementById('pesan-btn').addEventListener('click', function () {
    let alamat = document.getElementById('alamat').value;
    let total = parseInt(document.getElementById('total-price').innerText.replace('Rp ', '').replace(
        '.', ''));

    if (alamat.trim() === '' || total === 0) {
        alert('Tolong Buat Pesanan dengan Sungguh-Sungguh');
        return;
    }

    let menuItems = [];
    document.querySelectorAll('#footer-menu div').forEach(item => {
        menuItems.push(item.innerText.split(' = ')[0]);
    });

    let whatsappMessage = `Menu\n- ${menuItems.join('\n- ')}\nAlamat = ${alamat}`;
    let whatsappUrl = `https://wa.me/6281281865275?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappUrl, '_blank');
});