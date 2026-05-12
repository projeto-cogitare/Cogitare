from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import uuid
import math

app = Flask(__name__)
CORS(app)  # Permitir requisições do frontend

DATA_FILE = 'pontos.json'

# ========================================
# FUNÇÕES DE PERSISTÊNCIA (JSON)
# ========================================

def load_pontos():
    """Carrega os pontos de coleta do arquivo JSON."""
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        # Retorna lista vazia se o arquivo estiver corrompido
        return []

def save_pontos(pontos):
    """Salva os pontos de coleta no arquivo JSON."""
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(pontos, f, indent=2, ensure_ascii=False)

# ========================================
# FUNÇÕES DE CÁLCULO DE DISTÂNCIA
# ========================================

def calcular_distancia(lat1, lon1, lat2, lon2):
    """
    Calcula a distância entre dois pontos geográficos usando a fórmula de Haversine.
    Retorna a distância em quilômetros.
    """
    R = 6371.0 # Raio da Terra em km
    
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distancia = R * c
    return distancia

def filtrar_pontos_proximos(pontos, lat_usuario, lon_usuario, raio_km=10):
    """
    Filtra pontos de coleta dentro de um raio específico.
    Adiciona o campo 'distancia' a cada ponto.
    Retorna lista ordenada por distância (mais próximos primeiro).
    """
    pontos_com_distancia = []
    
    for ponto in pontos:
        try:
            distancia = calcular_distancia(
                lat_usuario, 
                lon_usuario, 
                ponto['latitude'], 
                ponto['longitude']
            )
            
            if distancia <= raio_km:
                ponto['distancia'] = round(distancia, 2)
                pontos_com_distancia.append(ponto)
        except (TypeError, KeyError):
            # Ignora pontos com dados de localização inválidos
            continue
    
    # Ordenar por distância
    pontos_com_distancia.sort(key=lambda x: x['distancia'])
    
    return pontos_com_distancia

# ========================================
# ENDPOINTS DA API
# ========================================

@app.route('/')
def index():
    return jsonify({
        'mensagem': 'API de Pontos de Coleta de Medicamentos (Versão Simplificada)',
        'versao': '1.0',
        'status': 'Online',
        'persistencia': 'JSON File'
    })

@app.route('/api/pontos-coleta', methods=['GET'])
def listar_pontos():
    """Lista todos os pontos de coleta."""
    pontos = load_pontos()
    return jsonify({
        'sucesso': True,
        'total': len(pontos),
        'pontos': pontos
    }), 200

@app.route('/api/pontos-coleta/proximos', methods=['GET'])
def listar_pontos_proximos():
    """Lista pontos de coleta próximos a uma localização."""
    try:
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        raio = request.args.get('raio', default=10, type=float)
        
        if lat is None or lng is None:
            return jsonify({
                'sucesso': False,
                'erro': 'Parâmetros lat e lng são obrigatórios'
            }), 400
        
        todos_pontos = load_pontos()
        pontos_proximos = filtrar_pontos_proximos(todos_pontos, lat, lng, raio)
        
        return jsonify({
            'sucesso': True,
            'localizacao': {
                'latitude': lat,
                'longitude': lng,
                'raio_km': raio
            },
            'total': len(pontos_proximos),
            'pontos': pontos_proximos
        }), 200
    except Exception as e:
        return jsonify({
            'sucesso': False,
            'erro': str(e)
        }), 500

@app.route('/api/pontos-coleta', methods=['POST'])
def adicionar_ponto():
    """Adiciona um novo ponto de coleta."""
    try:
        dados = request.get_json()
        
        # Validar campos obrigatórios
        campos_obrigatorios = ['nome', 'endereco', 'latitude', 'longitude']
        for campo in campos_obrigatorios:
            if campo not in dados:
                return jsonify({
                    'sucesso': False,
                    'erro': f'Campo obrigatório ausente: {campo}'
                }), 400
        
        # Criar novo ponto
        novo_ponto = {
            'id': str(uuid.uuid4()),
            'nome': dados['nome'],
            'endereco': dados['endereco'],
            'latitude': float(dados['latitude']),
            'longitude': float(dados['longitude']),
            'tipo': dados.get('tipo', 'outro'),
            'horario_funcionamento': dados.get('horario_funcionamento', ''),
            'telefone': dados.get('telefone', '')
        }
        
        # Adicionar ao JSON
        pontos = load_pontos()
        pontos.append(novo_ponto)
        save_pontos(pontos)
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Ponto de coleta adicionado com sucesso',
            'ponto': novo_ponto
        }), 201
    except Exception as e:
        return jsonify({
            'sucesso': False,
            'erro': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
