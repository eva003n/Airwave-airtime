const LoaderComponent = ({width = 24}: {width?: number}) => {
  return (
<div className="loader aspect-square w-[55px]"
 style={{width: `${width}px`}}
 >
    <div className="bar1"></div>
    <div className="bar2"></div>
    <div className="bar3"></div>
    <div className="bar4"></div>
    <div className="bar5"></div>
    <div className="bar6"></div>
    <div className="bar7"></div>
    <div className="bar8"></div>
    <div className="bar9"></div>
    <div className="bar10"></div>
    <div className="bar11"></div>
    <div className="bar12"></div>
</div>
  )
}

export default LoaderComponent;