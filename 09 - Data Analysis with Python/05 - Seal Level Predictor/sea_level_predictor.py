import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress

def draw_plot():
	# Read data from file
	df = pd.read_csv('./epa-sea-level.csv')
	min_year = df['Year'].min()
	max_year = df['Year'].max()

	# Setup plot
	fig, ax = plt.subplots()
	ax.set_xlim(1850, 2075)
	ax.set_title('Rise in Sea Level')
	ax.set_xlabel('Year')
	ax.set_ylabel('Sea Level (inches)')

	# Create scatter plot
	scatter_x = df['Year']
	scatter_y = df['CSIRO Adjusted Sea Level']
	ax.scatter(x=scatter_x, y=scatter_y, c='cornflowerblue')

	# Create first line of best fit
	line_one_range = range(min_year, 2051)
	line_one = linregress(scatter_x, scatter_y)
	ax.plot(line_one_range, line_one.intercept + line_one.slope * line_one_range, c='gold')
	fig

	# Create second line of best fit
	df_2000 = df[df['Year'] >= 2000]
	line_two_x = df_2000['Year']
	line_two_y = df_2000['CSIRO Adjusted Sea Level']
	line_two_range = range(2000, 2051)
	line_two = linregress(line_two_x, line_two_y)
	ax.plot(line_two_range, line_two.intercept + line_two.slope * line_two_range, c='crimson')

	
	# Save plot and return data for testing (DO NOT MODIFY)
	fig.savefig('sea_level_plot.png')
	return plt.gca()