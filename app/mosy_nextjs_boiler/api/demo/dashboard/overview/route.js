import {mosyFlexSelect} from '../../../apiUtils/dataControl/dataUtils';

export async function GET() {
      // ✅ Provide default fallbacks
      const fuelByType = {
        tbl: 'fuel_inventory',
        colstr: btoa("fuel_type , count(*) as value"), // default to *
        q : btoa("group by fuel_type") 
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
 
      const fuelByTypeData = await mosyFlexSelect(fuelByType);
      const salesByStationData = await mosyFlexSelect(salesByStation);
      const clientsByStationData = await mosyFlexSelect(clientsByStation);

      const chartData = [
        {
          title: "Fuel by type",
          chartType: "doughnut",
          dataKey: "fuel_type",
          data: fuelByTypeData?.data ?? [],
          containerClass: "col-md-6"
        },
        {
          title: "Sales by station",
          chartType: "pie",
          dataKey: "station_id",
          data: salesByStationData?.data ?? [],
          containerClass: "col-md-6"

        },

        {
          title: "Clients by branch",
          chartType: "bar",
          dataKey: "station_id",
          data: clientsByStationData?.data ?? [],
          series: [{ key: "value", color: "#2663A6", name: "Clients" }],
          height: 350,
          containerClass: "col-md-12"

        },
      ];
      
      //card data 
      const stationsCount = await mosyFlexSelect({tbl:"fuel_stations",colstr:btoa("count(*) as total_stations")})
      const fleetCount = await mosyFlexSelect({tbl:"fuel_fleet",colstr:btoa("count(*) as fleet_count")})
      const clientCount = await mosyFlexSelect({tbl:"fuel_clients_vehicles",colstr:btoa("count(*) as total_clients")})
      const fuelInStock = await mosyFlexSelect({tbl:"fuel_inventory",colstr:btoa("sum(current_stock_litres) as fuel_in_stock")})

      const cardData = [
        {
          title: 'Total stations',
          value: `${stationsCount?.data[0].total_stations}`,
          percentage: '',
          icon: "FaList",
        },
        {
          title: 'Active Fleets',
          value: `${fleetCount?.data[0].fleet_count}`,
          percentage: '',
          icon: "FaTruck",
        },
        {
          title: 'Clients serviced',
          value: `${clientCount?.data[0].total_clients}`,
          percentage: '',
          icon: "FaUsers",
        },
        {
          title: 'Fuel in stock',
          value: `${fuelInStock?.data[0].fuel_in_stock} Litres`,
          percentage: '',
          icon: "FaCheckCircle",
        },
      
      ];

      return Response.json({
        status: "success",
        message: "Chart data ready!",
        chart_data: chartData,
        cards_data: cardData,
      });

}
