document.getElementById('btn').addEventListener('click', function() {
    const msg = document.getElementById('msg');
    msg.textContent = 'Deploy automático funcionando perfeitamente!';
    msg.classList.remove('hidden');
    this.style.display = 'none';
});
