import React, { useEffect, useState } from 'react';

import './App.css';

function App() {

  const [info, setInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState('');

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

   const updateInput =  (input) => {
    setInput(input);
     const filtered = info.filter(items => {
      return items.toString().toLowerCase().includes(input.toString().toLowerCase())
     })
     
     setInfo(filtered);
  }
 
 const Data = () => {

   const currentInfoList = info.slice((currentPage-1) * itemsPerPage, currentPage*itemsPerPage);

   const deleteHandler =(idx) => {
    const newInfo = info.filter((item) => item.id !== idx )
    setInfo(newInfo);
  }

  const editHAndler = (idx) => {

    const newInfo = info.map((item) => {
      if (item.id === idx) {
        const updatedItem = {
          ...item,
          isComplete: !item.isComplete,
        };
 
        return updatedItem;
      }
 
      return item;
    });
 
    setInfo(newInfo);

  }
   
    return (<div >
      <div style={{ padding:"10px", alignItems:"center" , display:'flex', justifyContent:"space-between", borderBottom:"1px solid black"}}>
        <input type="checkbox" />
        <b>Name</b>
        <b>Email</b>
        <b>Role</b>
        <b>Actions</b>
        </div>
        {currentInfoList.map((items,idx) => {
          return(<div  key={items.id} style={{ padding:"10px", alignItems:"center" , display:'flex', justifyContent:"space-between", borderBottom:"1px solid black"}}>
          <input type="checkbox" id={items.id} />
          <span  style={{
              textDecoration: items.isComplete
                ? 'line-through'
                : 'none',
            }}>{items.name}</span>
          <div>{items.email}</div>
          <div>{items.role}</div>
          <div><button onClick={() => {editHAndler(items.id)} }> Edit </button>
          <button onClick={() => deleteHandler(items.id)}> Delete </button></div>
          </div>)
        })}
        <div style={{padding:"10px" ,display:"flex", justifyContent : "space-between"}}>
          <button > Delete Selected </button> 
          <button onClick={() => setCurrentPage(1)}> First</button>
          <button onClick={() => setCurrentPage((prev) => prev > 1 ? prev -1 : prev)}> prev</button>
          <button onClick={() => setCurrentPage(1)}> 1</button>
          <button onClick={() => setCurrentPage(2)}> 2</button>
          <button onClick={() => setCurrentPage(3)}>3</button>
          <button onClick={() => setCurrentPage(4)}> 4</button>
          <button onClick={() => setCurrentPage(5)}> 5 </button>
          <button onClick={() => setCurrentPage((prev) => prev < 5 ? prev + 1 : prev)}> Next</button>
          <button onClick={() => setCurrentPage(5)}> Last </button>
        </div>
         </div>
    )
 }

  return (
    <div className="App">
     <input  input={input} 
       onChange={updateInput}  placeholder="search by name email or role" style={{width : "80%"}} />
     <div >
       <Data />
       </div>
       
    </div>
  );
}

export default App;
