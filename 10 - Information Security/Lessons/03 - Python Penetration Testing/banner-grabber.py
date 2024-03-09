import socket


def main():
	ip = input("Please enter an IP address: ")
	port = int(input("Please enter a port: "))

	banner(ip=ip, port=port)


def banner(ip, port):
	s = socket.socket()
	s.connect((ip, port))
	s.settimeout(5)

	res = str(s.recv(1024).strip()).strip()
	print(res)


main()