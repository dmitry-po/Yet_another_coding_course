# Основы JavaScript

## Прототипы

## Типы данных
<i>Source: https://realpython.com/python-vs-javascript/</i>

JS использует динамическую типизацию (тип объекта определяет по ходу выполнения):
```javascript
data = 42  
data = 'Text'
```

Используется т.н. "слабая" утиная типизация:
```javascript
'3' + 2 // return: '32'
```

При сложении строки и числа, число будет автоматически преобразовано в текст и выполнится операция конкатенации. Такое поведение удобно, когда оно выполняет нужную логику, но нужно всегда внимательно относиться в "слабой" типизации:
```javascript
'3' - 2 // 1
```

В JS используется 2 вида типов данных: **primitive** и **reference**. К первому виду относится неизменяемый набор типов:
* boolean
* null
* number
* string
* symbol (since ES6)
* undefined

Все остальные типы данных относятся ко второму виду, например:
* Array
* Boolean
* Date
* Map
* Number
* Object
* RegExp
* Set
* String
* Symbol
* (...)

Переменные вида primitive хранятся в отдельном разделе памяти, называемом stack: быстром, но с ограниченной памятью и сроком жизни. reference-переменные находятся в разделе heap, который ограничен только размерами доступной физической памяти, живут дольше, но "достаются" медленнее. primitive-переменные - это исключительно значения, которые не имеют собственных атрибутов и методов. Однако, в некоторых случаях может быть использован механизм оборачивания и обращения в методам посредством точки (.), например:
```javascript
'some string'.length    // 11
```

По факту, в данном случае выполняется констукция вида:
```javascript
new String('some string').length    // 11
```

Другое отличие между primitive и reference - то, как передаются объекты: в случае primitive операция присваивания формирует новый объект в памяти, в случае с reference - создается ссылка на ту же области:
```javascript
x = 42  
y = x  
x++  
console.log(x, y)   // 43, 42

x = {name: 'Sean'}  
y = x  
x.name = 'Castor'  
console.log(x, y)   // { name: 'Castor' } { name: 'Castor' }
```

primitive-объекты неизменяемы. При попытке изменения формируется новый объект. Для проверки типа можно использовать функцию typeof, для reference-переменных всегда будт возвращаться значение object:
```javascript
typeof ('some string')   // 'string'  
typeof new String('some string')    // 'object'
```

Также функцию typeof **необходимо** использовать для проверки существования переменной:
```javascript
> typeof notDefined === 'undefined'  
true
```

Для более точной информации о типе reference-объекта можно воспользоваться одной из следующих опций:
```javascript
today = new Date()  
today.constructor.name  // 'Date'
today instanceof Date   // true
Date.prororype.isPrototypeOf(today) // true
```

### Строки и шаблонные литералы
В JS строки можно объявлять как с помощью одинарных (''), так и с помощь двойных ("") кавычек. С точки зрения исполнения кода это почти ни на что не влияет. При появлении кавычки в тексте её нужно зкранировать:
```javascript
let singlequotes = 'This prompts Alice to exclaim: "Well! I\'ve often seen a cat without a grin, but a grin without a cat! It\'s the most curious thing I ever saw in my life!"' 
let doublequotes = "This prompts Alice to exclaim: \"Well! I've often seen a cat without a grin, but a grin without a cat! It's the most curious thing I ever saw in my life!\""
console.log(singlequotes);  // This prompts Alice to exclaim: "Well! I've often seen a cat without a grin, but a grin without a cat! It's the most curious thing I ever saw in my life!"
console.log(doublequotes);  // This prompts Alice to exclaim: "Well! I've often seen a cat without a grin, but a grin without a cat! It's the most curious thing I ever saw in my life!"
```
Для того, чтобы создать многострочную запись, необходимо использовать символ переноса строки. Для того, чтобы запись отображалась многострочной не только в выводе, но и в редакторе, можно воспользоваться конкатенацией:
```javascript
let multiline = 'old pond\n' + 
            'frog leaps in\n' + 
            'water\'s sound';
console.log(multiline); // old pond
                        // frog leaps in
                        // water's sound
// Без символа перевона строки вывод сольется в одну строку
multiline = 'old pond' + 
            'frog leaps in' + 
            'water\'s sound';
console.log(multiline); // old pondfrog leaps inwater's sound
```
Конкатенация также используется для вывода переменных в строку:
```javascript
let answer = 42;
console.log('The Answer to the Ultimate Question of Life, the Universe, and Everything is ' + answer);  // The Answer to the Ultimate Question of Life, the Universe, and Everything is 42
```
Помимо стандартных кавычек, в JS также используются обратные (``). Они решают часть проблем + привносят новый функционал шаблонных литералов:
```javascript
// Уменьшает необходимость экранирования из-за менее частого использования обратных кавычек:
let backqoutes = `This prompts Alice to exclaim: "Well! I've often seen a cat without a grin, but a grin without a cat! It's the most curious thing I ever saw in my life!"`
console.log(backqoutes);    // This prompts Alice to exclaim: "Well! I've often seen a cat without a grin, but a grin without a cat! It's the most curious thing I ever saw in my life!"

// Упрощает работу с многострочными записями:
multiline = `old pond
frog leaps in
water's sound`;
console.log(multiline); // old pond
                        // frog leaps in
                        // water's sound
