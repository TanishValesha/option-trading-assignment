// import { Chart, AreaSeries } from 'lightweight-charts-react-wrapper';

// const SampleChart = props => {
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

//     const chartOptions = {
//         width: 800,
//         height: 300,
//         layout: {
//             backgroundColor,
//             textColor,
//         },
//         grid: {
//             vertLines: {
//                 color: 'rgba(197, 203, 206, 0.5)',
//             },
//             horzLines: {
//                 color: 'rgba(197, 203, 206, 0.5)',
//             },
//         },
//         timeScale: {
//             borderColor: 'rgba(197, 203, 206, 0.8)',
//         },
//     };

//     return (
//         <Chart {...chartOptions}>
//             <AreaSeries
//                 data={data}
//                 lineColor={lineColor}
//                 topColor={areaTopColor}
//                 bottomColor={areaBottomColor}
//             />
//         </Chart>
//     );
// };

// export default SampleChart;