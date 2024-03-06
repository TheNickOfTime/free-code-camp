import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Import data
df = pd.read_csv('./medical_examination.csv')

# Add 'overweight' column
height_meters = df['height'] / 100
overweight_bmis = (df['weight'] / (height_meters ** 2)) > 25
df['overweight'] = np.where(overweight_bmis, 1, 0)
# print(df)

# Normalize data by making 0 always good and 1 always bad. If the value of 'cholesterol' or 'gluc' is 1, make the value 0. If the value is more than 1, make the value 1.
df['cholesterol'] = np.where(df['cholesterol'] > 1, 1, 0)
df['gluc'] = np.where(df['gluc'] > 1, 1, 0)
# print(df)

# Draw Categorical Plot
def draw_cat_plot():
#     # Create DataFrame for cat plot using `pd.melt` using just the values from 'cholesterol', 'gluc', 'smoke', 'alco', 'active', and 'overweight'.
	df_cat = pd.melt(df, id_vars=['cardio'], value_vars=['cholesterol', 'gluc', 'smoke', 'alco', 'active', 'overweight'])

	# Group and reformat the data to split it by 'cardio'. Show the counts of each feature. You will have to rename one of the columns for the catplot to work correctly.
	df_cat = df_cat.groupby(by = ['cardio']).value_counts().reset_index(name='total').sort_values(by = ['cardio', 'variable']).reset_index()

	# Draw the catplot with 'sns.catplot()'
	fig = sns.catplot(data=df_cat, kind='bar', x='variable', y='total', hue='value', col='cardio').fig

	# Do not modify the next two lines
	fig.savefig('catplot.png')
	return fig


# Draw Heat Map
def draw_heat_map():
	# Clean the data
	df_heat = df[
		(df['ap_lo'] <= df['ap_hi'])
		& (df['height'] >= df['height'].quantile(0.025))
		& (df['height'] <= df['height'].quantile(0.975))
		& (df['weight'] >= df['weight'].quantile(0.025))
		& (df['weight'] <= df['weight'].quantile(0.975))
	]

	# Calculate the correlation matrix
	corr = df_heat.corr()
	# corr = pd.DataFrame(np.tril(df_heat.corr(), -1))
	max = corr.melt()['value'].max()
	min = corr.melt()['value'].min()

	# Generate a mask for the upper triangle
	mask = np.triu(corr)

	# Set up the matplotlib figure
	fig, ax = plt.subplots(figsize=(11, 9));

	# Draw the heatmap with 'sns.heatmap()'
	sns.heatmap(
		corr,
		mask=mask,
		center=0,
		vmax=0.32,
		vmin=-0.16,
		square=True,
		fmt="0.1f",
		annot=True,
		linewidths=0.5,
		ax=ax,
		cbar_kws={'shrink': 0.5}
	)
	
	# Do not modify the next two lines
	fig.savefig('heatmap.png')
	return fig
