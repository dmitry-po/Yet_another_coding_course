# React Native
## Содержание
1. [Hooks](#Hooks)  
1.1 [useState](#useState)  
1.2 [useRef](#useRef)  
1.3 [useCallback](#useCallback)  
1.4 [useMemo](#useMemo)  
1.5 [useContext](#useContext)  
1.6. [useReducer](#useReducer)  
2. [Полезные ссылки](#Полезные-ссылки)

## Hooks
### useState
useState, возможно, один из самых часто используемых хуков. Позволяет хранить переменную и вызывать повторный рендеринг при изменении значения. Хук useState принимает на вход начальное состояние переменной (может быть задано любым значением: целое, вещественное число, строка, ...) и возвращает 2 объекта списком: саму переменную (текущее состояние) и функцию для изменения значения:
```javascript
const App() => {
    const [light, setLight] = useState(0);

    const setOff = () => setLight(0);
    const setOn = () => setLight(1);

    let status = light === 1 ? 'включен' : 'выключен';

    return (
        <>
            <p>Свет {status}</p>
            <button onClick={setOff}>Выключить</button>
            <button onClick={setOn}>Включить</button>
        </>
    );
}
```
После выполнения функции *setLight*, React запоминает, что значении переменной *light* было изменено и будет использовать это новое значение при следующем рендеринге.  
В рамках одного приложения может использовать более одной переменной состояния, вызывая каждый раз конструкцию UseState(). Однако, как и все прочиее хуки, useState можно использовать только на верзнем уровне функции.

### useRef
useRef - почти "антипод" useState: он тоже позволяет хранить значение, но при изменении не вызывает повторный рендеринг. Другими словами, useRef позволяет вынести переменную за пределы рендеринга и хранить значение независимо от обновлений. 
```javascript
import { useRef } from 'react';
const chosenValue = useRef('Neo');
console.log(chosenValue.current);   // Neo
```
Исходное значение пременной объявляется при инициации и записывается в атрибут current.  
useRef может быть использована для фокусировки на объекте (chosenValue.current.focus()) или для хранения предыдущего значения другой переменной, например. Использовать useRef необходимо, когда изменение значения считается побочным эффектом (side effect).

### useCallback
```javascript
import { useState, useCallback } from 'react'
const add = (first, second) => first+second:

const [firstVal, setFirstVal] = useState(0);
const increase = () => setFirstVal(num => num + 1);

const [secondVal, setSecondVal] = useState(10);
const decrease = () => setSecondVal(num => num -1);

const [extraVal, setExtraVal] = useState(42);
const modifyExtra = () => setExtraVal(num => -num);

const additionResult = useCallback(add(firstVal, secondVal), [firstVal, secondVal]);
```
При ре-рендеринге React создают новую копию каждого объекта (в т.ч. функций, так как они воспринимаются как объекты в JS). useCallback используется для того, чтобы уменьшить количество повторных рендерингов для функций, который не изменялись. В примере выше переменная *additionResult* зависит только от *firstVal* и *secondVal*, но не *extraVal*, поэтому повторное создание функции необходимо только при изменении одной из зависимых переенных. Хук принимает на вход 2 параметра: функцию и массив зависимых переменных, при изменении которых будет выполняться повторный рендеринг указанной функции.

### useMemo
Хук useMemo очень близок к useState, но в отличие от последнего, он возвращает не функцию, а значение. Иными словами, useMemo вызывает указанную функцию, когда зависимая переменная меняется, или возвращает значение из кэша.
```javascript
// Продолжая предыдущий пример
const additionalResult = useMemo((firstVal, secondVal) => add(firstVal, secondVal), [firstVal, secondVal])
```
Фактически, useCallback и useMemo - взаимозаменяемы. Они выполняют аналогичные действия, но по-разному возращают результат. Используются они, преимущественно, для оптимизации, чтобы "обернуть" тяжелые запросы.

### useContext
Прежде чем разбираться с хуком useContext, следует вспонмить/узнать, что в React используется 2 основных способа передачи параметров между родителем и потомками: **prop drilling** и **context**. В первом случае параметры последовательно передаются от родителя потомку. В случае многослойной структуры, такой подход может потребовать "протаскивать" параметры через несколько уровней (отсюда и название).  
Альтернативный подход предполагает использование общей среды (контекста), к которому могут обращаться объекты, даже если они не состоят в "родственных" связях. Контекстный объект создаются с помощью инструкции createContext() и состоит из 2 элементов: поставщик (provider) и потребитель (consumer).
```javascript
import React from 'react';
const textContext = React.createContext();
const [ Provider, Consumer ] = textContext;
```
Поставщик (provider) должен оборачивать все элементы, в которых необходимо обеспечить доступ к общим переменным. В примере ниже компонеты NameModifier и NamePrinter (а также все потомки) будут иметь доступ к переменной name, хотя переменная не передаётся в них как параметр в явном виде:
```javascript
// Продолжая прошлый пример
const App = () => {
    const { Provider } = textContext;
    const [name, setName] = useState('Johny');

    return (
        <Provider value={{name}}>
            <NameModifier />
            <NamePrinter />
        </Provider>
    );
};
```
Хук useContext принимает на вход контекстный объект (*textContext* в нашем случае) и возвращает все переменные, которые были "открыты" поставщиком (provider) для данного компонента.
```javascript
// Продолжая прошлый пример
const NameModifier = () => {
    const { name } = useContext(textContext);
    return (
        <div>Hello, {name}</div>
    );
}
```

### useReducer
Знакомство с хуком useReducer следует начать с функции **reduce**. Reducer принимает на вход список объектов (чисел, строк, ...) и возвращает один. Например:
```javascript
const num_array = [1,3,5,7,9];
const init_value = 0;
const reducer = (base, value) => base + value;
num_array.reduce(reducer, init_value);  // 25
// Расчет выполнятся как 0 + 1 = 1, 1 + 3 = 4, ..., 16 + 9 = 25
```
Хук useReducer используется в управлении состояниями. В отличие от встроенного в JS метода reduce из примера выше, в React useReducer возвращает два объекта: текущее состояние и функцию диспетчиризации (dispatch):
```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```
Похожий синтаксис имеет хук useState, за исключением того, что в useReducer на вход, помимо объекта начального состояния подается фукнция reducer, которая вызывается при использовании dispatch. Рассмотрим использование хука на слегка видоизмененном примере из раздела useState:
```javascript
// Начальное состояние
const init_state = [
    { 
        name: 'Bedroom_lamp',
        color: '#FEF7EF',
        isOn: False
    },
    { 
        name: 'Tabletop_lamp',
        color: '#F0FAFF',
        isOn: True
    },
]

// Reducer
const reducer = (state, action) => {
    switch(action.type) {
        case 'off':
            return state.map(lamp => {
                if (lamp.name === action.payload) lamp.isOn = False;
                return lamp
            });
        case 'on':
            return state.map(lamp => {
                if (lamp.name === action.payload) lamp.isOn = True;
                return lamp
            });
        default:
            return state
    }
} 
const [state, dispatch] = useReducer(reducer, initialState);

// Основная часть
const LampManager = () => {
    const [state, dispatch] = useReducer(reduser, init_state);

    const turnOffLamp = name => dispatch({ type: 'off', payload: name });
    const turnOnLamp = name => dispatch({ type: 'on', payload: name });

    return (
        <>
            <h3>Available lamps</h3>
            {state.map(lamp => {
                <div>Name: {lamp.name}</div>
                <div>Status: lamp is {lamp.isOn ? "on" : "off"}</div>
                {lamp.isOn ? (
                    <button onClick={() => turnOffLamp(lamp.name)}>Turn off</button>
                ) : (
                    <button onClick={() => turnOnLamp(lamp.name)}>Turn on</button>
                )}
            })}
        </>

    )
}
```
useReducer рекомендуется использовать в случаях, когда требуется реализовать "сложную" логику или когда процесс обновления затрагивает сразу несколько переменных состояния.

## Полезные ссылки:
1. ["Demystifying React Hooks Series"](https://dev.to/milu_franz/series/7304) - цикл обзорных статей про хуки;
2. ["Введение в React Hooks"](https://habr.com/ru/post/429712/).
