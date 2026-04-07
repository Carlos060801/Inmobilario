from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 🔹 Ruta de prueba
@app.route('/')
def home():
    return "API Inmobiliaria funcionando 🚀"

# 🔹 Endpoint ejemplo (propiedades)
@app.route('/api/propiedades', methods=['GET'])
def obtener_propiedades():
    data = [
        {"id": 1, "titulo": "Casa en Neiva", "precio": 200000000},
        {"id": 2, "titulo": "Apartamento en Bogotá", "precio": 350000000}
    ]
    return jsonify(data)

# 🔹 Login básico (MVP)
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    usuario = data.get("usuario")
    password = data.get("password")

    if usuario == "admin" and password == "1234":
        return jsonify({"mensaje": "Login exitoso"})
    else:
        return jsonify({"error": "Credenciales incorrectas"}), 401

if __name__ == '__main__':
    app.run(debug=True)