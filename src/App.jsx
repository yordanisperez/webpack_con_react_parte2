import react,{useState} from 'react'
import css from  './index.scss' 
import logo from './LogoPalomaOpt.svg'


const App=()=>{
    const [name,setName]=useState('');
    function handleOnchange(e){
        setName(e.target.value);
    }
    return <div>
        <h1><img src={logo} width="75" alt= "SportFly Logo"></img>Un server de desarrollo </h1>
        <label htmlFor="name">Nombre:</label>
        <label> Este es otra  prueba  <label htmlFor=""></label></label>
        <input 
            id="name" 
            type="text" 
            value={name} 
            onChange={handleOnchange}
            />

    </div>
}

export default App;