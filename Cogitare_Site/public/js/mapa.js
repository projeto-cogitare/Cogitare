const API_URL = '/api';
var map = L.map('map').setView([-23.6039, -46.9196], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Força o mapa a ocupar todo o espaço
setTimeout(() => { map.invalidateSize(); }, 500);

var marcadores = [];
var todosPontos = [];
var marcadorUsuario = null;

// FUNÇÃO PARA MOSTRAR O USUÁRIO (Corrigida)
function obterLocalizacaoAtual() {

    const loading = document.getElementById("loadingMapa");

    // Mostra feedback visual
    loading.style.display = "block";

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition((position) => {

            // Esconde loading quando terminar
            loading.style.display = "none";

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            if (marcadorUsuario)
                map.removeLayer(marcadorUsuario);

            // Ícone azul especial para o usuário
            var iconEu = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            marcadorUsuario = L.marker([lat, lng], { icon: iconEu }).addTo(map)
                .bindPopup("<b>Você está aqui!</b>")
                .openPopup();

            // Faz o mapa voar até usuário
            map.flyTo([lat, lng], 15);

        }, (error) => {

            // Esconde loading em caso de erro
            loading.style.display = "none";

            alert("Erro ao obter localização. Verifique se o GPS está ativo e se deu permissão ao navegador.");
        });

    } else {

        loading.style.display = "none";

        alert("Seu navegador não suporta geolocalização.");
    }
}

// CARREGAR PONTOS DO BANCO
async function carregarPontos() {
    try {
        const response = await fetch(`${API_URL}/pontos-coleta`);
        const data = await response.json();
        
        if (data.sucesso) {
            todosPontos = data.pontos;
            exibirPontos(todosPontos);
            adicionarFiltroDePontos();
        }
    } catch (error) {
        console.error(error);
    }
}

function adicionarFiltroDePontos() {
    const filtro = document.getElementById('filtroPontos');
    if (!filtro) return;

    filtro.addEventListener('keyup', function() {
        const termo = this.value.toLowerCase();
        const pontosFiltrados = todosPontos.filter(p => {
            return p.nome.toLowerCase().includes(termo) || p.endereco.toLowerCase().includes(termo);
        });
        exibirPontos(pontosFiltrados);
    });
}

function exibirPontos(pontos) {
    exibirNoMapa(pontos);
    exibirNaLista(pontos);
}

function exibirNoMapa(pontos) {
    marcadores.forEach(marker => map.removeLayer(marker));
    marcadores = [];

    pontos.forEach(p => {
        const marker = L.marker([p.latitude, p.longitude]).addTo(map)
            .bindPopup(`<b>${p.nome}</b><br>${p.endereco}`);
        marcadores.push(marker);
    });
}

function exibirNaLista(pontos) {
    const lista = document.getElementById('lista-pontos');
    if (pontos.length === 0) {
        lista.innerHTML = '<p class="p-3 small text-muted">Nenhum ponto encontrado.</p>';
        return;
    }
    lista.innerHTML = pontos.map(p => `
        <div class="ponto-card" onclick="map.flyTo([${p.latitude}, ${p.longitude}], 16)">
            <strong class="text-success">${p.nome}</strong><br>
            <small class="text-muted"><i class="bi bi-geo-alt"></i> ${p.endereco}</small>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', carregarPontos);