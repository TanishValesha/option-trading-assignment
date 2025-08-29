// import { AreaSeries, createChart, ColorType } from 'lightweight-charts';
// import { useEffect, useRef } from 'react';

// const TVChart = props => {
//     const {
//         data,
//         colors: {
//             backgroundColor = 'white',
//             lineColor = '#2962FF',
//             textColor = 'black',
//             areaTopColor = '#2962FF',
//             areaBottomColor = 'rgba(41, 98, 255, 0.28)',
//         } = {},
//     } = props;

//     const chartContainerRef = useRef<HTMLDivElement>(null);

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

//         const newSeries = chart.addSeries(AreaSeries, {
//             lineColor,
//             topColor: areaTopColor,
//             bottomColor: areaBottomColor
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
//     }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

//     // ADD EXPLICIT DIMENSIONS
//     return (
//         <div
//             ref={chartContainerRef}
//             style={{ width: '100%', height: '300px' }}
//         />
//     );
// };

// export default TVChart;