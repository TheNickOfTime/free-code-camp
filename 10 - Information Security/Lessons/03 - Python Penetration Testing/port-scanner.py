import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

host = "hackthissite.org"
port = int(str(input("Your desired port: ")))

def port_scanner(port):
	if s.connect_ex((host, port)):
		print("The port is closed")
	else:
		print("The port is open")

port_scanner(port=port)