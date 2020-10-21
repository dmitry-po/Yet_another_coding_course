# React Native
## Содержание
1. [Hooks](#Hooks)  
1.1 [useState](#useState)  
1.2 [useRef](#useRef)  
1.3 [useCallback](#useCallback)  
1.4 [useMemo](#useMemo)  
1.5 [useContext](#useContext)  
1.6. [useReducer](#useReducer)  
1.7. [useEffect](#useEffect)
2. [Полезные ссылки](#Полезные-ссылки)

## Hooks
### useState
useState, возможно, один из самых часто используемых хуков. Позволяет хранить переменную и вызывать повторный рендеринг при изменении значения. Хук useState принимает на вход начальное состояние переменной (может быть задано любым значением: целое, вещественное число, строка, ...) и возвращает 2 объекта списком: саму переменную (текущее состояние) и функцию для изменения значения:
```javascript
import { useState } from 'react';

const App = () => {
    const [light, setLight] = useState(0);

    const setOff = () => setLight(0);
    const setOn = () => setLight(1);

    let status = light === 1 ? 'on' : 'off';

    return (
        <>
            <p>Light is {status}</p>
            <button onClick={setOff}>Turn off</button>
            &nbsp;
            <button onClick={setOn}>Turn on</button>
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
Хук useContext нацелен на упрощение работы с параметрами. Базовый метод (**prop drilling**) предполагает прямую передачу параметров от родителя к потомку. Это простой и понятный механизм, но, в случае многослойной структуры, такой подход может потребовать "протаскивать" параметры через несколько уровней (отсюда и название).  
Альтернативный подход предполагает использование общей среды (или контекста, отсюда название **context**), к которому могут обращаться объекты, даже если они не состоят в "родственных" связях. Контекстный объект создаются с помощью инструкции createContext() и состоит из 2 элементов: поставщик (provider) и потребитель (consumer):
```javascript
import React, { useContext } from 'react';
const textContext = React.createContext();
```
Хук useContext принимает на вход контекстный объект (*textContext* в нашем случае) и возвращает все переменные, которые были "открыты" поставщиком (provider) для данного компонента:
```javascript
// Продолжая прошлый пример
const NamePrinter = () => {
    const name = useContext(textContext);
    return (
        <div>Hello, {name}</div>
    );
}
```
Для того, чтобы у компонента NamePrinter был доступ к переменной *name*, необходимо "обернуть" его в поставщика данных (provider). В примере ниже компонент NamePrinter (а также все потомки) будет иметь доступ к переменной name, хотя переменная не передаётся как параметр в явном виде:
```javascript
// Продолжая прошлый пример
const App = () => {
    const { Provider } = textContext;
    const name = 'Johny';

    return (
        <Provider value={name}>
            <NamePrinter />
        </Provider>
    );
};
```
В реальных (больших) проектах, создание контекстного объекта рекомендуется выносить в отдельный файл и обращаться к нему в нужных модулях:
```javascript
// Файл context.js:
const textContext = React.createContext();
export { textContext };

// Файл App.js (и все сопутствующие):
import { textContext } from './context.js';
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
import { useReduser } from 'react';

// Начальное состояние
const initialState = [
    { 
        name: 'Bedroom_lamp',
        color: '#FEF7EF',
        isOn: false
    },
    { 
        name: 'Table_lamp',
        color: '#F0FAFF',
        isOn: true
    },
]

// Reducer
const reducer = (state, action) => {
    switch(action.type) {
        case 'off':
            return state.map(lamp => {
                if (lamp.name === action.payload) lamp.isOn = false;
                return lamp
            });
        case 'on':
            return state.map(lamp => {
                if (lamp.name === action.payload) lamp.isOn = true;
                return lamp
            });
        default:
            return state
    }
} 

// Основная часть
const LampManager = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const turnOffLamp = name => dispatch({ type: 'off', payload: name });
    const turnOnLamp = name => dispatch({ type: 'on', payload: name });

    return (
        <>
            <h3>Available lamps</h3>
            <table><tr>
                {state.map(lamp => (
                    <td>
                        <div>Name: {lamp.name}</div>
                        <div>Status: lamp is {lamp.isOn ? "on" : "off"}</div>
                        {lamp.isOn ? (
                            <button onClick={() => turnOffLamp(lamp.name)}>Turn off</button>
                        ) : (
                            <button onClick={() => turnOnLamp(lamp.name)}>Turn on</button>
                        )}
                    </td>
                ))}
            </tr></table>
        </>

    )
}
```
useReducer рекомендуется использовать в случаях, когда требуется реализовать "сложную" логику или когда процесс обновления затрагивает сразу несколько переменных состояния.

### useEffect
Хук useEffect используется для выполнения т.н. side эффектов. Побочными эффектами могут быть обращения к API, сложная обработка. В примере ниже идет обращение по API к справочнику героев саги "Звездные Войны", которое выполняется независимо от рендеринга всего приложения. В момент, когда данные загружаются, с помощью хука useState происходит обновление массива данных, что вызывает повторный рендеринг уже с полученными данными. useEffect принимает на вход функцию (которая выполняет основную нагрузку) и список переменных, изменение которых запускает указанную функцию (список переменных не обязательный параметр, но его отсутствие повлечет постоянное обновление -  в примере ниже указан пустой список, чтобы обновление выполнилось только один раз):
```javascript
import { useEffect } from 'react';

const App = () => {
    const [names, setNames] = useState([]);

    useEffect(() => {
        fetch('https://swapi.dev/api/people/')
        .then(responce => responce.json())
        .then(data => setNames(data['results']))
    }, []);

    return (
        <>
            <h3>Star Wars characters</h3>
            <table>
                <tr>
                    <td><b>Name</b></td>
                    <td><b>Gender</b></td>
                    <td><b>Height</b></td>
                    <td><b>Mass</b></td>
                </tr>
                {names.map((person) => (
                    <tr>
                        <td>{person.name}</td>
                        <td>{person.gender}</td>
                        <td>{person.height}</td>
                        <td>{person.mass}</td>
                    </tr>
                ))}
            </table>
        </>
    );
}
```

## Полезные ссылки:
1. ["Demystifying React Hooks Series"](https://dev.to/milu_franz/series/7304) - цикл обзорных статей про хуки [useCallback и useMemo](https://dev.to/milu_franz/demystifying-react-hooks-usecallback-and-usememo-1a8j), [useRef](https://dev.to/milu_franz/demystifying-react-hooks-useref-2ddp), [useContext](https://dev.to/milu_franz/demystifying-react-hooks-usecontext-5g4a) и [useReducer](https://dev.to/milu_franz/demystifying-react-hooks-usereducer-3o3n);
2. ["Введение в React Hooks"](https://habr.com/ru/post/429712/) - статья про хуки useState, useEffect, useContext, useRef и пользовательские хуки.
