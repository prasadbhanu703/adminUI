import React , {useState, useEffect} from 'react';
import Icon from 'react-crud-icons';

const HomePage = (props) => {

    const [info, setInfo] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [input, setInput] = useState('');
    const [edit, setEdit] = useState('');
    const [editItemId, setEditItemId] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [checkedBoxes, setCheckBoxes] = useState([]);
    const [allCheckBoxes, setAllcheckBoxes] = useState(false);
    const [clicked, setClicked] = useState("");

    const itemsPerPage = 10;
    const totalPages = Math.ceil(info.length/itemsPerPage);

    console.log("allCheckBoxes", props.globalValue  )

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
      },[])

      useEffect(() => {
          setFilteredInfo(info);
      },[info])

      const updateInput = (evt) => {
        setInput(evt.target.value);  
        
        setFilteredInfo( info.filter(items => 
             (items.name && items.name.toLowerCase().includes(input.toLowerCase())) || items.email.toLowerCase().includes(input.toLowerCase()) || items.role.toLowerCase().includes(input.toLowerCase())
            )
        )
        console.log("filterd array", filteredInfo)
      }
    
      const editHandler = (evt) => {
        setEdit(evt.target.value);
         }
    
      const deleteHandler =(idx) => {
        const newInfo = info.filter((item) => item.id !== idx )
        setInfo(newInfo);
        setFilteredInfo(newInfo)
      }
    
      const deleteAllHandler = (items) => {
    
        for(let i=(currentPage-1) * itemsPerPage; i<items.length; i++) {
          setInfo((prev) => prev.filter((item) => item.id !== items[i]))
          }
        setFilteredInfo(info);          
          setCheckBoxes([]);
          setAllcheckBoxes(false)
        }
       
    
      const toggleCheckbox = (e, item) => {		
        let arr = checkedBoxes;
        if(e.target.checked) {
          arr.push(item.id);
          setCheckBoxes(arr);
        } 
        else{
          arr.pop(item.id);
          setCheckBoxes(arr);
        }
        
        console.log(checkedBoxes);
      }

    const toggleAllCheckBoxes = (evt, currentPage) => {

      setAllcheckBoxes((prev) => !prev)
      if(evt.target.checked) {
        let arr = checkedBoxes;
        for(let i=(currentPage-1) * itemsPerPage; i<currentPage*itemsPerPage; i++) {
          const val = i+1
          arr.push(val.toString()); 
        }
        setCheckBoxes(arr);
        console.log("checkedBoxes", checkedBoxes)
      }
      else {   
        setCheckBoxes([])
      }
    }

    const currentInfoList = filteredInfo.slice((currentPage-1) * itemsPerPage, currentPage*itemsPerPage);

    const list = [];

    for (let i = 1; i <= totalPages ; i++) {
        list.push( <button key={i+1} style ={ { margin:"10px"}} onClick={() => setCurrentPage(i)} disabled={totalPages < i} > {i} </button> )
    }
    
    return (
        <div>
        <input type="text" value={input} onChange={updateInput}  placeholder="search by name email or role" style={{margin:"10px", width : "80%"}} />

      <div value={props.globalValue} className="webPageStyling">
        <input type="checkbox" value={props.globalValue} checked={allCheckBoxes}  onChange={(evt) => toggleAllCheckBoxes(evt,currentPage)} />
        <div> <b>Name</b></div>
        <div><b>Email</b></div>
        <div><b>Role</b></div>
        <div><b>Actions</b></div>
        </div>
        {currentInfoList.map((items) => {
          return(<div  key={items.name}  onClick={() => setClicked(items.id)} className="webPageStyling" style={{ backgroundColor : clicked === items.id ? "grey" : ""}}>
      <input type="checkbox" value={items.checked}  checked={allCheckBoxes || checkedBoxes.find((p) => p.id === items.id)} onChange={(e) => toggleCheckbox(e, items)}/>         
       { editMode && editItemId === items.id  ? <> <textarea id={items.id} type="text"  placeholder={items.name} value = {edit} onChange= {editHandler} name="edit"></textarea>
          <button className="buttonsStyling" onClick={() => {setEditMode(false); items.name = edit}}> Save </button> </> :
          <div>{items.name}</div>
          }
          <div>{items.email}</div>
          <div>{items.role}</div>
          <div style={{display:"flex", justifyContent:"unset"}}>
              <div style={{height:"30px", width:"30px"}}><Icon name="edit" onClick={() => {setEditItemId(items.id); setEditMode(true)}}/></div>
             <div style={{height:"30px", width:"30px"}}><Icon name="delete" onClick={() => deleteHandler(items.id)}/></div>
          </div>
          </div>)
        })}
        <div className="lowerButtonsStyling">
          <div>
          <button style={{borderRadius:"15px", color:"white", backgroundColor:"red"}} onClick={() => deleteAllHandler(checkedBoxes)} > Delete Selected </button> 
          </div>
          <div style={{margin :"10px"}}>

          <button style={{margin :"10px"}} onClick={() => setCurrentPage(1)} disabled={currentPage === 1}> First</button>
          <button style={{margin :"10px"}} onClick={() => setCurrentPage((prev) => prev > 1 ? prev -1 : prev)}> prev </button>
            {list}
          <button style={{margin :"10px"}} onClick={() => setCurrentPage((prev) => prev < totalPages ? prev + 1 : prev)}> Next </button>
          <button style={{margin :"10px"}} onClick={() => setCurrentPage(totalPages)}> Last </button>
          </div>
        </div>
        </div>
    )

}

export default HomePage;