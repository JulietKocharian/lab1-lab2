from flask import Flask

from app.routes import bp


def create_app():
    app = Flask(__name__)
    app.register_blueprint(bp)

    @app.errorhandler(404)
    def not_found(_error):
        return "not found\n", 404, {"Content-Type": "text/plain; charset=utf-8"}

    return app
