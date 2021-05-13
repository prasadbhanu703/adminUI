import React, { useState, useEffect } from "react";
import Icon from "react-crud-icons";
import Pagination from "./Pagination";

const HomePage = (props) => {
  const [info, setInfo] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState("");

  const [edit, setEdit] = useState("");
  const [editItemId, setEditItemId] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [checkedBoxes, setCheckBoxes] = useState([]);
  const [allCheckBoxes, setAllcheckBoxes] = useState(false);
  const [clicked, setClicked] = useState("");

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredInfo.length / itemsPerPage);
  const leftElements = filteredInfo.length % itemsPerPage;

  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        setInfo(data);
      });
  }, []);

  useEffect(() => {
    setFilteredInfo(info);
  }, [info]);

  useEffect(() => {
    setAllcheckBoxes(false);
  }, [currentPage]);

  const updateInput = (evt) => {
    setInput(evt.target.value);

    setFilteredInfo(
      info.filter(
        (items) =>
          (
          items.name.toLowerCase().includes(input.toLowerCase())) ||
          items.email.toLowerCase().includes(input.toLowerCase()) ||
          items.role.toLowerCase().includes(input.toLowerCase())
      )
    );
  };

  const editHandler = (evt) => {
    setEdit(evt.target.value);
  };

  const deleteHandler = (idx) => {
    const newInfo = info.filter((item) => item.id !== idx);
    setInfo(newInfo);
    setFilteredInfo(newInfo);
  };

  const deleteAllHandler = (items) => {
    if (items.length > 1) {
      info.splice(items[0], currentPage === totalPages ? leftElements : 10);
    }

    setInfo(info);
    setFilteredInfo(info);
    setCheckBoxes([]);
    setAllcheckBoxes(false);
  };

  const toggleCheckbox = (e, item) => {
    let arr = checkedBoxes;
    if (e.target.checked) {
      arr.push(item.id);
      setCheckBoxes(arr);
    } else {
      arr.pop(item.id);
      setCheckBoxes(arr);
    }
  };

  const toggleAllCheckBoxes = (evt, currentPage) => {
    setAllcheckBoxes((prev) => !prev);
    let arr = checkedBoxes;
    if (evt.target.checked) {
      for ( let i = 0; i < (currentPage === totalPages ? leftElements : 10); i++ ) {
        const val = i + (currentPage - 1) * itemsPerPage;
        arr.push(val.toString());
      }
      setCheckBoxes(arr);
    } else {
      for (let i = 0; i < (currentPage === totalPages ? leftElements : 10); i++) {
        const val = i;
        arr.pop(val.toString());
      }
      setCheckBoxes([]);
    }
  };

  const currentInfoList = filteredInfo.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <input type="text" value={input} onChange={updateInput}
        placeholder="search by name email or role"
        style={{ margin: "10px", width: "80%" }}
      />

      <div value={props.globalValue} className="webPageStyling">
        <input
          type="checkbox"
          value={allCheckBoxes}
          checked={allCheckBoxes}
          onChange={(evt) => toggleAllCheckBoxes(evt, currentPage)}
        />
        <div> <b>Name</b> </div>
        <div> <b>Email</b> </div>
        <div> <b>Role</b> </div>
        <div> <b>Actions</b> </div>
      </div>
      {currentInfoList.map((items) => {
        return (
          <div
            key={items.name}
            onClick={() => setClicked(items.id)}
            className="webPageStyling"
            style={{ backgroundColor: clicked === items.id ? "grey" : "" }}
          >
            <input
              type="checkbox"
              value={allCheckBoxes}
              checked={
                allCheckBoxes
                  ? true
                  : checkedBoxes.find((p) => p.id === items.id)
              }
              onChange={(e) => toggleCheckbox(e, items)}
            />
            {editMode && editItemId === items.id ? (
              <>
                <textarea id={items.id} type="text" placeholder={items.name} value={edit}
                  onChange={editHandler}
                  name="edit" />
                <button className="buttonsStyling"
                  onClick={() => {setEditMode(false); items.name = edit}}>
                  Save
                </button>
              </>
            ) : (
              <div>{items.name}</div>
            )}
            <div>{items.email}</div>
            <div>{items.role}</div>
            <div style={{ display: "flex", justifyContent: "unset" }}>
              <div style={{ height: "30px", width: "30px" }}>
                <Icon name="edit" onClick={() => { setEditItemId(items.id); setEditMode(true) }} />
              </div>
              <div style={{ height: "30px", width: "30px" }}>
                <Icon name="delete" onClick={() => deleteHandler(items.id)} />
              </div>
            </div>
          </div>
        );
      })}
      <div className="lowerButtonsStyling">
        <div>
          <button
            style={{borderRadius: "15px", color: "white",backgroundColor: "red" }}
            onClick={() => deleteAllHandler(checkedBoxes)}
          >
            Delete Selected
          </button>
        </div>
        <div style={{ margin: "10px" }}>
          <Pagination
            TotalPages={totalPages}
            SetCurrentPage={setCurrentPage}
            CurrentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
