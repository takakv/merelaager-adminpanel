import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { fetchStaff, getStaffList } from "./staffListSlice";
import { getShift } from "../userData/userDataSlice";

const StaffEntry = (props) => {
  const { staff } = props;
  let role;
  switch (staff.role) {
    case "boss":
      role = "Juhataja";
      break;
    case "full":
      role = "Kasvataja";
      break;
    case "part":
      role = "Abikasvataja";
      break;
    default:
      role = "?";
      break;
  }

  return (
    <div className="c-teambox-entry">
      <div>
        <p>{staff.name}</p>
        <p className="c-teambox-role">{role}</p>
      </div>
      <div
        className={`c-teambox-icons ${staff.linked ? "_unlocked" : "_locked"}`}
      >
        <span className="material-icons lock">
          lock{staff.linked ? "_open" : ""}
        </span>
      </div>
    </div>
  );
};

StaffEntry.propTypes = {
  staff: PropTypes.objectOf(PropTypes.any).isRequired,
};

const StaffList = () => {
  const dispatch = useDispatch();
  const staffList = useSelector(getStaffList);
  const staffListStatus = useSelector((state) => state.staffList.status);
  const staffListError = useSelector((state) => state.staffList.error);

  const shiftNr = useSelector(getShift);

  useEffect(() => {
    if (staffListStatus === "idle") dispatch(fetchStaff(shiftNr));
  });

  const bossList = [];
  const fullList = [];
  const partList = [];

  const sortList = (a, b) => a.name.localeCompare(b.name);

  switch (staffListStatus) {
    case "ok":
      Object.values(staffList).forEach((staff) => {
        switch (staff.role) {
          case "boss":
            bossList.push(staff);
            break;
          case "full":
            fullList.push(staff);
            break;
          case "part":
            partList.push(staff);
            break;
          default:
            throw new Error("Unknown staff type");
        }
      });
      bossList.sort(sortList);
      fullList.sort(sortList);
      partList.sort(sortList);

      return (
        <div className="c-card">
          <h3>Meeskond</h3>
          {bossList.map((staff) => (
            <StaffEntry key={staff.id} staff={staff} />
          ))}
          {fullList.map((staff) => (
            <StaffEntry key={staff.id} staff={staff} />
          ))}
          {partList.map((staff) => (
            <StaffEntry key={staff.id} staff={staff} />
          ))}
        </div>
      );
    case "fail":
      return <p>{staffListError}</p>;
    default:
      return <p>Laen...</p>;
  }
};

export default StaffList;
