#!/usr/bin/env python3
"""Dev server for Spent: serves the folder with no caching at all.

The cloud preview iframe is aggressive about caching the document, which made
edits invisible until a manual hard reload. Every response now carries
no-store, so the preview always reflects what is on disk.
"""

import os
import socketserver
from http.server import SimpleHTTPRequestHandler


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, max-age=0, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(root)
    with Server(("0.0.0.0", 3000), Handler) as httpd:
        print("Spent dev server on http://0.0.0.0:3000 (no-store)")
        httpd.serve_forever()
