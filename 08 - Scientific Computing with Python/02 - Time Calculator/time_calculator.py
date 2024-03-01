import re
import datetime

def add_time(start, duration, weekday=None):
	duration_hours, duration_minutes = re.split(r'[ :]', duration)
	weekday_map = {
		'Monday': 0,
		'Tuesday': 1,
		'Wednesday': 2,
		'Thursday': 3,
		'Friday' : 4,
		'Saturday' : 5,
		'Sunday' : 6
	}

	## get start time
	start_format_string = '%I:%M %p'
	start_time = datetime.datetime.strptime(start, start_format_string)
	if weekday:
		start_time += datetime.timedelta(days=weekday_map[weekday.title()])
	print(start_time)
	
	# get duration delta
	duration_time = datetime.timedelta(hours=int(duration_hours), minutes=int(duration_minutes))
	result_time = start_time + duration_time

	# get base time
	result_format_string = '%I:%M %p'

	# add weekday if argument is present
	if weekday:
		result_format_string += ', %A'

	# make the formatted time
	formatted_time = result_time.strftime(result_format_string).lstrip('0')

	# add days later if necessary
	days_later = result_time.day - start_time.day
	if days_later > 0:
		days_later_string = ' (next day)' if days_later == 1 else f' ({days_later} days later)'
		formatted_time += days_later_string
	
	return formatted_time