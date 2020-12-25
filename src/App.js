const React = window.React;

const { createContext } = React;

const ThemeContext = createContext(123);

console.log(ThemeContext, 'ThemeContext')


function App() {
  const [value, setValue] = React.useState('1');
  return (
    <div className="App">
      123
    </div>
  );
}

const MemoApp = window.React.memo(App);

console.log(React.createElement(MemoApp, { a: 'a'}))

export default App;
