from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)

# Caminho do banco de dados
DB_PATH = 'medicamentos.db'

def init_db():
    """Inicializa o banco de dados"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS medicamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo_barras TEXT NOT NULL,
            nome TEXT,
            validade DATE NOT NULL,
            data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
            alertado BOOLEAN DEFAULT 0
        )
    ''')
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Retorna uma conexão com o banco de dados"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/medicamentos', methods=['POST'])
def cadastrar_medicamento():
    """Cadastra um novo medicamento"""
    try:
        data = request.get_json()
        codigo_barras = data.get('codigo_barras')
        nome = data.get('nome', 'Medicamento')
        validade = data.get('validade')
        
        if not codigo_barras or not validade:
            return jsonify({'erro': 'Código de barras e validade são obrigatórios'}), 400
        
        # Valida formato da data
        try:
            datetime.strptime(validade, '%Y-%m-%d')
        except ValueError:
            return jsonify({'erro': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO medicamentos (codigo_barras, nome, validade)
            VALUES (?, ?, ?)
        ''', (codigo_barras, nome, validade))
        
        conn.commit()
        medicamento_id = cursor.lastrowid
        conn.close()
        
        return jsonify({
            'mensagem': 'Medicamento cadastrado com sucesso',
            'id': medicamento_id
        }), 201
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.route('/api/medicamentos', methods=['GET'])
def listar_medicamentos():
    """Lista todos os medicamentos cadastrados"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, codigo_barras, nome, validade, data_cadastro, alertado
            FROM medicamentos
            ORDER BY validade ASC
        ''')
        
        medicamentos = []
        for row in cursor.fetchall():
            medicamentos.append({
                'id': row['id'],
                'codigo_barras': row['codigo_barras'],
                'nome': row['nome'],
                'validade': row['validade'],
                'data_cadastro': row['data_cadastro'],
                'alertado': row['alertado']
            })
        
        conn.close()
        
        return jsonify(medicamentos), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.route('/api/medicamentos/<int:id>', methods=['DELETE'])
def deletar_medicamento(id):
    """Deleta um medicamento pelo ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM medicamentos WHERE id = ?', (id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'erro': 'Medicamento não encontrado'}), 404
        
        conn.close()
        return jsonify({'mensagem': 'Medicamento deletado com sucesso'}), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.route('/api/medicamentos/alertas', methods=['GET'])
def verificar_alertas():
    """Verifica medicamentos próximos do vencimento (30 dias)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Data limite: hoje + 30 dias
        data_limite = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
        data_hoje = datetime.now().strftime('%Y-%m-%d')
        
        cursor.execute('''
            SELECT id, codigo_barras, nome, validade, data_cadastro
            FROM medicamentos
            WHERE validade <= ? AND validade >= ?
            ORDER BY validade ASC
        ''', (data_limite, data_hoje))
        
        alertas = []
        for row in cursor.fetchall():
            validade_date = datetime.strptime(row['validade'], '%Y-%m-%d')
            dias_restantes = (validade_date - datetime.now()).days
            
            alertas.append({
                'id': row['id'],
                'codigo_barras': row['codigo_barras'],
                'nome': row['nome'],
                'validade': row['validade'],
                'dias_restantes': dias_restantes
            })
        
        conn.close()
        
        return jsonify(alertas), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.route('/api/medicamentos/vencidos', methods=['GET'])
def listar_vencidos():
    """Lista medicamentos já vencidos"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        data_hoje = datetime.now().strftime('%Y-%m-%d')
        
        cursor.execute('''
            SELECT id, codigo_barras, nome, validade, data_cadastro
            FROM medicamentos
            WHERE validade < ?
            ORDER BY validade DESC
        ''', (data_hoje,))
        
        vencidos = []
        for row in cursor.fetchall():
            vencidos.append({
                'id': row['id'],
                'codigo_barras': row['codigo_barras'],
                'nome': row['nome'],
                'validade': row['validade'],
                'data_cadastro': row['data_cadastro']
            })
        
        conn.close()
        
        return jsonify(vencidos), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Verifica se a API está funcionando"""
    return jsonify({'status': 'ok', 'mensagem': 'API funcionando corretamente'}), 200

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
