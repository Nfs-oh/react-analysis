import About from './components/about';

const React = window.React;

const { createContext } = React;

const ThemeContext = createContext(123);


class App extends React.Component {
  constructor(props) {
    super(props)
    console.log('app已经被初始化')
  }
  state = {
    value: 1,
    number: 0,
  };

  componentDidMount() {
    // setTimeout(() => {
    //   console.log(this.state.value);
    //   this.setState({value: this.state.value + 1})
    //   console.log(this.state.value);
    // }, 1000);
  }

  handleClick = () => {
    // console.log(this.state.value);
    // this.setState({value: this.state.value + 1})
    // console.log(this.state.value);
    // setTimeout(() => {
    //   console.log(this.state.value);
      this.setState({value: this.state.value})
    //   console.log(this.state.value);
    // }, 0);
    // for(let i = 0 ;i<5;i++){
    //   setTimeout(()=>{
    //       this.setState({ number:this.state.number+1 })
    //       console.log(this.state.number)
    //   },1000)
    // }
    console.log(this, 'this');
  }

  handleScroll = () => {
    console.log(this.state.value);
    this.setState({value: this.state.value + 1})
    console.log(this.state.value);
  }

  render() {
    console.log('========')
    return (
      <div onClick={this.handleClick} className="App">
        <About />
      </div>
    );
  }
}


// const MemoApp = React.memo(App);


export default App;
