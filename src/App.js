import React, { useEffect, useState } from 'react';

import './App.css';

function App() {

  const [info, setInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState('');
  let [edit, setEdit] = useState("");
  const [editItemId, setEditItemId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [checkedBoxes, setCheckBoxes] = useState([]);
  const [allCheckBoxes, setAllcheckBoxes] = useState(false);
  const [clicked, setClicked] = useState("")

  useEffect(() => {
    fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
    .then((res) =>{
      if(res.ok) {
        return res.json();
      }
      throw res;
    })
    .then((data) => {
      setInfo(data);
    })
  }, [])
  const itemsPerPage = 10;
  const totalPages = Math.ceil(info.length/itemsPerPage)

   function updateInput(evt) {
    setInput(evt.target.value);
     const filtered = info.filter(items => {
      return items.name.toLowerCase().includes(input.toLowerCase());
     })   
     setInfo(filtered);
    
  }

  const editHandler = (evt) => {
    setEdit(evt.target.value);
     }

  const deleteHandler =(idx) => {
    const newInfo = info.filter((item) => item.id !== idx )
    setInfo(newInfo);
  }

  const deleteAllHandler = (items) => {

    for(let i=0; i<items.length; i++) {
      setInfo((prev) => prev.filter((item) => item.id !== items[i]))
      }
      
      setCheckBoxes([]);
      setAllcheckBoxes(false)
    }
   

  const toggleCheckbox = (e, item) => {		
    if(e.target.checked) {
      let arr = checkedBoxes;
      arr.push(item.id);
      
      setCheckBoxes(arr);
    } else {			
      let items = checkedBoxes.splice(checkedBoxes.indexOf(item.id), 1);
      
      setCheckBoxes(items)
    }		
    console.log(checkedBoxes);
  }
const toggleAllCheckBoxes = (evt, currentPage) => {
  setAllcheckBoxes((prev) => !prev)
  if(evt.target.checked) {
    let arr = checkedBoxes;
    for(let i=0; i<currentPage*itemsPerPage; i++) {
      const val = i+1
      arr.push(val.toString());

    }
    setCheckBoxes(arr);
    console.log("checkedBoxes", checkedBoxes)
  }
}

const currentInfoList = info.slice((currentPage-1) * itemsPerPage, currentPage*itemsPerPage);

  return (
    <div className="App">
           <input type="text" value={input} onChange={updateInput}  placeholder="search by name email or role" style={{width : "80%"}} />
      <div style={{ padding:"10px", alignItems:"center" , display:'flex', justifyContent:"space-between", borderBottom:"1px solid black"}}>
        <input type="checkbox" checked={allCheckBoxes}  onChange={(evt) => toggleAllCheckBoxes(evt,currentPage)} />
        <b>Name</b>
        <b>Email</b>
        <b>Role</b>
        <b>Actions</b>
        </div>
        {currentInfoList.map((items) => {
          
          return(<div  key={items.name}  onClick={() => setClicked(items.id)} style={{ padding:"10px", alignItems:"center" , display:'flex', justifyContent:"space-between", borderBottom:"1px solid black" , backgroundColor : clicked === items.id ? "grey" : ""}}>
      <input type="checkbox" value={items.id}  checked={allCheckBoxes ? true  : checkedBoxes.find((p) => p.id === items.id)} onChange={(e) => toggleCheckbox(e, items)}/>         
       { editMode && editItemId === items.id  ? <> <textarea id={items.id} type="text"  placeholder={items.name} value = {edit} onChange= {editHandler} name="edit"></textarea>
          <button onClick={() => {setEditMode(false); items.name = edit}}> Save </button> </> :
          <span>{items.name}</span>
          }
          <span>{items.email}</span>
          <span>{items.role}</span>
          <div><button onClick={() => {setEditItemId(items.id); setEditMode(true)} }> Edit </button>
          <button onClick={() => deleteHandler(items.id)}> Delete </button></div>
          </div>)
        })}
        <div  style={{padding:"10px" ,display:"flex",justifyContent:"space-around"}}>
          <div>
          <button onClick={() => deleteAllHandler(checkedBoxes)} > Delete Selected </button> 
          </div>
          <div style={{margin :"10px", justifyContent:"space-between"}}>

          <button onClick={() => setCurrentPage(1)}> First</button>
          <button onClick={() => setCurrentPage((prev) => prev > 1 ? prev -1 : prev)}> prev</button>
          <button onClick={() => setCurrentPage(1)} disabled={totalPages < 1} > 1</button>
          <button onClick={() => setCurrentPage(2)} disabled={totalPages < 2} > 2</button>
          <button onClick={() => setCurrentPage(3)} disabled={totalPages < 3} >3</button>
          <button onClick={() => setCurrentPage(4)} disabled={totalPages < 4} > 4</button>
          <button onClick={() => setCurrentPage(5)} disabled={totalPages < 5} > 5 </button>
          <button onClick={() => setCurrentPage((prev) => prev < 5 ? prev + 1 : prev)}> Next</button>
          <button onClick={() => setCurrentPage(5)}> Last </button>
          </div>
        </div>
    </div>
  );
}

export default App;
