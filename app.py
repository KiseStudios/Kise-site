import http.server
import socketserver
import os


class SilentHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """
    A simple request handler that serves files from the directory
    where this script is located. It overrides logging to minimize
    console noise and sets mime types for common extensions.
    """
    def log_message(self, format, *args):
        # Override to silence default logging output
        pass

def run_server(port: int = 8000):
    """
    Starts a basic HTTP server on the specified port. This server
    serves all files relative to the directory containing this script.
    """
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    handler = SilentHTTPRequestHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Servidor executando em http://localhost:{port}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            print("Servidor encerrado.")


if __name__ == "__main__":
    run_server()
  
