from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import requests
import sqlite3
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='../static', template_folder='../templates')
CORS(app)

# Database initialization
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            message TEXT,
            response TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

@app.route('/')
def index():
    return send_from_directory(app.template_folder, 'index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')
    user_id = data.get('user_id', 'default_user')  # In a real app, this would come from authentication
    
    try:
        # Call Ollama API (adjust URL and model as needed)
        response = requests.post('http://localhost:11434/api/generate', 
                               json={
                                   "model": "mistral",
                                   "prompt": message
                               })
        
        ai_response = response.json().get('response', 'Desculpe, não consegui processar sua mensagem.')
        
        # Store in database
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute('INSERT INTO conversations (user_id, message, response) VALUES (?, ?, ?)',
                 (user_id, message, ai_response))
        conn.commit()
        conn.close()
        
        return jsonify({
            'response': ai_response,
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    user_id = request.args.get('user_id', 'default_user')
    
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT message, response, timestamp FROM conversations WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50',
             (user_id,))
    history = c.fetchall()
    conn.close()
    
    return jsonify({
        'history': [{'message': h[0], 'response': h[1], 'timestamp': h[2]} for h in history],
        'status': 'success'
    })

if __name__ == '__main__':
    app.run(debug=True) 