import {mosyFlexSelect} from '../../../apiUtils/dataControl/dataUtils';

export async function GET() {
      // ✅ Provide default fallbacks
      const salesByFuelTypeVolume = {
        tbl: 'fuel_sales',
        colstr: btoa("fuel_type , count(*) as value"), // default to *
        q : btoa("group by fuel_type") 
      };

      const salesByFuelTypeValue = {
        tbl: 'fuel_sales',
        colstr: btoa("fuel_type , sum(total_amount) as value"), // default to *
        q : btoa("group by fuel_type") 
      };

      const salesByStationVolume = {
        tbl: 'fuel_sales',
        colstr: btoa("fuel_station_id , count(*) as value"), // default to *
        q : btoa("group by fuel_station_id") 
      };

      const salesByStationValue = {
        tbl: 'fuel_sales',
        colstr: btoa("fuel_station_id , sum(total_amount) as value"), // default to *
        q : btoa("group by fuel_station_id") 
      };

      
      //chart data 
      const mutations = {}
 
      const salesByFuelTypeData = await mosyFlexSelect(salesByFuelTypeValue);
      const salesByFuelTypeVolumeData = await mosyFlexSelect(salesByFuelTypeVolume);
      const salesByStationData = await mosyFlexSelect(salesByFuelTypeValue);
      const salesByStationVolumeData = await mosyFlexSelect(salesByFuelTypeVolume);

      const chartData = [
        {
          title: "Sales volume by fuel type",
          chartType: "bar",
          dataKey: "fuel_type",
          data: salesByFuelTypeVolumeData?.data ?? [],
          series: [{ key: "value", color: "#481F11", name: "Sold volume (Ltrs)" }],
          height: 350,
          containerClass: "col-md-6"

        },

        {
          title: "Fuel type sale value",
          chartType: "bar",
          dataKey: "fuel_type",
          data: salesByFuelTypeData?.data ?? [],
          series: [{ key: "value", color: "#000000", name: "Sales amount (KES)" }],
          height: 350,
          containerClass: "col-md-6"

        },

        {
          title: "Station sales value",
          chartType: "pie",
          dataKey: "fuel_station_id",
          data: salesByStationData?.data ?? [],
          containerClass: "col-md-6"

        },

        {
          title: "Station sales Volume",
          chartType: "doughnut",
          dataKey: "fuel_station_id",
          data: salesByStationVolumeData?.data ?? [],
          containerClass: "col-md-6"

        },        

      ];
      
      //card data 
      const stationsCount = await mosyFlexSelect({tbl:"fuel_stations",colstr:btoa("count(*) as total_stations")})
      const totalPumps = await mosyFlexSelect({tbl:"fuel_pumps",colstr:btoa("count(*) as fuel_pumps")})
      const idleFleetCount = await mosyFlexSelect({tbl:"fuel_fleet",colstr:btoa("count(*) as fleet_count")})
      const salesToday = await mosyFlexSelect({tbl:"fuel_sales",colstr:btoa("sum(total_amount) as total_amount")})

      const cardData = [
        {
          title: 'Idle Fleet Count',
          value: `${idleFleetCount?.data[0].fleet_count}`,
          percentage: 'More than 3 days',
          icon: "FaTruck",
        },
        {
          title: 'Active stations',
          value: `${stationsCount?.data[0].total_stations}`,
          percentage: 'Last 24 hrs sale',
          icon: "FaList",
        },
        {
          title: 'Active pumps',
          value: `${totalPumps?.data[0].fuel_pumps}`,
          percentage: 'Last sale in 24hrs',
          icon: "FaCheckCircle",
        },
        {
          title: 'Inactive pumps',
          value: `${totalPumps?.data[0].fuel_pumps}`,
          percentage: 'No sale for last 24 hr',
          icon: "FaBolt",
        },
      
      ];

      return Response.json({
        status: "success",
        message: "Chart data ready!",
        chart_data: chartData,
        cards_data: cardData,
      });

}
