import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  


app.config['JWT_SECRET_KEY'] = 'super-secret-key' 

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///platform.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
jwt = JWTManager(app)



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(80), nullable=True)
    last_name = db.Column(db.String(80), nullable=True)
    chat_name = db.Column(db.String(80), nullable=True)  

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "chat_name": self.chat_name or self.first_name
        }


with app.app_context():
    db.create_all()



@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    if not data or 'email' not in data:
        return jsonify({"error": "Электронная почта обязательна"}), 400
    
    email = data.get('email').strip().lower()
    first_name = data.get('firstName', '').strip()
    last_name = data.get('lastName', '').strip()


    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"error": "Пользователь с такой почтой уже зарегистрирован"}), 400


    new_user = User(
        email=email,
        first_name=first_name,
        last_name=last_name,
        chat_name=first_name 
    )
    
    db.session.add(new_user)
    db.session.commit()

    
    access_token = create_access_token(identity=str(new_user.id))
    return jsonify({
        "message": "Регистрация успешна",
        "token": access_token,
        "user": new_user.to_dict()
    }), 201


@app.route('/api/auth/code', methods=['POST'])
def request_code():
    data = request.json
    if not data or 'email' not in data:
        return jsonify({"error": "Укажите электронную почту"}), 400

    email = data.get('email').strip().lower()
    
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Пользователь с такой почтой не найден. Сначала зарегистрируйтесь"}), 404

    
    access_token = create_access_token(identity=str(user.id))
    
    
    return jsonify({
        "message": "Код успешно проверен",
        "token": access_token,
        "user": user.to_dict()
    }), 200


CHAT_MESSAGES = [
    {"id": 1, "user": "Женя", "text": "Всем привет", "likes": 567},
    {"id": 2, "user": "Женя", "text": "Крутая компания!", "likes": 11},
    {"id": 3, "user": "Женя", "text": "Я ХОЧУ ТУДА", "likes": 0}
]




@app.route('/api/video/stream')
def stream_video():
    
    video_path = os.path.join(app.root_path, 'media', 'video.mp4')
    
    
    if not os.path.exists(video_path):
        return jsonify({"error": "Видео-файл не найден на сервере. Создайте папку media и положите туда video.mp4"}), 404
        
    from flask import send_file
    return send_file(video_path, mimetype='video/mp4')



@app.route('/api/chat', methods=['GET'])
def get_messages():
    return jsonify(CHAT_MESSAGES), 200



@app.route('/api/chat', methods=['POST'])
@jwt_required()
def send_message():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "Пользователь не найден"}), 404
        
    data = request.json
    if not data or 'text' not in data:
        return jsonify({"error": "Текст сообщения пуст"}), 400

    
    new_msg = {
        "id": len(CHAT_MESSAGES) + 1,
        "user": user.chat_name or user.first_name or "Аноним",
        "text": data.get('text'),
        "likes": 0
    }
    
    CHAT_MESSAGES.append(new_msg)
    return jsonify(new_msg), 201



@app.route('/api/user/update-chat-name', methods=['PUT'])
@jwt_required()
def update_chat_name():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "Пользователь не найден"}), 404
        
    data = request.json
    new_name = data.get('chatName', '').strip()
    
    if not new_name:
        return jsonify({"error": "Имя не может быть пустым"}), 400
        
    user.chat_name = new_name
    db.session.commit()
    
    return jsonify(user.to_dict()), 200

@app.route('/')
def index():
    return jsonify({"status": "Backend is running"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)