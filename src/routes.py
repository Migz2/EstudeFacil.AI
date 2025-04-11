from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from functools import wraps
import sqlite3
import hashlib

bp = Blueprint('main', __name__)

# Função para verificar se o usuário está autenticado
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('main.login'))
        return f(*args, **kwargs)
    return decorated_function

# Rotas de autenticação
@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = hashlib.sha256(request.form['password'].encode()).hexdigest()
        
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute('SELECT id FROM users WHERE email = ? AND password = ?', (email, password))
        user = c.fetchone()
        conn.close()
        
        if user:
            session['user_id'] = user[0]
            return redirect(url_for('main.dashboard'))
        return render_template('login.html', error='Credenciais inválidas')
    return render_template('login.html')

@bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = hashlib.sha256(request.form['password'].encode()).hexdigest()
        name = request.form['name']
        
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        try:
            c.execute('INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
                     (email, password, name))
            conn.commit()
            return redirect(url_for('main.login'))
        except sqlite3.IntegrityError:
            return render_template('register.html', error='Email já cadastrado')
        finally:
            conn.close()
    return render_template('register.html')

# Rotas principais
@bp.route('/')
@login_required
def dashboard():
    return render_template('dashboard.html')

@bp.route('/resumos')
@login_required
def resumos():
    return render_template('resumos.html')

@bp.route('/questoes')
@login_required
def questoes():
    return render_template('questoes.html')

@bp.route('/historico')
@login_required
def historico():
    return render_template('historico.html')

# API Routes
@bp.route('/api/resumos', methods=['POST'])
@login_required
def criar_resumo():
    data = request.json
    texto = data.get('texto')
    titulo = data.get('titulo')
    
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('INSERT INTO resumos (user_id, titulo, texto) VALUES (?, ?, ?)',
             (session['user_id'], titulo, texto))
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'success'})

@bp.route('/api/questoes', methods=['POST'])
@login_required
def criar_questao():
    data = request.json
    pergunta = data.get('pergunta')
    resposta = data.get('resposta')
    tipo = data.get('tipo')
    
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('INSERT INTO questoes (user_id, pergunta, resposta, tipo) VALUES (?, ?, ?, ?)',
             (session['user_id'], pergunta, resposta, tipo))
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'success'}) 