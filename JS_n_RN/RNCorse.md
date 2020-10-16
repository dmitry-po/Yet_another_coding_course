# React Native
## Hooks
### useState
useState, возможно, один из самых часто используемых хуков. Позволяет хранить переменную и вызывать повторный рендеринг при изменении значения.

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
const textContext = createContext();
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


## Полезные ссылки:
1. https://dev.to/milu_franz/series/7304
