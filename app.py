from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)
DATABASE = 'database.db'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/urlaub')
def urlaub():
        return render_template('urlaub.html')

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db_connection() as conn:
        conn.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            start TEXT NOT NULL,
            end TEXT NOT NULL,
            reason TEXT NOT NULL
        )
        ''')
        conn.commit()

@app.route('/api/get-events', methods=['GET'])
def get_events():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, reason, start, end FROM events")
    rows = cursor.fetchall()
    conn.close()
    events = [
        {"id": row[0], "title": row[1], "reason": row[2], "start": row[3], "end": row[4]}
        for row in rows
    ]
    return jsonify(events)


@app.route('/api/add-event', methods=['POST'])
def add_event():
    data = request.json
    title = data.get('title')
    start = data.get('start')
    end = data.get('end')
    reason = data.get('reason')

    if not title or not start or not end or not reason:
        return jsonify({"error": "Invalid data"}), 400

    conn = get_db_connection()
    conn.execute('INSERT INTO events (title, start, end, reason) VALUES (?, ?, ?, ?)', 
                 (title, start, end, reason))
    conn.commit()
    conn.close()
    return jsonify({"status": "success"}), 201

@app.route('/api/delete-event', methods=['DELETE'])
def delete_event():
    data = request.json
    event_id = data.get('id')
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("DELETE FROM events WHERE id = ?", (event_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Event gelöscht!"}), 200


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