// Однако, следует учитывать, что при использовании обратных кавычек все символы будут выводиться на экран:
multiline = `Two strings
             with some spaces`
console.log(multiline); // Two strings
                        //              with some spaces
```
Начиная с версии ES6, в JS появился функционал интерполяции выражений. Для этого в строку внедряются "местозаполнители" (${}), при этом весь код в фигурных скобках выполяется как обычный JS-код. Интерполяцию удобно использовать для динамеческого созданию запросов:
```javascript
const type = 'people';
const num = 1;
const requestUrl = `https://swapi.dev/api/${type}/${num}/`;
console.log(requestUrl);    // https://swapi.dev/api/people/1/

let a = 100;
let b = 9;
console.log(`Sum of ${a} and ${b} is ${a + b}`);    // Sum of 100 and 9 is 109
console.log(`A is ${ a > b ? 'greater' : 'less' } then b`); // A is greater then b
```
#### Теговые шаблоны
Теговые шаблоны - это развитие идее шаблонных литералов, которое позволяет выполнять более сложные операции над текстом:
```javascript
// Синтаксис
function tag(strings, ...expressions) {
    console.log(strings);
    console.log(expressions);
}
tag`This is a test string with parameters: ${'one'}, ${2} and ${7-4}`;  
// [ 'This is a test string with parameters: ', ', ', ' and ', '' ]
// [ 'one', 2, 3 ]

// Пример: 
const foo = (styles) => {
    return (
        `< Button style={{${styles}}} />`
    )
}
foo("color:'red'"); // "< Button style={{color:'red'}} />"

function button(styles, ...expressions) {
    return (
        `< Button style={{${styles}}} />`
    )
}
button`color:'red'`; // "< Button style={{color:'red'}} />"
```

## Синтаксис

В JS используются блоки кода, коды обрамляются фигурными скобками:
```javascript
function foo(text)
{  
    console.log(text)
}  
```
## Переменные
Следующий синтаксис выполняет одинаковый функционал:
```javascript
function talk () {
    console.log('Hey!');
}
talk(); // 'Hey!'

let talk = function () {
    console.log('Hey!');
}
talk(); // 'Hey!'
```

### Связывание (Bind)
```javascript
function talk() {
    console.log(this.sound);
}
talk(); // undefined

let dog = {
    bark: talk,
    sound: 'woof'
}

dog.bark(); // 'woof'
```
В данном случае объект dog.bark и talk - одна и та же функция. 
```javascript
let talkDog = dog.bark;
talkDog();  // undefined, так как снова вызывается функция talk, для которой this является глобальным объектом, а не dog
```
Можно записать функцию иначе, используют bind:
```javascript
let dog = {
    sound: 'woof'
}
dog.bark = talk.bind(dog);
dog.bark(); // 'woof'

let talkDog = dog.bark;
talkDog();  // 'woof'
```
bind создает новую функцию, привязывая контекст к функции (тем самым, фиксируя this).
Пример со сложной логикой:
```javascript
function talk () {
    console.log(this.sound);
}

let dog = {
    bark: talk,
    sound: 'woof'
}

let cat = {
    touch: dog.bark,
    sound: 'meow'
}

cat.touch();    // meow
```
В данном примере метод touch объекта cat ссылается на метод bark объекта dog, который, в свою очередь, ссылается на функцию talk. Функция talk выводит в консоль атрибут sound текущего контекста, которым является (та-дам) cat.

## Функции
### Использование this
Обычные функции и стрелочные отличаются использованием внутреннего оператора this: в обычных функциях объект this определяется в момент вызова функции, в стрелочных - в момент создания. Например:
``` javascript
// 1
function ordinaryFunc() {
    console.log(this);
}
const arrowFunc = () => {
    console.log(this);
}
ordinaryFunc(); // undefined
arrowFunc();    // undefined

