import React from 'react';

const Pagination = (props) => {
    const list = [];

    for (let i = 1; i <= props.TotalPages; i++) {
      list.push(
        <button
          key={i + 1}
          style={{ margin: "10px" }}
          onClick={() => props.SetCurrentPage(i)}
          disabled={props.TotalPages < i}
        >
          {i}
        </button>
      );
    }
    return(<>
    <button
            style={{ margin: "10px" }}
            onClick={() => props.SetCurrentPage(1)}
            disabled={props.CurrentPage === 1}
          >
            First
          </button>
          <button
            style={{ margin: "10px" }}
            onClick={() =>
                props.SetCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
            }
            disabled={props.CurrentPage === 1}
          >
            prev
          </button>
          {list}
          <button
            style={{ margin: "10px" }}
            onClick={() =>
                props.SetCurrentPage((prev) => (prev < props.TotalPages ? prev + 1 : prev))
            }
            disabled={props.CurrentPage === props.TotalPages}
          >
            Next
          </button>
          <button
            style={{ margin: "10px" }}
            onClick={() => props.SetCurrentPage(props.TotalPages)}
            disabled={props.CurrentPage === props.TotalPages}
          >
            Last
          </button>
    </>)
}

export default Pagination;