/* eslint-disable react/prop-types */
export default function HeatMapLegend ({range, size}) {

    return (
        <svg id="legend" viewBox={`0 0 ${size.x} ${size.y}`}>
            <g id="legend-axis" />
            {range.map((temp, index) =>
                <rect
                    key={index}
                    height={size.y}
                    width={size.y}
                    
                />
            )}
        </svg>
    )
}