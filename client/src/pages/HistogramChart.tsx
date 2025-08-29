// import { HistogramSeries, createChart, ColorType } from 'lightweight-charts';
// import React, { useEffect, useRef } from 'react';

// const HistogramChart = props => {
//     const {
//         data,
//         colors: {
//             backgroundColor = 'white',
//             textColor = 'black',
//             color = '#26a69a',
//         } = {},
//     } = props;

//     const chartContainerRef = useRef(null);
//     console.log(data);

//     useEffect(() => {
//         if (!chartContainerRef.current || !data || data.length === 0) return;

//         const chart = createChart(chartContainerRef.current, {
//             layout: {
//                 background: { type: ColorType.Solid, color: backgroundColor },
//                 textColor,
//             },
//             width: 800, // Set explicit width instead of clientWidth
//             height: 300,
//         });

//         const handleResize = () => {
//             if (chartContainerRef.current) {
//                 chart.applyOptions({ width: chartContainerRef.current.clientWidth });
//             }
//         };

//         const newSeries = chart.addSeries(HistogramSeries, {
//             color,
//         });

//         // Log data to debug
//         console.log('Chart data:', data);
//         newSeries.setData(data);
//         chart.timeScale().fitContent();

//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//             chart.remove();
//         };
//     }, [data, backgroundColor, textColor, color]);

//     // ADD EXPLICIT DIMENSIONS
//     return (
//         <div
//             ref={chartContainerRef}
//             style={{ width: '100%', height: '300px' }}
//         />
//     );
// };

// export default HistogramChart;