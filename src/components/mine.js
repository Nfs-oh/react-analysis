const React = window.React;

const fn = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(100);
    }, 1000);
  })
}

const Mine = () => {
  React.useEffect(async () => {
    console.log('123 mine');
    // await fn();
    return () => {
      console.log('mine remove')
    }
  }, []);

  console.log('mine')
  return (<div>mine</div>)
}

export default Mine;