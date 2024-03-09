import socket

serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

host = socket.gethostname()
port = 3000

serversocket.bind((host, port))
serversocket.listen(3)

while True:
	clientsocket, address = serversocket.accept()

	print("received connection from " % str(address))

	message = 'Thank you for connecting to this server' + "\r\n"

	clientsocket.send(message.encode('ascii'))

	clientsocket.close() 