import copy
import random
import collections
# Consider using the modules imported above.

class Hat:
	def __init__(self, **balls):
		self.contents = sum([[ball for _ in range(balls[ball])] for ball in balls], [])

	def draw(self, count):
		if count > len(self.contents):
			return self.contents
		
		drawn_balls = [self.contents.pop(self.contents.index(random.choice(self.contents))) for _ in range(count)]
		# print(self.contents)
		return drawn_balls


def experiment(hat, expected_balls, num_balls_drawn, num_experiments):
	experiments = [dict(collections.Counter(copy.deepcopy(hat).draw(num_balls_drawn))) for _ in range(num_experiments)]
	# print('\n'.join([str(experiment) for experiment in experiments]))
	results = [
		all([
			experiment[key] >= expected_balls[key]
			if key in experiment
			else False
			for key in expected_balls.keys()
		])for experiment in experiments
	]
	# print('\n'.join([str(result) for result in results]))
	matching_experiment_count = len([result for result in results if result])
	# print('\n'.join([', '.join(result) for result in experiments]))
	
	return matching_experiment_count / num_experiments