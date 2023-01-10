import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { METRICS_FILTERS, METRICS_DEFAULT_FILTERS } from 'data/metrics';

const MetricsControls = ({ onFilter }) => {

    const [isActive, setActive] = useState(METRICS_DEFAULT_FILTERS.value);

    const toggleClass = (event) => {
        event.preventDefault();
        setActive(event.currentTarget.value);
    };

    /**
     * handleOnFilterChange
     */
    function handleOnFilterChange(event) {
        const { target = {} } = event;
        const { value } = target;
        const label = target.innerHTML;
        onFilter({
            label: label,
            value: value
        });
        toggleClass(event);
    }

    return (
        <div className="metrics-filter">
            { METRICS_FILTERS.map(({label, value} = {}) => {
                return (
                    <button key={value} className={isActive === `${value}` ? "active" : ""} onClick={handleOnFilterChange} value={value}>{label}</button>
                )
            })}
        </div>
    );
}

MetricsControls.propTypes = {
  onFilter: PropTypes.func,
};

export default MetricsControls;