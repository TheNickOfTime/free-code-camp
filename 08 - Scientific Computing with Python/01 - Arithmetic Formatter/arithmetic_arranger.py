import re

symbol_regex = r"((?:[*/+-])?\s?[0-9a-zA-Z]+)+"

def arithmetic_arranger(problems, evaluate=False):
	problems_split = [re.findall(symbol_regex, problem) for problem in problems]
	# print(problems_split)

	# check for to many problems
	if len(problems_split) > 5:
		return 'Error: Too many problems.'

	# loop through each problem to do some things
	formatted_problems = []
	for problem in problems_split:

		# find the length we need to pad for
		longest_length = 0
		for line in problem:
			# check for invalid characters
			for char in line:
				# print(re.match(r'[^0-9+-]', char))
				if re.match(r'[^ 0-9+-]', char):
					if re.match(r'[*/]', char):
						return "Error: Operator must be '+' or '-'."
					else:
						return 'Error: Numbers must only contain digits.'

				

			line_length = len(re.sub(r'[+\-]\s', '', line))

			# error check if numbers are too long
			if line_length > 4:
				return 'Error: Numbers cannot be more than four digits.'

			if line_length + 2 > longest_length:
				longest_length = line_length + 2

		# pad the string to right justify
		formatted_lines = []
		for line in problem:
			line_length = len(re.sub(r'[+-]\s', '', line)) + 2
			if len(line) < longest_length:
				if line.startswith(('-', '+')):
					padding_needed = (longest_length + 1) - len(line)
					padding = ' ' * (padding_needed)
					formatted_lines.append(line.replace(' ', padding))
				else:
					formatted_lines.append(line.rjust(longest_length))
			else:
				formatted_lines.append(line)
		
		# add solving line
		formatted_lines.append('-' * longest_length)
	
		# add solution line if needed
		if evaluate:
			solution = eval(" ".join(problem))
			solution_string = str(solution).rjust(longest_length);
			formatted_lines.append(solution_string)

		# add joined formatted lines to formatted problems
		formatted_problems.append(formatted_lines);
	
	# combine formatted lines horizontally
	combined_problems = []
	for problem_index in range(len(formatted_problems)):
		for line_index in range(len(formatted_problems[problem_index])):
			if len(combined_problems) - 1 < line_index:
				combined_problems.append([])
			# print(combined_problems, problem_index, line_index)
			combined_problems[line_index].append(formatted_problems[problem_index][line_index])
	
	result = '\n'.join(['    '.join(line) for line in combined_problems])

	# print(result)
	return result