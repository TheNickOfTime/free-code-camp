NUMBER_OF_DISKS = 5
A = list(range(NUMBER_OF_DISKS, 0, -1))
B = []
C = []

def move(n, source, auxiliary, target):
    if n <= 0:
        return
        
    # move n - 1 disks from source to auxiliary, so they are out of the way
    move(n - 1, source, target, auxiliary)
    
    # move the nth disk from source to target
    target.append(source.pop())
    
    # display our progress
    print(A, B, C, '\n')
    
    # move the n - 1 disks that we left on auxiliary onto target
    move(n - 1,  auxiliary, source, target)
              
# initiate call from source A to target C with auxiliary B
move(NUMBER_OF_DISKS, A, B, C)

# def move(n, source, auxiliary, target):
#     # display starting configuration
#     print(rods, '\n')
#     for i in range(number_of_moves):
#         remainder = (i + 1) % 3
#         if remainder == 1:
#             if n % 2 != 0:
#                 print(f'Move {i + 1} allowed between {source} and {target}')
#                 make_allowed_move(source, target)
#             else:
#                 print(f'Move {i + 1} allowed between {source} and {auxiliary}')
#                 make_allowed_move(source, auxiliary)
#         elif remainder == 2:
#             if n % 2 != 0:
#                 print(f'Move {i + 1} allowed between {source} and {auxiliary}')
#                 make_allowed_move(source, auxiliary)
#             else:
#                 print(f'Move {i + 1} allowed between {source} and {target}')
#                 make_allowed_move(source, target)
#         elif remainder == 0:
#             print(f'Move {i + 1} allowed between {auxiliary} and {target}')
#             make_allowed_move(auxiliary, target)