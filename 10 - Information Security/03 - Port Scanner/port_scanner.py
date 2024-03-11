import common_ports
import ipaddress
import re
import socket

def get_open_ports(target, port_range, verbose = False):

	# check if ip or hostname
	is_ip = re.compile('^([0-9]+).([0-9]+).([0-9]+).([0-9]+)$').match(target)

	# check if valid target
	try:
		socket.gethostbyname_ex(target)
	except:
		return 'Error: Invalid IP address' if is_ip else 'Error: Invalid hostname'
	
	# get hostname
	hostname = target
	if is_ip:
		try:
			hostname = socket.gethostbyaddr(target)[0]
		except:
			print(f'could not resolve a hostname from {target}')


	# get ip
	ip = target
	if not is_ip:
		try:
			ip = socket.gethostbyname(target)
		except:
			print(f'could not resolve ip from hostname {target}')

	print(hostname, ip)

	ports_to_scan = list(range(port_range[0], port_range[1] + 1))
	print(f"Scanning ports {port_range[0]} through {port_range[1]}. Please wait...")
	open_ports = []
	for port in ports_to_scan:
		sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		sock.settimeout(1)
		try:
			sock.connect((ip, port))
		except:
			pass
		else:
			open_ports.append(port)
		# if not sock.connect_ex((hostname, port)):
		# 	open_ports.append(port)
		sock.close()

	if verbose:
		title = f'Open ports for {hostname}{f' ({ip})' if ip != hostname else ''}\n'
		headers = 'PORT     SERVICE\n'
		verbose_list = "\n".join([''.join([str(port).ljust(9), common_ports.ports_and_services[port]]) for port in open_ports])
		return ''.join([title, headers, verbose_list])
	else:
		return open_ports

	return(open_ports)