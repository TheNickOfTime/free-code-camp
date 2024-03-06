import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from pandas.plotting import register_matplotlib_converters
register_matplotlib_converters()

# Import data (Make sure to parse dates. Consider setting index column to 'date'.)
df = pd.read_csv('./fcc-forum-pageviews.csv', index_col='date', parse_dates=True)

# Clean data
df = df[
	(df['value'] >= df['value'].quantile(0.025))
	& (df['value'] <= df['value'].quantile(0.975))
]


def draw_line_plot():
	# Draw line plot
	min_date = pd.to_datetime(df.index.min()).strftime('%m/%Y')
	max_date = pd.to_datetime(df.index.max()).strftime('%m/%Y')
	title = 'Daily freeCodeCamp Forum Page Views 5/2016-12/2019'
	fig = df.plot(
		kind='line',
		y='value',
		title=title,
		xlabel='Date',
		ylabel='Page Views',
		legend=False,
		rot=0,
		figsize=(15, 5),
		style={'value': '#d62727'}
	).figure
	plt.xticks(horizontalalignment='center')

	# Save image and return fig (don't change this part)
	fig.savefig('line_plot.png')
	return fig

def draw_bar_plot():
	df_bar = df
	df_bar['month'] = df.index.strftime('%m')
	df_bar['year'] = df.index.strftime('%Y')

	df_bar = df_bar.groupby(['year', 'month']).mean().unstack()
	df_bar.columns = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		]
	
	fig, ax = plt.subplots(figsize=(7, 6))

	fig = df_bar.plot(
		kind='bar',
		ax=ax,
		xlabel='Years',
		ylabel='Average Page Views'
	).figure

	# Save image and return fig (don't change this part)
	fig.savefig('bar_plot.png')
	return fig

def draw_box_plot():
	# Prepare data for box plots (this part is done!)
	df_box = df.copy()
	df_box.reset_index(inplace=True)
	df_box['year'] = [d.year for d in df_box.date]
	df_box['month'] = [d.strftime('%b') for d in df_box.date]

	# Draw box plots (using Seaborn)
	fig, ax = plt.subplots(1, 2, figsize=(21, 7))
	sns.boxplot(
		data=df_box,
		ax=ax[0],
		x='year',
		y='value',
		palette='tab10',
		hue='year',
		legend=False,
		fliersize=1
	)
	ax[0].set_title('Year-wise Box Plot (Trend)')
	ax[0].set_xlabel('Year')
	ax[0].set_ylabel('Page Views')

	sns.boxplot(
		data=df_box,
		ax=ax[1],
		x='month',
		y='value',
		hue='month',
		legend=False,
		order=[
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		],
		hue_order=[
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		],
		fliersize=1
	).figure
	ax[1].set_title('Month-wise Box Plot (Seasonality)')
	ax[1].set_xlabel('Month')
	ax[1].set_ylabel('Page Views')
	fig.tight_layout()

	# Save image and return fig (don't change this part)
	fig.savefig('box_plot.png')
	return fig
