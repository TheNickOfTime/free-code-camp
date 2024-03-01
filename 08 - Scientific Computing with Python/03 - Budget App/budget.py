filler_char = " "

class Category:

	def __init__(self, category):
		self.category = category
		self.balance = 0
		self.ledger = []

	def __str__(self):
		title = f'{str(self.category).center(30, "*")}\n'
		entries = []
		total = f'\nTotal: {self.get_balance()}'
		for entry in self.ledger:
			description = entry['description'][0:23].ljust(23)
			amount = f'{entry["amount"]:.2f}'.format().rjust(7)
			entries.append(description + amount)

		return title + "\n".join(entries) + total

	def deposit(self, amount, description=''):
		transaction_data = {
			'amount': amount,
			'description': description,
		}
		self.balance += amount
		self.ledger.append(transaction_data)
		# print('Deposit:', amount, self.balance, '-', description)
	
	def withdraw(self, amount, description=''):
		if not self.check_funds(amount):
			return False

		transaction_data = {
			'amount': amount * -1,
			'description': description,
		}
		self.balance -= amount
		self.ledger.append(transaction_data)
		# print('Deposit:', amount, self.balance, '-', description)

		return True

	def transfer(self, amount, category):
		if not self.check_funds(amount):
			return False

		self.withdraw(amount, f"Transfer to {category.category}")
		category.deposit(amount, f"Transfer from {self.category}")

		return True

	def get_balance(self):
		# return f'{self.balance:.2f}'
		return self.balance

	def check_funds(self, amount):
		return amount <= self.balance


def create_spend_chart(categories):
	# define chart components
	chart_title = 'Percentage spent by category'
	chart_base = [
		'100|',
		' 90|',
		' 80|',
		' 70|',
		' 60|',
		' 50|',
		' 40|',
		' 30|',
		' 20|',
		' 10|',
		'  0|',
	]
	chart_width = len(categories) * 3
	chart_line = '    ' + ('-' * (chart_width + 1))

	# get categorical percentages
	ledgers = [category.ledger for category in categories]
	transactions = [[transaction['amount'] * -1 for transaction in ledger if transaction['amount'] < 0] for ledger in ledgers]
	transaction_sums = [sum(transaction) for transaction in transactions]
	transaction_sum_total = sum(transaction_sums)
	transaction_percentages = [(transaction_sum / transaction_sum_total) * 100 // 10 for transaction_sum in transaction_sums]
	chart_percentages = []
	for percentage in transaction_percentages:
		chart_markers = []
		index = 10
		while percentage >= 0:
			if index == percentage:
				chart_markers.append(f'{filler_char}o{filler_char}')
				percentage -= 1
			else:
				chart_markers.append(f'{filler_char * 3}')
			
			index -= 1
		
		chart_percentages.append(chart_markers)
	chart_percentages.append(filler_char * 11)
	
	# combine base chart components with percentages
	chart_main = []
	for marker_index in range(11):
		row_markers = [category[marker_index] for category in chart_percentages]
		chart_row = chart_base[marker_index] + ''.join(row_markers);
		chart_main.append(chart_row)
	
	# make labels
	category_names = [name.category for name in categories]
	longest_label = 0
	for label in category_names:
		if len(label) > longest_label:
			longest_label = len(label)
	chart_labels = [[*(label.ljust(longest_label, filler_char))] for label in category_names]
	formatted_labels = []
	for row_index in range(longest_label):
		row_chars ='    ' + ''.join([f'{filler_char}{label[row_index]}{filler_char}' for label in chart_labels])
		row_chars += filler_char
		formatted_labels.append(row_chars)

	# combine chart components
	chart_complete = '\n'.join([
		chart_title,
		'\n'.join(chart_main),
		chart_line,
		'\n'.join(formatted_labels)
	])
	print([category.balance for category in categories], '/n', chart_complete)

	return chart_complete