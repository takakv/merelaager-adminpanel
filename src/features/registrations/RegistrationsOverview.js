import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectShiftRegistrations } from "./registrationsSlice";

const ShiftOverviewCounter = ({ counterName, value }) => (
  <div className="c-regList-counter">
    {counterName}: <span className="u-mono">{value}</span>
  </div>
);

ShiftOverviewCounter.propTypes = {
  counterName: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

const RegistrationsOverview = ({ shiftNr }) => {
  const registrations = useSelector((state) =>
    selectShiftRegistrations(state, shiftNr)
  );

  const regCounters = {
    M: { value: 0, name: "poisid" },
    F: { value: 0, name: "tüdrukud" },
    total: { value: 0, name: "kokku" },
  };

  const resCounters = {
    M: { value: 0, name: "res. poisid" },
    F: { value: 0, name: "res. tüdrukud" },
  };

  registrations.forEach((reg) => {
    if (reg.registered) regCounters[reg.gender].value += 1;
    else resCounters[reg.gender].value += 1;
  });

  regCounters.total.value = regCounters.M.value + regCounters.F.value;

  return (
    <div className="c-regList-counters">
      <div className="c-regList-counters__reg">
        {Object.keys(regCounters).map((key) => (
          <ShiftOverviewCounter
            counterName={regCounters[key].name}
            key={key}
            value={regCounters[key].value}
          />
        ))}
      </div>
      <div className="c-regList-counters__res">
        {Object.keys(resCounters).map((key) => (
          <ShiftOverviewCounter
            counterName={resCounters[key].name}
            key={key}
            value={resCounters[key].value}
          />
        ))}
      </div>
    </div>
  );
};

RegistrationsOverview.propTypes = {
  shiftNr: PropTypes.number.isRequired,
};

export default RegistrationsOverview;
