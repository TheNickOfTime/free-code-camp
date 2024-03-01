class Rectangle:
	def __init__(self, width, height):
		self.width = width
		self.height = height
	
	def __str__(self):
		return f'{self.__class__.__name__}(width={self.width}, height={self.height})'
	
	def set_width(self, new_width):
		self.width = new_width
	
	def set_height(self, new_height):
		self.height = new_height

	def get_area(self):
		return self.width * self.height

	def get_perimeter(self):
		return self.width * 2 + self.height * 2

	def get_diagonal(self):
		return (self.width ** 2 + self.height ** 2) ** .5

	def get_picture(self):
		if self.width > 50 or self.height > 50:
			return 'Too big for picture.'
		else:
			rows = [('*' * self.width) + '\n' for _ in range(self.height)]
			return ''.join(rows)

	def get_amount_inside(self, other_shape):
		return self.get_area() // other_shape.get_area()




class Square(Rectangle):
	def __init__(self, side):
		super().__init__(side, side)
	
	def __str__(self):
		return f'{self.__class__.__name__}(side={self.width})'
	
	def set_side(self, side):
		self.width = side
		self.height= side

	def set_width(self, new_width):
		self.width = new_width
		self.height = new_width

	def set_height(self, new_height):
		self.width = new_height
		self.height = new_height