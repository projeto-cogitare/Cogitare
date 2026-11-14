// ==========================================================================
// PROJETO COGITARE - TESTE A/B: VERSÃO B (INTERFACE DE BUSCA OTIMIZADA)
// ==========================================================================
(function() {
    const API_URL = '/api';
    let todosPontos = [];
    let filtroTipoAtual = 'todos';
    let marcadores = [];
    let mapInstance = null;
    let marcadorUsuario = null;

    // Inicializa o mapa Leaflet
    function initMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        // Se o Leaflet já tiver inicializado, reaproveita ou limpa
        if (mapContainer._leaflet_id) {
            mapContainer._leaflet_id = null;
        }

        mapInstance = L.map('map').setView([-23.6039, -46.9196], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(mapInstance);

        setTimeout(() => { mapInstance.invalidateSize(); }, 500);
    }

    // Carrega pontos da API
    async function carregarPontos() {
        try {
            const response = await fetch(`${API_URL}/pontos-coleta`);
            const data = await response.json();
            if (data.sucesso && Array.isArray(data.pontos)) {
                todosPontos = data.pontos;
                atualizarContadores();
                aplicarFiltros();
            }
        } catch (error) {
            console.error('Erro ao carregar pontos na Versão B:', error);
        }
    }

    // Atualiza badges de contagem nos chips
    function atualizarContadores() {
        const countTodos = todosPontos.length;
        const countAberto = todosPontos.filter(p => p.aberto_agora).length;
        const countUbs = todosPontos.filter(p => p.tipo && p.tipo.toUpperCase() === 'UBS').length;
        const countFarmacia = todosPontos.filter(p => p.tipo && p.tipo.toLowerCase().includes('farm')).length;

        const elTodos = document.getElementById('count-todos');
        const elAberto = document.getElementById('count-aberto');
        const elUbs = document.getElementById('count-ubs');
        const elFarmacia = document.getElementById('count-farmacia');

        if (elTodos) elTodos.textContent = countTodos;
        if (elAberto) elAberto.textContent = countAberto;
        if (elUbs) elUbs.textContent = countUbs;
        if (elFarmacia) elFarmacia.textContent = countFarmacia;
    }

    // Aplica os filtros de busca e categoria simultaneamente
    function aplicarFiltros() {
        const buscaInput = document.getElementById('filtro-busca');
        const termoBusca = (buscaInput ? buscaInput.value : '').toLowerCase().trim();

        let filtrados = todosPontos.filter(p => {
            // Filtro por categoria
            let matchTipo = true;
            if (filtroTipoAtual === 'aberto') {
                matchTipo = !!p.aberto_agora;
            } else if (filtroTipoAtual === 'UBS') {
                matchTipo = p.tipo && p.tipo.toUpperCase() === 'UBS';
            } else if (filtroTipoAtual === 'Farmácia') {
                matchTipo = p.tipo && p.tipo.toLowerCase().includes('farm');
            }

            // Filtro por texto (nome, endereço ou bairro)
            let matchTexto = true;
            if (termoBusca) {
                const nome = (p.nome || '').toLowerCase();
                const endereco = (p.endereco || '').toLowerCase();
                matchTexto = nome.includes(termoBusca) || endereco.includes(termoBusca);
            }

            return matchTipo && matchTexto;
        });

        renderizarLista(filtrados);
        renderizarMapa(filtrados);
    }

    // Renderiza a lista de cards com microinterações
    function renderizarLista(pontos) {
        const lista = document.getElementById('lista-pontos');
        if (!lista) return;

        if (pontos.length === 0) {
            lista.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-search fs-1 text-secondary opacity-50 mb-2 d-block"></i>
                    <p class="mb-1 fw-bold">Nenhum ponto encontrado.</p>
                    <small>Tente buscar por outro bairro ou remova os filtros.</small>
                </div>
            `;
            return;
        }

        lista.innerHTML = pontos.map(p => {
            const isUbs = p.tipo && p.tipo.toUpperCase() === 'UBS';
            const badgeTipo = isUbs 
                ? '<span class="badge bg-primary-subtle text-primary border border-primary-subtle me-1"><i class="bi bi-hospital me-1"></i>UBS</span>'
                : '<span class="badge bg-success-subtle text-success border border-success-subtle me-1"><i class="bi bi-capsule me-1"></i>Farmácia</span>';

            const badgeStatus = p.aberto_agora
                ? '<span class="badge bg-success"><i class="bi bi-clock me-1"></i>Aberto agora</span>'
                : '<span class="badge bg-secondary"><i class="bi bi-clock-history me-1"></i>Fechado</span>';

            const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`;

            return `
                <div class="card mb-2 border rounded-3 p-3 shadow-sm hover-card" style="cursor: pointer; transition: all 0.2s ease;"
                     onclick="window.focarPonto(${p.latitude}, ${p.longitude})">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <strong class="text-dark fs-6">${p.nome}</strong>
                        ${badgeStatus}
                    </div>
                    <div class="mb-2">
                        ${badgeTipo}
                        <span class="small text-muted"><i class="bi bi-clock me-1"></i>${p.horario_funcionamento || 'Horário comercial'}</span>
                    </div>
                    <p class="text-muted small mb-2">
                        <i class="bi bi-geo-alt-fill text-danger me-1"></i>${p.endereco}
                    </p>
                    <div class="d-flex justify-content-between align-items-center pt-2 border-top mt-1">
                        <small class="text-muted"><i class="bi bi-telephone me-1"></i>${p.telefone || 'Consulte no local'}</small>
                        <a href="${rotaUrl}" target="_blank" class="btn btn-sm btn-outline-success rounded-pill px-3 py-1 fw-semibold"
                           onclick="event.stopPropagation()">
                            <i class="bi bi-arrow-up-right me-1"></i> Rota
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Renderiza marcadores filtrados no mapa
    function renderizarMapa(pontos) {
        if (!mapInstance) return;

        // Limpa marcadores anteriores
        marcadores.forEach(m => mapInstance.removeLayer(m));
        marcadores = [];

        pontos.forEach(p => {
            const m = L.marker([p.latitude, p.longitude]).addTo(mapInstance);
            m.bindPopup(`
                <div style="min-width: 180px;">
                    <strong style="color: #2e7d32;">${p.nome}</strong><br>
                    <small style="color: #555;">${p.endereco}</small><br>
                    <span style="display:inline-block; margin-top: 4px; font-size: 11px; padding: 2px 6px; border-radius: 4px; background: #e8f5e9; color: #1b5e20;">
                        ${p.horario_funcionamento || ''}
                    </span>
                </div>
            `);
            marcadores.push(m);
        });

        // Se houver pontos, ajusta zoom suavemente
        if (pontos.length > 0 && marcadores.length > 0) {
            const group = new L.featureGroup(marcadores);
            mapInstance.fitBounds(group.getBounds().pad(0.2));
        }
    }

    // Funções expostas no escopo global para eventos inline
    window.setFiltroTipo = function(tipo, btn) {
        filtroTipoAtual = tipo;
        document.querySelectorAll('.btn-chip').forEach(b => {
            b.classList.remove('btn-success', 'active');
            b.classList.add('btn-outline-success');
        });
        if (btn) {
            btn.classList.remove('btn-outline-success');
            btn.classList.add('btn-success', 'active');
        }
        aplicarFiltros();
    };

    window.filtrarPontos = function() {
        aplicarFiltros();
    };

    window.limparBusca = function() {
        const input = document.getElementById('filtro-busca');
        if (input) input.value = '';
        aplicarFiltros();
    };

    window.focarPonto = function(lat, lng) {
        if (mapInstance) {
            mapInstance.flyTo([lat, lng], 16, { animate: true, duration: 1 });
        }
    };

    // Inicialização ao carregar o DOM
    document.addEventListener('DOMContentLoaded', () => {
        initMap();
        carregarPontos();
    });
})();

