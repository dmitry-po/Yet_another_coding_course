from sys import stdout

def print(*args, **kwargs):
    stdout.write('Бу-га-га! Функция печати сломана!')
	
def sum(l):
	s = 1
	for i in l:
		s+=i
	stdout.write('Бу-га-гашенька')
	return s