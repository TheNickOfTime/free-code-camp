import nmap

scanner = nmap.PortScanner()

print("Welcome, this is a simple nmap automation tool")
print("----------------------------------------------")

ip_addr = input('Please enter the IP address you want to scan: ')
print('The IP you entered is: ', ip_addr)

response = input(
	"\nPlease enter the type of scan you want to run" +
	"\n1) TCP Scan" +
	"\n2) UDP Scan" +
	"\n3) Comprehensive Scan" +
	"\n"
)

if response == '1':
	print('Nmap version: ', scanner.nmap_version())
	scanner.scan(ip_addr, '1-1024', '-v -sS', sudo=True)
	print(scanner.scaninfo())
	print("IP Status: ", scanner[ip_addr].state())
	print(scanner[ip_addr].all_protocols())
	print("Open Ports: ", scanner[ip_addr]['tcp'].keys())
elif response == '2':
	print('Nmap version: ', scanner.nmap_version())
	scanner.scan(ip_addr, '1-1024', '-v -sU', sudo=True)
	print(scanner.scaninfo())
	print("IP Status: ", scanner[ip_addr].state())
	print(scanner[ip_addr].all_protocols())
	print("Open Ports: ", scanner[ip_addr]['udp'].keys())
elif response == '3':
	print('Nmap version: ', scanner.nmap_version())
	scanner.scan(ip_addr, '1-1024', '-v -sU -sV -sC -A -O', sudo=True)
	print(scanner.scaninfo())
	print("IP Status: ", scanner[ip_addr].state())
	print(scanner[ip_addr].all_protocols())
	print("Open Ports: ", scanner[ip_addr]['tcp'].keys())
else:
	print("Please enter a valid nuumber")