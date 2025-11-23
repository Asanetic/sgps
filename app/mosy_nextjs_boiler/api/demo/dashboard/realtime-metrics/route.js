import {mosyFlexSelect} from '../../../apiUtils/dataControl/dataUtils';

export async function GET() {
      // ✅ Provide default fallbacks
      const fleetPerformance = {
        tbl: 'fuel_deliveries',
        colstr: btoa("delivered_by , count(*) as value"), // default to *
        q : btoa("group by delivered_by") 
      };

      const salesByStation = {
        tbl: 'fuel_sales',
        colstr: btoa("fuel_station_id , count(*) as value"), // default to *
        q : btoa("group by fuel_station_id") 
      };

      const clientsByStation = {
        tbl: 'fuel_clients_vehicles',
        colstr: btoa("station_id , count(*) as value"), // default to *
        q : btoa("group by station_id") 
      };

      
      //chart data 
      const mutations = {}
 
      const fleetPerformanceData = await mosyFlexSelect(fleetPerformance);
      const salesByStationData = await mosyFlexSelect(salesByStation);
      const clientsByStationData = await mosyFlexSelect(clientsByStation);

      const chartData = [
        {
          title: "Fuel by station",
          chartType: "bar",
          dataKey: "station_id",
          data: clientsByStationData?.data ?? [],
          series: [{ key: "value", color: "#481F11", name: "Fuel Level" }],
          height: 350,
          containerClass: "col-md-6"

        },

        {
          title: "Sales by station",
          chartType: "bar",
          dataKey: "station_id",
          data: salesByStationData?.data ?? [],
          series: [{ key: "value", color: "#000000", name: "Sales done" }],
          height: 350,
          containerClass: "col-md-6"

        },

        {
          title: "Fleet delivery performance",
          chartType: "pie",
          dataKey: "delivered_by",
          data: fleetPerformanceData?.data ?? [],
          containerClass: "col-md-6"

        },

        {
          title: "Current Fuel Dispensing per Station",
          chartType: "doughnut",
          dataKey: "station_id",
          data: salesByStationData?.data ?? [],
          containerClass: "col-md-6"

        },        

      ];
      
      //card data 
      const stationsCount = await mosyFlexSelect({tbl:"fuel_stations",colstr:btoa("count(*) as total_stations")})
      const fleetCount = await mosyFlexSelect({tbl:"fuel_fleet",colstr:btoa("count(*) as fleet_count")})
      const idleFleetCount = await mosyFlexSelect({tbl:"fuel_fleet",colstr:btoa("count(*) as fleet_count")})
      const salesToday = await mosyFlexSelect({tbl:"fuel_sales",colstr:btoa("sum(total_amount) as total_amount")})
      const fuelInStock = await mosyFlexSelect({tbl:"fuel_inventory",colstr:btoa("sum(current_stock_litres) as fuel_in_stock")})

      const cardData = [
        {
          title: 'Fleet On Duty',
          value: `${fleetCount?.data[0].fleet_count}`,
          percentage: '',
          icon: "FaTruck",
        },
        {
          title: 'Idle Fleets',
          value: `${idleFleetCount?.data[0].fleet_count}`,
          percentage: '',
          icon: "FaCopy",
        },
        {
          title: 'Fuel Stock Levels',
          value: `${fuelInStock?.data[0].fuel_in_stock} ltrs`,
          percentage: '',
          icon: "FaCheckCircle",
        },
        {
          title: 'Sales today',
          value: `KES ${salesToday?.data[0].total_amount}`,
          percentage: '',
          icon: "FaCreditCard",
        },
      
      ];

      return Response.json({
        status: "success",
        message: "Chart data ready!",
        chart_data: chartData,
        cards_data: cardData,
      });

}
