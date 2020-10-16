function Person (saying) {
    this.saying = saying
}

Person.prototype.talk = function () {
    console.log('Simon says: ', this.saying)
}

var sjackson = new Person('Mothef...')
sjackson.talk();

// re-creating "new" function

function newnew (constructor) {
    var obj = {}    // Создание нового объекта
    Object.setPrototypeOf(obj, constructor.prototype)   // привязывание прототипа
    var argsArray = Array.from(arguments)   // получение агрументов
    var ret = constructor.apply(obj, argsArray.slice(1))    // вызов функции с параметрами
    return ret || obj
}

var samuelj = newnew(Person, 'Mothef...')
samuelj.talk();