// 2
const dog = {
    sound:'roar',
    ordinaryFunc,
    arrowFunc
}
dog.ordinaryFunc(); // { sound:'roar', ... }
dog.arrowFunc();    // undefined
```
В первом случае обе функции работают с глобальным окружением, во втором - с объектом.


## Сахар
### "Изъятие" объектов (object destructing)
Способ изъятия (де-структурирования) одного объекта из другого путем обращения к его имени:
``` javascript
let {some, thing} = {some:'one', any:'two', thing:'three'};
console.log(some, thing);   // one three
```
### Условное выполнение
В качестве альтернатиры структуре if-else можно использовать выполнение кода при выполнении условия и оператора &&:
``` javascript
const isDog = (animal) => animal.type === 'dog';
const animal = {name:'Einstein', type:'dog', sound:'!fooW'};
const animal2 = {name:'Tom', type:'cat', sound:'Oh-no-no-no!'};
isDog(animal) && console.log(animal.sound);  // !fooW
isDog(animal2) && console.log(animal2.sound);  // false
```

### Spread
Синтаксический оператор spread (в коде обозначается как ...) используется для "раскрытия" списков:
``` javascript
var midArray = [3,4]
var fullArray = [1,2, midArray, 5, 6]
console.log(fullArray)  // [ 1, 2, [ 3, 4 ], 5, 6 ]
// или
fullArray = [1,2, ...midArray, 5, 6]
console.log(fullArray) // [ 1, 2, 3, 4, 5, 6 ]
```
Оператор удобно использовать для:
* Передачи аргументов в функцию:
``` javascript
Math.max([1,2,3,4,5,6,7]);   // NaN
Math.max(...[1,2,3,4,5,6,7]);    // 7
// или
const myMean = (...someArray) => someArray.reduce((sum, n) => sum + n, 0)/someArray.length;
myMean(1,2,3,4,5,6,7)   // 4
```
* Копирования списков:
``` javascript
var firstArray = [1,2,3];
var secondArray = firstArray;
firstArray[1] = 9;
console.log(secondArray);   // [1,9,3]
// Массив изменился, так как при объявлении переменной была создана только ссылка, а не копия. Вместо этого нужно воспользоваться оператором spread:
var thirdArray = [...firstArray]
firstArray[2] = 7;
console.log(thirdArray);    // [1,9,3]
```
* Преобразования строки в массив:
``` javascript
console.log([...'Hello!']);    // [ 'H', 'e', 'l', 'l', 'o', '!' ]
```
* Объединения списков/объектов:
``` javascript
console.log([...firstArray, ...thirdArray]);    // [ 1, 9, 7, 1, 9, 3 ]
// или
var obj1 = {name:'Buster1', weight:88};
var obj2 = {name:'Buster1', type:'full body'};
console.log({...obj1, ...obj2});    // { name: 'Buster1', weight: 88, type: 'full body' }
```
Последним функционалом удобно пользоваться для "реорганизации" объектов:
``` javascript
// Добавление свойств:
const buster = {...obj1, color:'red', age:'to old for this sh*t'};
console.log(buster); // { name: 'Buster1', weight: 88, color: 'red', age: 'to old for this sh*t' }

// Удаление свойств:
const delColor = ({color, ...someObj}) => someObj;
delColor(buster);   // { name: 'Buster1', weight: 88, age: 'to old for this sh*t' }

// Динамическое удаление свойств:
const delProp = prop => ({[prop]:undefined, ...someObj}) => someObj;
delProp('name')(buster)    // { weight: 88, color: 'red', age: 'to old for this sh*t' }

// Сортировка свойств:
const reorganize = someObj => ({age: 0, ...someObj});
console.log(reorganize(buster));    // { age: 'to old for this sh*t', name: 'Buster1', weight: 88, color: 'red',  }

// Переименование свойств:
const renameProp = ({name, ...someObj}) => ({occupancy:name, ...someObj});
renameProp(buster); // { occupancy: 'Buster1', weight: 88, color: 'red', age: 'to old for this sh*t' }
```

### Template literals
Шаблонные литералы удобно использовать для вывода в тексте какой-то логики:
``` javascript
const faceControl = (person) => {
    console.log(`${person.age>18 ? 'Добро пожаловать,' : 'Ещё рановато,'} ${person.name}!`)
}
teenager1 = {name:'Славик', age:16};
faceControl(teenager1); // Ещё рановато, Славик!
```

### Разное
async - помечает функцию как асинхронную.  
await - тормозит выполнение до момента появления результатов