import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { handleAPI, handleSaveWindowSize } from "./CommonFunctions";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function PreviousAnnouncement(props) {
  const { UserId, SessionId, Type } = props;
  const [products, setProducts] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  useEffect(() => {
    document.title = "Previous Announcement";
    GetPrevAnnouncement(); // Call GetPrevAnnouncement on component mount
  }, []); // Empty dependency array ensures it runs once on mount

  const GetPrevAnnouncement = () => {
    handleAPI({
      name: "GetPrevAnnouncement",
      params: {
        EmpNum: 1,
      },
    })
      .then((response) => {
        const responseData = JSON.parse(response || "[]");
        setProducts(responseData);
      })
      .catch((err) => console.error("Error from PostAnnouncement ====> ", err));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust the format as per your requirement
  };

  const fnDeleteAnnouncement = (Id) => {
    handleAPI({
      name: "DeleteAnnouncement",
      params: {
        Id: Id,
      },
    })
      .then((response) => {
        const responseData = JSON.parse(response || "[]");
        setProducts(responseData);
      })
      .catch((err) =>
        console.error("Error from DeleteAnnouncement ====> ", err)
      );
    return false;
  };

  const RemoveIcon = ({ onClick = () => {} }) => {
    return (
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAbCAYAAABiFp9rAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOdSURBVHgB7VY9aBRBFJ6Zvdud+zHkRGNOQ0SMIilEPSxCVIJgJSFaJLEwP/iDomApqAmJGhvTqIX4U2gkjSTBYEgpKCJIlESjHpFrLCKoJ0bM7+7d7vje3azMbS5HChvBBx8zO/PNfO/tznuzhPy3v2kdHR0MGpYIBrdji2NCCJqPi+PIf+v375BcKlHQkKjFYjH/BOeXEpyLd5wfhTGfnFMNN2P19fUacI8g9yPnF2tqajJccGBJkczCyspK/T3nXbjQxRjnx2FOlxu4HqMwco+p3Djnl2Hcjw4TJTJNjQYi0a4nErGVhPSoHoBCbauuT95Jpcbj8TgpKSlhwWBQezI93cIJuatyYcM9Bykd7nGcL/DoqFGorw3DDjw1jOZ1lN7whvxLiBMx03xQVlZGh5LJpjClt72cz0KcqTHN+9A1AWlXzCvkj0QifGpqKjhkGIe3UHrVu9F3IU7ha4hQetM7N0Hp2UZKe+fA4HEBkFpKCCMyAEFAqE/XD21j7ApZhr1xnAv1lvUQurMSphTKnAotzxpWVFTE0AYISVQJ8TVK6d5CImOEtDWY5oCMAgUsgE2Ub6QKudEJ0zRpOp0Wtm2zPttO7GJsSbFRx2lvJqQfuCgyj2JwclPJZNJ2o8l4r6wR0gNbeoVY4JxbPsWzReFn51LhcDgjgn04mTnReIVUQxKemPSwEHVbC3wn/IaPGaubmZlJw2nENTbk2iLHaH4nM+P6iGG05jtd+eybEKerTfMeyX4fFBKFhNys942BSL48eeE4XdhWM9bmnfspxMmd2RxKe8W8rw5LkG+c85Z8IiOEdLZa1iDg0YjjdHrniym99QochArDoNDmFFdvHrHngUCsVIiX3k1GCWlvcpxB9NayLKrrOusl5MB2xrq83E+2XbUvlXotI/uzeU5Eu+fn4z+E6M4RgSPcuLDQDwKziEAgMA1pNtdgWf2YQyoX14LIB1LgukBRrApFgOgzw7iG1Riqw3l43gwohyNcAu1KCeyXG4axaUDXzyEX14RCoVK5h15ICCdX4IaQP+u7Na0WNtoIY2WA1TgHCACgaJMwYBXOAXcDcPdDWy4dQJ6fFLgA/dFoFOtcMWANXAVrsZURrJCO+PCykxuFABHJKZUixdKZnPJGPf3M0ZbQZJR4RNMKhMLXvFxM2snJSZdLiCefsiPZ29Ot4npFRYXhRiH/I3KcRL4SnUHy3KwFTRFc1s+Gy5fOLOvn5N+339VLWdnMAWKYAAAAAElFTkSuQmCC"
        className="close-img"
        alt="Remove"
        width="25px"
        height="25px"
        onClick={onClick}
      ></img>
    );
  };

  const renderSubjectColumn = (rowData) => {
    return (
      <a href="#" onClick={() => handleSubjectClick(rowData.Id)}>
        {rowData.Subject}
      </a>
    );
  };

  const handleSubjectClick = async (announcementId) => {
    const windowPosition = await handleSaveWindowSize({
      Type: "VA",
      SessionId,
      Flag: 0,
    });

    const positionData = JSON.parse(
      JSON.parse(windowPosition)["Table"][0].Column1
    );
    const width = positionData["Width"];
    const height = positionData["Height"];
    const currentView = positionData["CurrentView"];
    var url =
      "https://www.solutioncenter.biz/DWAnnouncements/index.html?Id=" +
      announcementId +
      "&Type=VA&SessionId=" +
      SessionId;
    window.open(
      url,
      "_blank",
      `height=${height}px,width=${width}px,resizable=1,scrollbars=yes`
    );
  };
  const onPage = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };
  return (
    <div
      className="col-xs-12 col-sm-12 col-md-12 col-lg-12 container-wrapper"
      id="div2"
      style={{ width: "100%", justifyContent: "center", display: "flex" }}
    >
      <div className="divContainer-1 card-1">
        <div className="Container-Header Header">
          <div className="clsDivTop">
            <div
              className="Container-Title Title"
              style={{ marginBottom: "7px" }}
            >
              Previous announcements
            </div>

            <div style={{ flex: 1, marginBottom: "7px" }}>
              <span className="p-input-icon-left">
                <InputText
                  type="search"
                  className="clsSearchBox"
                  onInput={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search"
                />
              </span>
            </div>
          </div>
        </div>
        <div className="card">
          <DataTable
            value={products}
            globalFilter={globalFilter}
            paginator
            first={first}
            rows={rows}
            onPage={onPage}
            rowsPerPageOptions={[10, 20, 50, 100]}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              field="From"
              header="From"
              sortable
              body={(rowData) => rowData.From}
            ></Column>
            <Column
              field="Subject"
              header="Subject"
              sortable
              body={renderSubjectColumn}
            ></Column>
            <Column
              field="Date"
              header="Date"
              sortable
              body={(rowData) => rowData.announcedWhen}
            ></Column>
            <Column
              field="Delete"
              header="Delete"
              body={({ Id }) => (
                <RemoveIcon onClick={() => fnDeleteAnnouncement(Id)} />
              )}
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}
