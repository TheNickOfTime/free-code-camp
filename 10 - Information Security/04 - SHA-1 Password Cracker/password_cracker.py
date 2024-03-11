import hashlib

def crack_sha1_hash(hash, use_salts = False):
	top_passwords = open('./top-10000-passwords.txt', 'r').read().splitlines()
	known_salts = open('./known-salts.txt', 'r').read().splitlines()
	
	for password in top_passwords:
		password_hash = hashlib.sha1(password.encode()).hexdigest()
		if password_hash == hash:
			return password
		
		if use_salts:
			for salt in known_salts:
				# prepend salt
				salted_password = salt + password
				password_hash = hashlib.sha1(salted_password.encode()).hexdigest()
				if password_hash == hash:
					return password
				
				# append salt
				salted_password = password + salt
				password_hash = hashlib.sha1(salted_password.encode()).hexdigest()
				if password_hash == hash:
					return password

	return 'PASSWORD NOT IN DATABASE'
	# top_passwords_hashed = dict([(hashlib.sha1(password.encode()).hexdigest(), password) for password in top_passwords])
	# print(top_passwords_hashed[hash])