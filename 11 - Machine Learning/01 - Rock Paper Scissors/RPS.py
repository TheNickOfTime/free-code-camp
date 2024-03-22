import numpy as np
import pandas as pd
from itertools import product
from collections import Counter

ideal_moves = {
	'R': 'P',
	'P': 'S',
	'S': 'R'
}

combos = list(product(['R', 'P', 'S'], repeat = 3))

their_history = []


def player(prev_play):
	global ideal_moves, their_history

	# Reset stuff at the top of a game against a player
	if prev_play == '':
		their_history.clear()


	# Make up a previous play if it doesn't exist
	if not prev_play:
		prev_play = 'R'
	their_history.append(prev_play)


	# Make stats for the last 50 moves (improves accuracy against abby)
	their_last_three_history = [''.join(their_history[i - 3: i]) for i in range(len(their_history)) if i > 2][-50:]
	their_history_counts = Counter(their_last_three_history)
	stats = {''.join(key): 0 for key in combos}
	for key in their_history_counts.keys():
		stats[key] = their_history_counts[key];


	# Get the opponents last three moves and add to the stats count
	their_last_three = "".join(their_history[-3:])
	if len(their_last_three) == 3:
		stats[their_last_three] += 1


	# Get the opponent's last two moves to see what the next possible moves are (pad with 'R' if there aren't enough previous moves)
	their_last_two = "".join(their_history[-2:])
	if len(their_last_two) < 2:
		their_last_two = their_last_two.rjust(2, 'R')


	# Check for the next potential plays
	potential_plays = [
		their_last_two + "R",
		their_last_two + "P",
		their_last_two + "S",
	]


	# Get stats info on potential plays
	sub_order = {
		k: stats[k]
		for k in potential_plays if k in stats
	}


	# Make prediction based on the most likely next move
	prediction = max(sub_order, key=sub_order.get)[-1:]


	return ideal_moves[prediction]