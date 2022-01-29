import Mine from './mine';

const React = window.React;


const About = () => {
  console.log('about已经被调用')
  const list = React.useMemo(() => [{a: 'a'}, {b: 'b'}], []);
  // debugger;
  const [ num ,setNumber ] = React.useState(0)
  const [ count ,setCount ] = React.useState(0)
  const [showMine, setShowMine] = React.useState(true);
  const handlerClick=(e)=>{
    // for(let i=0; i<5;i++ ){
    //     // setTimeout(() => {
    //         setNumber({value: num.value + 1})
    //         console.log(num.value)
    //     // }, 1000)
    // }
    // e.preventDefault();
    // e.stopPropagation();
    // console.log(num, 'num')
    // setNumber(1)
    // console.log(num, 'num')
    // setNumber(2)
    // console.log(num, 'num')

    // setShowMine(false);

    setNumber(2);
    setCount(2)
  }

  const effect1 = React.useEffect(() => {
    console.log('123 effect num, count, showMine')
  }, [num, count, showMine])

  React.useEffect(() => {
    console.log('456 effect')
  }, []);

  console.log(effect1, 'effect1')

  return (
    <div style={{width: 200, height: 200, backgroundColor: 'yellow'}}>
      <span>about</span>
      <button onClick={handlerClick}>{num}</button>
      {/* {showMine && <Mine />} */}
    </div>
  )
}

// const Component = React.memo(About);

// console.log(Component)

export default About;